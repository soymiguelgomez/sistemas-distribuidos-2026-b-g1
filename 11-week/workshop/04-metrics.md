# CP4 - Golden signals and metric catalog

Metrics for the services of the journey in `01-journey.md` (customer creates a reservation).
Names follow Prometheus conventions: snake_case, a unit suffix (`_seconds`), `_total` for
counters. reservation-service names are the ones already exposed by the CP3 code
(`03-instrumentation/reservation-service/src/metrics.js`); the other services do not have code
yet, so their metrics are the design to implement. Where a Spring Boot / Micrometer metric
already exists (HikariCP pool), its standard name is kept.

## api-gateway (:8080)

| Signal | Metric | Type | Labels | PromQL (dashboard) |
|---|---|---|---|---|
| Latency | `gateway_request_duration_seconds` | histogram | `route`, `method` | `histogram_quantile(0.95, sum by (le, route) (rate(gateway_request_duration_seconds_bucket[5m])))` |
| Traffic | `gateway_requests_total` | counter | `route`, `method`, `status_class` | `sum by (route) (rate(gateway_requests_total[5m]))` |
| Errors | `gateway_requests_total` | counter | `status_class="5xx"` | `sum(rate(gateway_requests_total{status_class="5xx"}[5m])) / sum(rate(gateway_requests_total[5m]))` |
| Saturation | `gateway_rate_limited_requests_total` | counter | `route` | `sum by (route) (rate(gateway_rate_limited_requests_total[5m]))` (429s from the rate limiter of `overview.md` section 7) |

## reservation-service (:8083) - core of the journey

| Signal | Metric | Type | Labels | PromQL (dashboard) |
|---|---|---|---|---|
| Latency | `reservation_request_duration_seconds` | histogram | `route` | `histogram_quantile(0.95, sum by (le) (rate(reservation_request_duration_seconds_bucket{route="/api/v1/reservations"}[5m])))` |
| Latency of the downstream hop | `reservation_court_client_duration_seconds` | histogram | `outcome` | `histogram_quantile(0.95, sum by (le) (rate(reservation_court_client_duration_seconds_bucket[5m])))` |
| Traffic | `reservation_requests_total` | counter | `route`, `outcome` | `sum(rate(reservation_requests_total{route="/api/v1/reservations"}[5m]))` |
| Errors | `reservation_requests_total` | counter | `outcome="error"` | `sum(rate(reservation_requests_total{outcome="error"}[5m])) / sum(rate(reservation_requests_total[5m]))` |
| Business rejections | `reservation_requests_total` | counter | `outcome="rejected"` | `sum(rate(reservation_requests_total{outcome="rejected"}[5m]))` (409/422: not errors of the service, but a jump means a broken schedule in court-service) |
| Saturation | `hikaricp_connections_pending` | gauge | `pool` | `max(hikaricp_connections_pending{pool="reservation"})` |
| Saturation | `reservation_outbox_pending_events` | gauge | none | `max(reservation_outbox_pending_events)` (rows of the ADR-006 outbox not yet published) |

`outcome` is computed from the status: `success` (2xx), `rejected` (4xx), `error` (5xx).

## court-service (:8082)

| Signal | Metric | Type | Labels | PromQL (dashboard) |
|---|---|---|---|---|
| Latency | `court_request_duration_seconds` | histogram | `route` | `histogram_quantile(0.95, sum by (le) (rate(court_request_duration_seconds_bucket{route="/api/v1/courts/{id}/bookable-slots"}[5m])))` |
| Traffic | `court_requests_total` | counter | `route`, `outcome` | `sum by (route) (rate(court_requests_total[5m]))` |
| Errors | `court_requests_total` | counter | `outcome="error"` | `sum(rate(court_requests_total{outcome="error"}[5m])) / sum(rate(court_requests_total[5m]))` |
| Saturation | `hikaricp_connections_pending` | gauge | `pool` | `max(hikaricp_connections_pending{pool="court"})` |

## payment-service (:8084) and RabbitMQ (`futbolix.events`)

| Signal | Metric | Type | Labels | PromQL (dashboard) |
|---|---|---|---|---|
| Latency | `payment_event_processing_duration_seconds` | histogram | `event_type` | `histogram_quantile(0.95, sum by (le) (rate(payment_event_processing_duration_seconds_bucket{event_type="ReservationCreated"}[5m])))` |
| Traffic | `payment_events_consumed_total` | counter | `event_type`, `outcome` | `sum by (event_type) (rate(payment_events_consumed_total[5m]))` |
| Errors | `payment_events_consumed_total` | counter | `outcome="error"` | `sum(rate(payment_events_consumed_total{outcome="error"}[5m]))` |
| Errors (duplicates ignored) | `payment_events_consumed_total` | counter | `outcome="duplicate"` | `sum(rate(payment_events_consumed_total{outcome="duplicate"}[5m]))` (rows rejected by `processed_events`; normal at low rate with at-least-once) |
| Saturation | `rabbitmq_queue_messages_ready` | gauge | `queue` | `max by (queue) (rabbitmq_queue_messages_ready)` (from the `rabbitmq_prometheus` plugin; the DLQ must stay at 0) |

## Label cardinality

| Label | Allowed values | Cardinality |
|---|---|---|
| `route` | templated paths of the contracts (`/api/v1/reservations`, `/api/v1/courts/{id}/bookable-slots`, `/health`, `/metrics`, ...) plus `other` | about 15 in all services |
| `method` | `GET`, `POST`, `PUT`, `PATCH`, `DELETE` | 5 |
| `status_class` | `2xx`, `3xx`, `4xx`, `5xx` | 4 |
| `outcome` | `success`, `rejected`, `error`, `duplicate` (consumers only) | 4 |
| `event_type` | `ReservationCreated`, `PaymentApproved`, `PaymentRejected`, `ReservationCancelled` | 4 |
| `queue` | queues bound to `futbolix.events` and their DLQs | under 10 |
| `pool` | one per service schema | 1 per service |

Worst case for one histogram: `gateway_request_duration_seconds` = 15 routes x 5 methods x
8 buckets = 600 series. Every other metric is smaller.

**Forbidden labels and what replaces them:**

| Forbidden | Why | Use instead |
|---|---|---|
| `customer_email`, `customer_name`, `customer_phone` | unbounded and personal data (CP2 "never log") | nothing; not a metric dimension |
| `reservation_code`, `reservation_id`, `event_id` | one series per reservation | the `reservation_code` field in the logs, searched by `trace_id` |
| `trace_id`, `span_id`, `correlation_id` | one series per request | logs and traces (CP1, CP2) |
| raw URL (`/api/v1/reservations/FTX7K2Q9`) | the code inside the path is unbounded | the templated `route`; unknown paths become `other` (already done in CP3 `server.js`) |
| `court_id` | bounded today (four courts), but a uuid that grows with every court added | `route` and the logs; revisit only if a per-court dashboard is required |

## Histogram buckets

Buckets in seconds: `0.05, 0.1, 0.25, 0.5, 1, 2.5, 5` (CP3 `metrics.js`).

- A customer on `/booking` presses "Reservar" and waits on the screen; under about 250 ms it
  feels immediate, so `0.05`-`0.25` show the normal case (an indexed insert plus one internal
  call).
- `0.5` is the P95 threshold already used by the team's `HighLatency` alert in
  `13-operations/observability.md`, so the bucket edge matches the alert and the quantile does
  not need interpolation there.
- `1` is the timeout of the court-service client in CP3: a request above it already failed one
  downstream call.
- `2.5` and `5` keep the slow cases visible: the 3 s Wompi timeout of HU-PAY-006 and the 3 s
  court-service delay of the CP9 drill both land between them. Nothing above 5 s is useful,
  because the customer has already left.

## Limitations

- Quantiles from histograms are estimates inside a bucket; P95 between 1 and 2.5 s is not
  precise.
- `rejected` mixes customer mistakes (`422`) and real races (`409 RESERVATION_SLOT_UNAVAILABLE`);
  the logs (`error_code`) tell them apart.
- Only reservation-service exposes these metrics today (CP3); the rest is the target design.
