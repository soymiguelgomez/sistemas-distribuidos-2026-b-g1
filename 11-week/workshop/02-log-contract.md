# CP2 - Structured log contract

Every Futbolix service (api-gateway, reservation-service, court-service, payment-service,
user-service) writes **one JSON object per line** to stdout with the fields below. Same names,
same types, in every service. This extends the minimum fields already listed in
`ftx-docs/13-operations/observability.md` and replaces its `correlationId` (camelCase) with the
snake_case names used here, so one query works in all services.

## Common fields

| Field | Type | Required | Example | Why it exists |
|---|---|---|---|---|
| `timestamp` | string, ISO-8601 UTC with ms | yes | `2026-10-20T23:15:02.104Z` | Order the events of one trace across services; UTC avoids the America/Bogota offset |
| `level` | string: `ERROR`, `WARN`, `INFO`, `DEBUG` | yes | `WARN` | Filter what needs attention |
| `service` | string | yes | `reservation-service` | Know which container wrote the line |
| `version` | string, semver | yes | `2.0.0` | Tie a failure to a release (MVP 2 is `v2.0.0`) |
| `environment` | string: `dev`, `qa`, `prod` | yes | `qa` | Matches the `develop` / `qa` / `main` branches; never mix QA and prod logs |
| `trace_id` | string, 32 hex | yes | `4c1e9a07d2b84f6e9a3b5c7d1e2f0a11` | Join every line of one request; same value as `traceId` in `ErrorResponse` (`_shared.yaml`) |
| `span_id` | string, 16 hex | yes | `7a2f0c9e1b3d5f80` | Know which hop of the span tree (CP1) wrote the line |
| `correlation_id` | string | yes | `idem-3f6b2c1a` | The `Idempotency-Key` of `POST /reservations`, prefixed `idem-`. It links several traces of the same booking attempt (a browser retry starts a new trace but keeps the key) |
| `event` | string, `domain.object.action` | yes | `court.slots.timeout` | Stable name for queries and counters; the message can change, the event cannot |
| `message` | string | yes | `court-service did not answer in 1000 ms` | Human text, never personal data |
| `duration_ms` | integer | yes (0 if not timed) | `1001` | Latency per hop without a tracing backend |

## Domain fields (Futbolix)

| Field | Type | Required | Example | Why it exists |
|---|---|---|---|---|
| `reservation_code` | string `^[A-Z0-9]+$` | when it exists | `FTX7K2Q9` | The code the customer reads on the confirmation page; support searches by it. It also links the reservation trace with the later checkout trace (CP1) |
| `court_id` | string, uuid | when known | `7c0f4c3e-2a55-4a3b-9f0d-1b8f6e2a9c11` | One of the four courts; shows if a failure is limited to one court or its schedule |
| `slot` | string `date/start-end` | on create | `2026-10-24/18:00-20:00` | The requested range; needed to explain a `409 RESERVATION_SLOT_UNAVAILABLE` or `422` |
| `reservation_status` | string: `PENDING`, `CONFIRMED`, `CANCELLED` | on state change | `PENDING` | Follow the saga of ADR-010 without reading the `reservation` schema |
| `error_code` | string from the contracts | on WARN/ERROR | `BUSINESS_RULE_VIOLATION` | Same `error` value returned in `ErrorResponse`, so a customer complaint maps to a log line |
| `event_id` | string, uuid | on AMQP publish/consume | `b3a1d6e2-8f4c-4a7b-9e21-5c0d7f3a6b18` | `eventId` of `ReservationCreated`; proves a duplicate delivery was ignored by `processed_events` |
| `http_status` | integer | on request end | `422` | Outcome of the request at that hop |
| `attempt` | integer | on retries | `2` | Shows that a retry happened and how many |

## Never log

| Data | Where it appears in Futbolix | Rule |
|---|---|---|
| `customerName` | `CreateReservationRequest`, `ReservationCreated` payload | Not logged. Use `reservation_code` |
| `customerEmail` | same | Masked if ever needed: `j***@example.com` |
| `customerPhone` | `CreateReservationRequest` | Masked: `******4567` |
| Administrator password | user-service login (HU-ADM-001) | Never, not even masked |
| JWT (`Authorization` header) | api-gateway, admin routes | Never. Log only the `sub` claim as `admin_id` |
| Wompi private key and events secret | payment-service config | Never. They live in env variables only |
| `X-Event-Checksum` of the Wompi webhook | payment-service | Log only `checksum_valid: true/false` |
| Card data | Wompi checkout | Futbolix never receives it (SEQ-04); if a field looks like a card number, drop it |
| Full request or event bodies | all services | Never dumped; log the fields of this contract only |

## Levels

| Level | When the team uses it | Futbolix example |
|---|---|---|
| `ERROR` | The request or message failed because of us or a dependency, and the customer is affected (5xx, message sent to the DLQ) | court-service timed out on the last attempt, `503 SERVICE_UNAVAILABLE` |
| `WARN` | Something abnormal that was recovered, or a rejection caused by the client or a business rule | first court-service call timed out and the retry worked; `422 BUSINESS_RULE_VIOLATION` |
| `INFO` | A normal business milestone | `reservation.created` with status `PENDING`; `payment.recorded` |
| `DEBUG` | Detail for development; off in `qa` and `prod` | the slot list returned by `GET /courts/{id}/bookable-slots` |

## Example: one failed `POST /api/v1/reservations` (illustrative, all with the same trace_id)

The customer asks for 21:00-23:00 on court 7c0f...; the first call to court-service times out
(failure 1, downstream timeout), the retry works, and the range is outside the court schedule
(failure 2, business rule). The retry policy (1 retry, 1000 ms timeout, only on this idempotent
GET) is a proposal of this workshop, not yet in `05-architecture/overview.md`.

```json
{"timestamp":"2026-10-20T23:15:02.104Z","level":"INFO","service":"api-gateway","version":"2.0.0","environment":"qa","trace_id":"4c1e9a07d2b84f6e9a3b5c7d1e2f0a11","span_id":"a1b2c3d4e5f60718","correlation_id":"idem-3f6b2c1a","event":"http.request.received","message":"POST /api/v1/reservations routed to reservation-service","duration_ms":0}
{"timestamp":"2026-10-20T23:15:02.111Z","level":"INFO","service":"reservation-service","version":"2.0.0","environment":"qa","trace_id":"4c1e9a07d2b84f6e9a3b5c7d1e2f0a11","span_id":"7a2f0c9e1b3d5f80","correlation_id":"idem-3f6b2c1a","event":"reservation.create.received","message":"create reservation requested","duration_ms":0,"court_id":"7c0f4c3e-2a55-4a3b-9f0d-1b8f6e2a9c11","slot":"2026-10-24/21:00-23:00"}
{"timestamp":"2026-10-20T23:15:03.113Z","level":"WARN","service":"reservation-service","version":"2.0.0","environment":"qa","trace_id":"4c1e9a07d2b84f6e9a3b5c7d1e2f0a11","span_id":"5e4d3c2b1a090807","correlation_id":"idem-3f6b2c1a","event":"court.slots.timeout","message":"court-service did not answer in 1000 ms, retrying","duration_ms":1001,"court_id":"7c0f4c3e-2a55-4a3b-9f0d-1b8f6e2a9c11","attempt":1,"error_code":"SERVICE_UNAVAILABLE"}
{"timestamp":"2026-10-20T23:15:03.160Z","level":"INFO","service":"court-service","version":"2.0.0","environment":"qa","trace_id":"4c1e9a07d2b84f6e9a3b5c7d1e2f0a11","span_id":"9c8b7a6f5e4d3c2b","correlation_id":"idem-3f6b2c1a","event":"court.slots.served","message":"bookable slots returned","duration_ms":38,"court_id":"7c0f4c3e-2a55-4a3b-9f0d-1b8f6e2a9c11","http_status":200}
{"timestamp":"2026-10-20T23:15:03.171Z","level":"INFO","service":"reservation-service","version":"2.0.0","environment":"qa","trace_id":"4c1e9a07d2b84f6e9a3b5c7d1e2f0a11","span_id":"6f5e4d3c2b1a0908","correlation_id":"idem-3f6b2c1a","event":"court.slots.received","message":"court-service answered on retry","duration_ms":56,"court_id":"7c0f4c3e-2a55-4a3b-9f0d-1b8f6e2a9c11","attempt":2,"http_status":200}
{"timestamp":"2026-10-20T23:15:03.175Z","level":"WARN","service":"reservation-service","version":"2.0.0","environment":"qa","trace_id":"4c1e9a07d2b84f6e9a3b5c7d1e2f0a11","span_id":"7a2f0c9e1b3d5f80","correlation_id":"idem-3f6b2c1a","event":"reservation.create.rejected","message":"range is outside the court schedule","duration_ms":1064,"court_id":"7c0f4c3e-2a55-4a3b-9f0d-1b8f6e2a9c11","slot":"2026-10-24/21:00-23:00","error_code":"BUSINESS_RULE_VIOLATION","http_status":422}
{"timestamp":"2026-10-20T23:15:03.179Z","level":"INFO","service":"api-gateway","version":"2.0.0","environment":"qa","trace_id":"4c1e9a07d2b84f6e9a3b5c7d1e2f0a11","span_id":"a1b2c3d4e5f60718","correlation_id":"idem-3f6b2c1a","event":"http.request.completed","message":"POST /api/v1/reservations answered","duration_ms":1075,"http_status":422}
```

Read in order, the seven lines tell the story: received at the gateway, slow court-service,
successful retry, rejection by the schedule rule, `422` to the customer after 1075 ms. No
`reservation_code` appears because the reservation was never created.

## Validation rules

- A line without any required field, or with `trace_id` not 32 hex, is a bug in the logger.
- `event` names are lowercase `domain.object.action`; adding one means adding it to this file.
- No field from the "Never log" table may appear, masked or not, except where a mask is listed.
