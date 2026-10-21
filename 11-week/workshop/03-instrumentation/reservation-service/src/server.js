import { createServer } from 'node:http';
import { randomBytes } from 'node:crypto';
import { performance } from 'node:perf_hooks';
import { traceContext } from './trace-context.js';
import { CourtServiceUnavailable } from './court-client.js';

const RESERVATIONS = '/api/v1/reservations';

function sendJson(res, status, body) {
  res.writeHead(status, { 'content-type': 'application/json' });
  res.end(JSON.stringify(body));
}

async function readJson(req) {
  let raw = '';
  for await (const chunk of req) raw += chunk;
  return JSON.parse(raw || '{}');
}

// Every whole hour of [startTime, endTime) must be a bookable slot of the court (BR-004).
function rangeIsBookable(bookable, startTime, endTime) {
  const starts = new Set(bookable.slots.map((slot) => slot.startTime));
  const first = Number(startTime.slice(0, 2));
  const last = Number(endTime.slice(0, 2));
  if (last <= first) return false;
  for (let hour = first; hour < last; hour += 1) {
    if (!starts.has(`${String(hour).padStart(2, '0')}:00:00`)) return false;
  }
  return true;
}

async function createReservation(req, res, ctx, { logger, courtClient }) {
  let body;
  try {
    body = await readJson(req);
  } catch {
    body = {};
  }
  const { courtId, reservationDate, startTime, endTime } = body;
  if (![courtId, reservationDate, startTime, endTime].every((value) => typeof value === 'string')) {
    sendJson(res, 400, { error: 'VALIDATION_ERROR', message: 'courtId, reservationDate, startTime and endTime are required', traceId: ctx.traceId });
    return;
  }
  const slot = `${reservationDate}/${startTime.slice(0, 5)}-${endTime.slice(0, 5)}`;
  logger.info(ctx, 'reservation.create.received', 'create reservation requested',
    { court_id: courtId, slot });

  let bookable;
  try {
    bookable = await courtClient.bookableSlots(ctx, courtId, reservationDate);
  } catch (err) {
    if (!(err instanceof CourtServiceUnavailable)) throw err;
    sendJson(res, 503, { error: 'SERVICE_UNAVAILABLE', message: 'Try again later', traceId: ctx.traceId });
    return;
  }
  if (!bookable) {
    sendJson(res, 404, { error: 'COURT_NOT_FOUND', message: 'The requested court was not found', traceId: ctx.traceId });
    return;
  }
  if (bookable.courtStatus !== 'ACTIVE' || !rangeIsBookable(bookable, startTime, endTime)) {
    logger.warn(ctx, 'reservation.create.rejected', 'range is outside the court schedule',
      { court_id: courtId, slot, error_code: 'BUSINESS_RULE_VIOLATION' });
    sendJson(res, 422, { error: 'BUSINESS_RULE_VIOLATION', message: 'The reservation does not satisfy the required business rules', traceId: ctx.traceId });
    return;
  }

  // No database in this module: the reservation is not stored, only answered.
  const reservationCode = randomBytes(5).toString('hex').toUpperCase();
  const hours = Number(endTime.slice(0, 2)) - Number(startTime.slice(0, 2));
  logger.info(ctx, 'reservation.created', 'reservation created',
    { reservation_code: reservationCode, court_id: courtId, slot, reservation_status: 'PENDING' });
  sendJson(res, 201, {
    reservationCode, courtId, reservationDate, startTime, endTime, status: 'PENDING',
    amount: { amount: bookable.hourlyPrice.amount * hours, currency: bookable.hourlyPrice.currency },
  });
}

// Raw URLs never become a metric label: unknown paths are counted as "other".
const KNOWN_ROUTES = new Set(['/health', '/metrics', RESERVATIONS]);

export function createApp({ logger, courtClient, metrics }) {
  return createServer(async (req, res) => {
    const ctx = traceContext(req, res);
    const started = performance.now();
    const route = req.url.split('?')[0];
    logger.info(ctx, 'http.request.received', `${req.method} ${route}`);
    res.on('finish', () => {
      const seconds = (performance.now() - started) / 1000;
      metrics.observe(KNOWN_ROUTES.has(route) ? route : 'other', res.statusCode, seconds);
      logger.info(ctx, 'http.request.completed', `${req.method} ${route} answered`, {
        duration_ms: Math.round(seconds * 1000),
        http_status: res.statusCode,
      });
    });

    try {
      if (req.method === 'GET' && route === '/health') {
        sendJson(res, 200, { status: 'ok' });
      } else if (req.method === 'GET' && route === '/metrics') {
        res.writeHead(200, { 'content-type': 'text/plain; version=0.0.4' });
        res.end(metrics.render());
      } else if (req.method === 'POST' && route === RESERVATIONS) {
        await createReservation(req, res, ctx, { logger, courtClient });
      } else {
        sendJson(res, 404, { error: 'NOT_FOUND', message: 'Route not found', traceId: ctx.traceId });
      }
    } catch (err) {
      logger.error(ctx, 'http.request.failed', 'unexpected error', { error_code: 'INTERNAL_ERROR', error_type: err.name });
      if (!res.headersSent) sendJson(res, 500, { error: 'INTERNAL_ERROR', message: 'Unexpected error', traceId: ctx.traceId });
    }
  });
}
