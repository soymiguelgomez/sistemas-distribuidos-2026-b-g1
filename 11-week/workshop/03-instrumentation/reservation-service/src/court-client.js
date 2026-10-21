import { performance } from 'node:perf_hooks';
import { formatTraceparent, newSpanId } from './trace-context.js';

export class CourtServiceUnavailable extends Error {}

// Outgoing call of hop 3 in 01-journey.md: GET /api/v1/courts/{id}/bookable-slots.
export function createCourtClient({ baseUrl, logger, timeoutMs = 1000 }) {
  async function bookableSlots(ctx, courtId, date) {
    // Client span: child of the reservation-service server span, same trace_id.
    const span = { ...ctx, parentSpanId: ctx.spanId, spanId: newSpanId() };
    const url = `${baseUrl}/api/v1/courts/${encodeURIComponent(courtId)}/bookable-slots`
      + `?date=${encodeURIComponent(date)}`;
    const started = performance.now();
    const elapsed = () => Math.round(performance.now() - started);
    let response;
    try {
      response = await fetch(url, {
        headers: { traceparent: formatTraceparent(span) },
        signal: AbortSignal.timeout(timeoutMs),
      });
    } catch (err) {
      const timedOut = err.name === 'TimeoutError';
      logger.error(span, timedOut ? 'court.slots.timeout' : 'court.slots.failed',
        timedOut ? `court-service did not answer in ${timeoutMs} ms` : 'court-service unreachable',
        { duration_ms: elapsed(), court_id: courtId, error_code: 'SERVICE_UNAVAILABLE' });
      throw new CourtServiceUnavailable(err.message);
    }

    const fields = { duration_ms: elapsed(), court_id: courtId, http_status: response.status };
    if (response.status === 404) {
      logger.warn(span, 'court.slots.not_found', 'court does not exist', fields);
      return null;
    }
    if (!response.ok) {
      logger.error(span, 'court.slots.failed', 'court-service answered with an error',
        { ...fields, error_code: 'SERVICE_UNAVAILABLE' });
      throw new CourtServiceUnavailable(`court-service answered ${response.status}`);
    }
    logger.info(span, 'court.slots.received', 'court-service answered', fields);
    return response.json();
  }

  return { bookableSlots };
}
