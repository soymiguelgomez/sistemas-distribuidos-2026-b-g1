# CP3 - How to run the reservation-service instrumentation

Minimal module named after `reservation-service` (hop 2-3 of `01-journey.md`). It contains:

| File | What it does |
|---|---|
| `src/trace-context.js` | Reads or creates the W3C `traceparent`, opens the server span, returns it in the response |
| `src/logger.js` | Writes the CP2 contract (`02-log-contract.md`) as one JSON line, drops "never log" fields |
| `src/court-client.js` | Calls court-service `GET /api/v1/courts/{id}/bookable-slots` with a child `traceparent`, 1000 ms timeout |
| `src/metrics.js` | `reservation_requests_total{route,outcome}` counter and `reservation_request_duration_seconds` histogram |
| `src/server.js` | `GET /health`, `POST /api/v1/reservations`, `GET /metrics` |
| `test/trace-propagation.test.js` | Proves the received `trace_id` is the one sent to court-service |

## Stack note

The team's services are specified in Java/Spring Boot (`ftx-docs/05-architecture/overview.md`),
but no service has code yet and this machine has no JDK, Maven or WSL (Docker Desktop could not
start). The module is written in Node.js with **no dependencies** (`node:http`, `node:test`,
global `fetch`), the stack used by the examples of `ftx-docs/13-operations/observability.md`.
In Spring the same pieces would be a `OncePerRequestFilter`, Logback JSON with MDC, a
`RestClient` interceptor and Micrometer.

## Requirements

- Node.js 20 or newer (tested with v24.21.0). Nothing to install: there is no `npm install`.

## Run the tests

```bash
cd 11-week/workshop/03-instrumentation/reservation-service
npm test
```

Real output on my machine (2026-10-20):

```
> reservation-service-observability@2.0.0 test
> node --test

✔ the trace_id received from api-gateway is the one sent to court-service (94.4633ms)
✔ every log line of the request follows the CP2 contract and carries the same trace_id (7.9217ms)
✔ /metrics counts requests by outcome and exposes the latency histogram (2.3649ms)
ℹ tests 3
ℹ pass 3
ℹ fail 0
```

The test starts a fake court-service on a random port that records the `traceparent` it
receives. I checked that the test really catches a broken propagation: on a copy of the module
where the client sends no `traceparent`, the first test fails (`✖ ... pass 2, fail 1`).

## Run the service

```bash
npm start
```

It listens on `:8083` (`PORT`) and calls court-service on `http://localhost:8082`
(`COURT_SERVICE_URL`). court-service does not exist yet, so a `POST` answers `503`. Real
output, sending the `traceparent` that api-gateway would send:

```
POST /api/v1/reservations  traceparent: 00-4c1e9a07d2b84f6e9a3b5c7d1e2f0a11-a1b2c3d4e5f60718-01
-> 503 {"error":"SERVICE_UNAVAILABLE","message":"Try again later","traceId":"4c1e9a07d2b84f6e9a3b5c7d1e2f0a11"}
```

```
reservation-service listening on http://localhost:8083
{"timestamp":"2026-10-21T00:26:20.540Z","level":"INFO","service":"reservation-service","version":"2.0.0","environment":"dev","trace_id":"4c1e9a07d2b84f6e9a3b5c7d1e2f0a11","span_id":"c9ed85f3cfbc2359","correlation_id":"idem-3f6b2c1a","event":"http.request.received","message":"POST /api/v1/reservations","duration_ms":0}
{"timestamp":"2026-10-21T00:26:20.544Z","level":"INFO","service":"reservation-service","version":"2.0.0","environment":"dev","trace_id":"4c1e9a07d2b84f6e9a3b5c7d1e2f0a11","span_id":"c9ed85f3cfbc2359","correlation_id":"idem-3f6b2c1a","event":"reservation.create.received","message":"create reservation requested","duration_ms":0,"court_id":"7c0f4c3e-2a55-4a3b-9f0d-1b8f6e2a9c11","slot":"2026-10-24/18:00-20:00"}
{"timestamp":"2026-10-21T00:26:20.571Z","level":"ERROR","service":"reservation-service","version":"2.0.0","environment":"dev","trace_id":"4c1e9a07d2b84f6e9a3b5c7d1e2f0a11","span_id":"529b706efb164638","correlation_id":"idem-3f6b2c1a","event":"court.slots.failed","message":"court-service unreachable","duration_ms":26,"court_id":"7c0f4c3e-2a55-4a3b-9f0d-1b8f6e2a9c11","error_code":"SERVICE_UNAVAILABLE"}
{"timestamp":"2026-10-21T00:26:20.574Z","level":"INFO","service":"reservation-service","version":"2.0.0","environment":"dev","trace_id":"4c1e9a07d2b84f6e9a3b5c7d1e2f0a11","span_id":"c9ed85f3cfbc2359","correlation_id":"idem-3f6b2c1a","event":"http.request.completed","message":"POST /api/v1/reservations answered","duration_ms":34,"http_status":503}
```

The `ERROR` line has a different `span_id` (the client span) and the same `trace_id`.
`GET /metrics` after that request:

```
reservation_requests_total{route="/api/v1/reservations",outcome="error"} 1
reservation_request_duration_seconds_bucket{route="/api/v1/reservations",le="0.05"} 1
...
reservation_request_duration_seconds_count{route="/api/v1/reservations"} 1
```

## Limitations

- No database and no outbox: a valid reservation is answered with `201 PENDING` but not stored,
  and `ReservationCreated` is not published (hops 4-6 of CP1 are not instrumented).
- No retry yet; the retry in the CP2 example is a proposal.
- `/metrics` is served on the same port; `observability.md` says it must be reachable only
  from the internal network, which the gateway routing would have to enforce.
- Spans are only ids in logs and headers; there is no exporter (Jaeger/Zipkin) behind them.
