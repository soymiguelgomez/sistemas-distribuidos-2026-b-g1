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
