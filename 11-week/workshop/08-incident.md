# CP9 - Incident drill: slow court-service

Simulated incident, not a real one. Everything below (times, ids, durations) is the drill.

**Scenario (from the workshop):** the downstream dependency of the hop I marked in CP1 (hop 3,
reservation-service -> court-service `GET /api/v1/courts/{id}/bookable-slots`) answers in
3 s for 25 % of the requests during 40 minutes.

**Assumed traffic for the drill:** Friday 2026-10-23, 18:00 to 18:40, when customers book the
weekend. I assume 4 `POST /api/v1/reservations` in those 40 minutes, twice the daily average
of 1 per hour (`05-slo.md`). With the average, the 40 minutes would hold less than one request
and the drill would show nothing.

**What the code does:** the court-service client times out at 1000 ms and has no retry
(CP3 `court-client.js`). A 3 s answer is therefore a `503 SERVICE_UNAVAILABLE` after about 1 s.
So 1 of the 4 requests fails; the other 3 are normal.

## Trace of the slow request

trace_id `9b2e7c4d1a0f4e3b8c6d5a4f3e2d1c0b`, request at 18:17:42

- `POST /api/v1/reservations` - api-gateway, SERVER - **1012 ms**, `503`
  - `POST /api/v1/reservations` - reservation-service, SERVER - **1006 ms**, `503`
    - `GET court-service /courts/{id}/bookable-slots` - reservation-service, CLIENT - **1001 ms**, timeout
      - `GET /api/v1/courts/{id}/bookable-slots` - court-service, SERVER - **3004 ms**, `200` (nobody waits for it)
        - `SELECT court schedule` - court-service, DB - **2990 ms**

No `INSERT reservation + outbox` span and no `ReservationCreated`: the reservation was never
created, so SLO 3 (payment recorded) is not affected.

## Four log lines of that trace (CP2 format)

```json
{"timestamp":"2026-10-23T23:17:42.120Z","level":"INFO","service":"api-gateway","version":"2.0.0","environment":"prod","trace_id":"9b2e7c4d1a0f4e3b8c6d5a4f3e2d1c0b","span_id":"1f2e3d4c5b6a7980","correlation_id":"idem-7d41a9c2","event":"http.request.received","message":"POST /api/v1/reservations routed to reservation-service","duration_ms":0}
{"timestamp":"2026-10-23T23:17:43.127Z","level":"ERROR","service":"reservation-service","version":"2.0.0","environment":"prod","trace_id":"9b2e7c4d1a0f4e3b8c6d5a4f3e2d1c0b","span_id":"3a4b5c6d7e8f9012","correlation_id":"idem-7d41a9c2","event":"court.slots.timeout","message":"court-service did not answer in 1000 ms","duration_ms":1001,"court_id":"7c0f4c3e-2a55-4a3b-9f0d-1b8f6e2a9c11","error_code":"SERVICE_UNAVAILABLE"}
{"timestamp":"2026-10-23T23:17:43.132Z","level":"INFO","service":"api-gateway","version":"2.0.0","environment":"prod","trace_id":"9b2e7c4d1a0f4e3b8c6d5a4f3e2d1c0b","span_id":"1f2e3d4c5b6a7980","correlation_id":"idem-7d41a9c2","event":"http.request.completed","message":"POST /api/v1/reservations answered","duration_ms":1012,"http_status":503}
{"timestamp":"2026-10-23T23:17:45.130Z","level":"INFO","service":"court-service","version":"2.0.1","environment":"prod","trace_id":"9b2e7c4d1a0f4e3b8c6d5a4f3e2d1c0b","span_id":"5c6d7e8f90a1b2c3","correlation_id":"idem-7d41a9c2","event":"court.slots.served","message":"bookable slots returned","duration_ms":3004,"court_id":"7c0f4c3e-2a55-4a3b-9f0d-1b8f6e2a9c11","http_status":200}
```

The last line is written 2 s after the customer already got the `503`: court-service keeps
working for a caller that gave up. It also shows the version `2.0.1`, which leads to the cause.
Timestamps are UTC; 23:17 UTC is 18:17 in Bogota.

## SLI values reached

| SLI (`05-slo.md`) | In the 40 minutes | 30-day window (720 requests) | Budget spent |
|---|---|---|---|
| SLO 1 availability (99.5 %) | 3 / 4 = 75 % | 719 / 720 = 99.86 %, still met | 1 / 3.6 = **28 %** |
| SLO 2 latency <= 0.5 s (95 %) | 3 / 4 = 75 % | 719 / 720 = 99.86 %, met | 1 / 36 = **2.8 %** |
| SLO 3 payment recorded (99.5 %) | 3 / 3 = 100 % | not affected | 0 % |

## Which alert fires first, and when

- Minute 0 (18:00): court-service `2.0.1` is deployed. Requests at 18:05 and 18:11 are fast.
- **Minute 18 (18:18), `ReservationCreateFastBurn`**: the failed request of 18:17:42 is the only
  request of the last 5 minutes and the last hour, so both ratios are 100 % > 7.2 %. It fires at
  the next rule evaluation and pages the developer on duty.
- Minute 18, `ReservationCreateSlowBurn` also fires (6 h ratio 1/7 = 14 % > 3 %, 30 m ratio
  100 %). It stays until the failure leaves the 30 m window (about 18:48).
- Minute 23: the fast alert resolves by itself, because the 5 m window is empty again. The
  incident is not over: this is the low-traffic effect described in `06-alert-policy.md`.

## Which runbook step stops the damage

Following `07-runbook.md`: the logs of the trace show `court.slots.timeout`, and
`reservation_court_client_duration_seconds` P95 is at 1 s, so the slow hop is court-service.
Step 1 (restart court-service, minute 24) does not help: the container is healthy, only slow.
**Step 2, roll back court-service to `2.0.0`** (approved by the Tech Lead at minute 34, done
at minute 38) stops the damage; at minute 40 every `bookable-slots` call is under 100 ms again.

## Blameless postmortem - court-service 2.0.1 slow for weekend dates

**Status:** drill. **Severity:** page (fast burn). **Duration:** 40 minutes.

### Timeline (2026-10-23, Bogota time)

| Time | Minute | Event |
|---|---|---|
| 18:00 | 0 | court-service `2.0.1` deployed to `prod` (new schedule query for `bookable-slots`) |
| 18:05, 18:11 | 5, 11 | Two reservations created normally (weekday dates) |
| 18:17:42 | 17 | A reservation for Saturday waits 1 s and gets `503` (trace `9b2e7c4d...`) |
| 18:18 | 18 | `ReservationCreateFastBurn` and `ReservationCreateSlowBurn` fire; developer on duty paged |
| 18:23 | 23 | Fast alert resolves by itself (empty 5 m window); developer keeps investigating |
| 18:24 | 24 | Runbook step 1: court-service restarted; no change (container was healthy) |
| 18:29 | 29 | Logs by `trace_id` show `court.slots.timeout` and court-service `2.0.1` answering in 3 s |
| 18:33 | 33 | Fourth request (weekday) created normally |
| 18:34 | 34 | Escalated to the Tech Lead (15 min after the page); rollback approved |
| 18:38 | 38 | Runbook step 2: court-service rolled back to `2.0.0` |
| 18:40 | 40 | `bookable-slots` P95 under 100 ms; test reservation created and cancelled; incident closed |
| 18:48 | 48 | Slow alert resolves |

### Impact

- **Requests:** 1 of 4 `POST /api/v1/reservations` failed with `503`; 1 customer could not
  book. No reservation was left `PENDING` without payment (SLO 3 untouched).
- **Error budget:** availability 1 / 3.6 = 28 % of the month, about 0.28 x 216 = **60 minutes**
  of budget; latency 1 / 36 = 2.8 %, about 0.028 x 2 160 = **60 minutes** of its budget.
- Under the policy of `05-slo.md`, 28 % consumed is below the 50 % step: releases continue,
  but this postmortem is written because more than 25 % was spent (`07-runbook.md`).

### Root cause

court-service `2.0.1` changed the `bookable-slots` query to read every schedule row of the
court for weekend dates (two opening ranges). The `court` schema had no index for that
filter, so about 25 % of the calls (the weekend ones) took 3 s. reservation-service gives up
after 1 s, so each of them became a `503` for the customer.

### Contributing factors

- No latency check of court-service in `qa` before the release reached `prod`.
- No circuit breaker or retry on the reservation-service client to court-service; Resilience4j
  only protects the Wompi client (`05-architecture/overview.md`).
- Low traffic: one failure in 40 minutes, and the fast alert cleared after 5 minutes, which
  can make the incident look over when it is not.
- Restarting first cost 10 minutes; the trace already pointed to a slow dependency, not a dead
  one.

### Actions (user stories, proposed IDs)

**HU-OBS-001 - Circuit breaker on the court-service client.** As a customer, I want a fast,
clear error when court-service is slow, so that I do not wait for nothing.
- Given court-service answers after 1 s in 5 of the last 10 calls, when a new
  `POST /api/v1/reservations` arrives, then reservation-service answers `503` in under 100 ms
  without calling court-service.
- Given the circuit is open, when 10 s pass and court-service answers in time, then the next
  reservation is created normally.
- The circuit state is exported as a metric and logged as `court.circuit.opened` with the
  `trace_id`; an automated test covers both criteria.

**HU-OBS-002 - One retry for the idempotent `bookable-slots` call.** As a customer, I want a
single slow call to court-service not to cost me the reservation.
- Given the first call times out and the second answers in 50 ms, when I create a reservation,
  then I get `201` and the logs show `attempt: 2` with the same `trace_id`.
- Total time is under 2.2 s; the retry is recorded in an ADR in `ftx-docs`.

**HU-OBS-003 - Latency gate for court-service in `qa`.** As the Tech Lead, I want a release of
court-service to be stopped in `qa` if `bookable-slots` gets slow.
- Given the four courts with weekday and weekend schedules, when the `qa` smoke test calls
  `bookable-slots` 100 times, then P95 is under 100 ms or the promotion to `main` is blocked.
- The test result is attached to the release PR.
