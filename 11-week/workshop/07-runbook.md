# CP8 - Runbook: `ReservationCreateFastBurn`

Alert defined in `06-alerts.yml` (`severity: page`). It means: in the last hour more than 7.2 %
of `POST /api/v1/reservations` answered `5xx` at api-gateway, and it is still happening in
the last 5 minutes. With Futbolix traffic (24 reservations a day) one failed request is enough,
and it is already 28 % of the monthly budget (`06-alert-policy.md`).

## 1. Symptoms

- Customers press "Reservar" on `/booking` in `ftx-front` and get an error page instead of the
  reservation code; the response is `503 SERVICE_UNAVAILABLE` or `500 INTERNAL_ERROR` with a
  `traceId` (`ErrorResponse` in `_shared.yaml`).
- `ReservationCreateSlowBurn` may follow if it lasts more than 30 minutes.
- Other journeys (`GET /courts`, lookup by `reservationCode`) may still work.

## 2. Confirm (5 minutes)

**Is it real and how big?** In Prometheus:

```promql
futbolix:reservation_create_errors:ratio_rate5m
sum(increase(gateway_requests_total{route="/api/v1/reservations",method="POST",status_class="5xx"}[1h]))
```

**Which hop fails?** Compare the hops of `01-journey.md`:

```promql
sum by (outcome) (increase(reservation_requests_total{route="/api/v1/reservations"}[15m]))
histogram_quantile(0.95, sum by (le) (rate(reservation_court_client_duration_seconds_bucket[15m])))
sum(increase(court_requests_total{outcome="error"}[15m]))
max(hikaricp_connections_pending{pool="reservation"})
```

- Gateway `5xx` but no reservation-service requests: reservation-service is down or unreachable.
- `reservation_court_client_duration_seconds` P95 near 1 s: court-service is slow (client timeout).
- `hikaricp_connections_pending` > 0 for minutes: PostgreSQL (shared by all schemas, AT-001).

**Follow one failed request by `trace_id`.** Take the `traceId` from a customer's error
response, or find one in the error lines, then read the whole story (CP2 contract):

```bash
docker compose -p futbolix-prod logs --no-log-prefix --since 1h api-gateway reservation-service court-service > logs.jsonl
jq -c 'select(.level=="ERROR") | {timestamp, service, event, trace_id, error_code}' logs.jsonl
jq -c 'select(.trace_id=="<trace_id>")' logs.jsonl
```

Expected events: `court.slots.timeout` or `court.slots.failed` (court-service), or
`http.request.failed` (bug in reservation-service).

## 3. Mitigate (lowest risk first)

Futbolix runs on Docker Compose (`10-devops/environments.md`). There are no feature flags, no
autoscaling and no circuit breaker around court-service today, so the first steps are these:

| # | Action | When | Risk | Command / how |
|---|---|---|---|---|
| 1 | Restart only the failing container | One container is `unhealthy` or stopped (`docker compose ps`) | Low: requests during the restart fail, as they already do | `docker compose -p futbolix-prod restart reservation-service` (or `court-service`) |
| 2 | Roll back the last release | The errors started after a deploy (compare with the release time in `CHANGELOG.md`) | Medium: removes the fixes of that release; a Flyway migration that already ran is not undone | Deploy the previous image tag with the `qa`/`prod` command of `environments.md` |
| 3 | Restart the shared dependency (PostgreSQL or RabbitMQ) | `hikaricp_connections_pending` stays high or every service logs connection errors | High: PostgreSQL is shared by all four schemas (AT-001); every service fails during the restart | Only with the DevOps owner on the call |

Not available yet, and recorded as actions in CP9: a circuit breaker on the court-service client
(Resilience4j, today only around Wompi), a retry for the idempotent `bookable-slots` call
(proposed in CP2) and a feature flag to close online booking with a clear message.

## 4. Escalate

| After | Who | Why |
|---|---|---|
| 0 min | Developer on duty (whoever receives the page) | Confirms and applies mitigation 1 |
| 15 min without recovery | Tech Lead (Hernando) | Decides the rollback (mitigation 2) |
| Infrastructure suspected (PostgreSQL, RabbitMQ, Docker host) | DevOps (Edwin) | Owns mitigation 3 and the `docker-compose.deploy.yml` files |
| 30 min of customer impact, or budget at 100 % | Product Owner (Danna) | Asks the court staff to fall back to the manual WhatsApp or phone booking used before Futbolix (`03-product/problem-framing.md`), and applies the error budget policy of `05-slo.md` |

## 5. Verify recovery

- A test reservation goes through: create one for a free slot and cancel it right away with
  `POST /api/v1/reservations/{reservationCode}/cancellation`, which frees the slot. Its log
  lines show `reservation.created` and no `ERROR` for that `trace_id`.
- `futbolix:reservation_create_errors:ratio_rate5m` is 0 and the alert resolves.
- `reservation_outbox_pending_events` returns to 0 and the DLQ (`rabbitmq_queue_messages_ready`)
  is empty, so no reservation was left without its payment (SLO 3).
- Write in the team channel: start, end, failed requests from the 1 h counter, and the budget
  left. If more than 25 % of the budget was spent, open a postmortem (CP9 format).
