import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { createApp } from '../src/server.js';
import { createLogger } from '../src/logger.js';
import { createCourtClient } from '../src/court-client.js';
import { createMetrics } from '../src/metrics.js';
import { parseTraceparent } from '../src/trace-context.js';

const TRACE_ID = '4c1e9a07d2b84f6e9a3b5c7d1e2f0a11';
const GATEWAY_SPAN = 'a1b2c3d4e5f60718';
const COURT_ID = '7c0f4c3e-2a55-4a3b-9f0d-1b8f6e2a9c11';

const received = [];
const lines = [];
let court;
let app;
let baseUrl;

const listen = (server) => new Promise((resolve) => {
  server.listen(0, () => resolve(`http://localhost:${server.address().port}`));
});

before(async () => {
  // Fake court-service that records the traceparent it receives.
  court = createServer((req, res) => {
    received.push(req.headers.traceparent);
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify({
      courtId: COURT_ID, date: '2026-10-24', courtStatus: 'ACTIVE',
      hourlyPrice: { amount: 60000, currency: 'COP' },
      slots: [{ startTime: '18:00:00', endTime: '19:00:00' }, { startTime: '19:00:00', endTime: '20:00:00' }],
    }));
  });
  const courtUrl = await listen(court);
  const logger = createLogger({
    service: 'reservation-service', version: '2.0.0', environment: 'test',
    write: (line) => lines.push(JSON.parse(line)),
  });
  app = createApp({
    logger, metrics: createMetrics(), courtClient: createCourtClient({ baseUrl: courtUrl, logger }),
  });
  baseUrl = await listen(app);
});

after(() => {
  for (const server of [court, app]) {
    server.closeAllConnections();
    server.close();
  }
});

const createReservation = (startTime, endTime) => fetch(`${baseUrl}/api/v1/reservations`, {
  method: 'POST',
  headers: {
    'content-type': 'application/json',
    'idempotency-key': '3f6b2c1a',
    traceparent: `00-${TRACE_ID}-${GATEWAY_SPAN}-01`,
  },
  body: JSON.stringify({
    courtId: COURT_ID, reservationDate: '2026-10-24', startTime, endTime,
    customerName: 'Juan Perez', customerEmail: 'juan@example.com',
  }),
});

test('the trace_id received from api-gateway is the one sent to court-service', async () => {
  const response = await createReservation('18:00:00', '20:00:00');
  assert.equal(response.status, 201);

  const downstream = parseTraceparent(received.at(-1));
  assert.equal(downstream.traceId, TRACE_ID);
  assert.notEqual(downstream.parentSpanId, GATEWAY_SPAN, 'the client span is a new child span');
  assert.equal(parseTraceparent(response.headers.get('traceparent')).traceId, TRACE_ID);
});

test('every log line of the request follows the CP2 contract and carries the same trace_id', async () => {
  lines.length = 0;
  const response = await createReservation('21:00:00', '23:00:00');
  assert.equal(response.status, 422);

  const required = ['timestamp', 'level', 'service', 'version', 'environment', 'trace_id',
    'span_id', 'correlation_id', 'event', 'message', 'duration_ms'];
  for (const line of lines) {
    for (const field of required) assert.ok(field in line, `${line.event} is missing ${field}`);
    assert.equal(line.trace_id, TRACE_ID);
    assert.equal(line.correlation_id, 'idem-3f6b2c1a');
  }
  const rejected = lines.find((line) => line.event === 'reservation.create.rejected');
  assert.equal(rejected.error_code, 'BUSINESS_RULE_VIOLATION');
  assert.ok(!JSON.stringify(lines).includes('juan@example.com'), 'customer email must never be logged');
});

test('/metrics counts requests by outcome and exposes the latency histogram', async () => {
  const text = await (await fetch(`${baseUrl}/metrics`)).text();
  assert.match(text, /reservation_requests_total\{route="\/api\/v1\/reservations",outcome="success"\} 1/);
  assert.match(text, /reservation_requests_total\{route="\/api\/v1\/reservations",outcome="rejected"\} 1/);
  assert.match(text, /reservation_request_duration_seconds_count\{route="\/api\/v1\/reservations"\} 2/);
});
