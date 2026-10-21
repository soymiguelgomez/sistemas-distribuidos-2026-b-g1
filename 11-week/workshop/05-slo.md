# CP6 - SLIs, SLOs and error budget

Journey: a customer creates a reservation (`01-journey.md`). The SLIs use the metrics of
`04-metrics.md`. Window for every SLO: **30 days, rolling**.

## Traffic estimate

Futbolix has four courts. The minimum the business must sell to be profitable is **6
reservations per court per day**, so **24 reservations per day** (6 x 4). I use this minimum
as the traffic of the journey: it is the number the product cannot go below, and the SLOs must
protect it.

| | Value |
|---|---|
| `POST /api/v1/reservations` per day | 24 |
| per 30 days | 24 x 30 = **720** valid requests |
| minutes in 30 days | 30 x 24 x 60 = **43 200** |

Each reservation is one `POST /reservations` and one `ReservationCreated` event for
payment-service, so the third SLO has the same volume (720 events).

## SLO 1 - Availability of reservation creation

- **SLI:** valid `POST /api/v1/reservations` requests that do not end in `5xx` / all valid
  requests. `409 RESERVATION_SLOT_UNAVAILABLE` and `422 BUSINESS_RULE_VIOLATION` count as
  good: the service worked and said no.
- **Measured at api-gateway**, not at reservation-service: if reservation-service is down it
  exports nothing, and its own counter would hide the outage.
- **Target:** 99.5 % in 30 days.

```promql
sum(increase(gateway_requests_total{route="/api/v1/reservations",method="POST",status_class!="5xx"}[30d]))
/
sum(increase(gateway_requests_total{route="/api/v1/reservations",method="POST"}[30d]))
```

**Error budget:** 0.5 % of 720 = **3.6 failed requests per month** (in practice 3), or
0.5 % of 43 200 = **216 minutes** of total outage.

Why 99.5 % and not 99.9 %: 99.9 % would allow 0.72 failed requests a month, so a single
failure would break the SLO. A reservation is made for a later time (`reservationDate`,
`startTime`), so a customer who gets a `503` can usually retry minutes later; losing a few
attempts a month is acceptable, losing hours of booking is not.

## SLO 2 - Latency of reservation creation

- **SLI:** `POST /api/v1/reservations` answered in 0.5 s or less / all of them.
- **Target:** 95 % in 30 days.
- **Why 0.5 s:** it is the P95 threshold of the team's `HighLatency` alert in
  `ftx-docs/13-operations/observability.md`, and it is a bucket edge of the CP4 histogram, so
  the SLI is exact and not interpolated. The customer waits on the `/booking` screen after
  pressing "Reservar".

```promql
sum(increase(reservation_request_duration_seconds_bucket{route="/api/v1/reservations",le="0.5"}[30d]))
/
sum(increase(reservation_request_duration_seconds_count{route="/api/v1/reservations"}[30d]))
```

**Error budget:** 5 % of 720 = **36 slow requests per month**, or 5 % of 43 200 = **2 160
minutes** (36 hours) in which every request could be slow.

## SLO 3 - Payment recorded for every reservation (product-specific)

A reservation is only useful if payment-service records its `PENDING` payment; otherwise the
customer cannot pay, the slot stays blocked and the money is lost (failure point of step 5-6
in `01-journey.md`).

- **SLI:** `ReservationCreated` events consumed by payment-service with outcome `success` /
  events with outcome `success` or `error`. Duplicates (`outcome="duplicate"`, rejected by
  `processed_events`) are not valid events and are excluded.
- **Target:** 99.5 % in 30 days.

```promql
sum(increase(payment_events_consumed_total{event_type="ReservationCreated",outcome="success"}[30d]))
/
sum(increase(payment_events_consumed_total{event_type="ReservationCreated",outcome=~"success|error"}[30d]))
```

**Error budget:** 0.5 % of 720 = **3.6 events per month** (3) that end in the DLQ, or
**216 minutes** in which payment-service could fail to record payments.

Known gap: an event lost before it reaches RabbitMQ (outbox relay down) is never consumed, so
this SLI does not see it. `reservation_outbox_pending_events` (CP4) covers that case.

## Error budget policy

Owners by role: Tech Lead, Product Owner, DevOps and the developers of the team.

| Budget consumed (any SLO) | What the team does |
|---|---|
| **50 %** | The developer on duty reviews every failed request of the window by `trace_id` (CP2 logs) and writes the cause in the daily. Releases continue normally. |
| **75 %** | No new features on reservation-service, court-service or payment-service. Only fixes and reliability stories (for example the court-service retry policy proposed in CP2). Every PR to `develop` on those services needs Tech Lead approval. |
| **100 %** | Release freeze on the journey services except fixes. A blameless postmortem is written (as in CP9). The Product Owner puts the reliability stories at the top of the next sprint. The freeze ends when the 30-day SLI is back above the target. |

## Limitations

- **Low volume.** With 720 requests a month, one failed request is 1 / 3.6 = 28 % of the
  availability budget: two failures already pass the 50 % step. The SLO is honest, but each
  failure matters, and alerting on so few events is noisy (CP7).
- The traffic is the business minimum, not a measurement. Weekends or evenings may carry most
  of it; with real traffic the targets must be recomputed.
- No service of the journey has code, so none of these SLIs can be measured yet; SLO 2 is the
  only one whose metric already exists (CP3 `reservation-service`).
