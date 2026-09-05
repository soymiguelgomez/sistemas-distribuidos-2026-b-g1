# Domain Events

> A domain event is a fact that occurred in the business. They are the backbone of
> asynchronous communication between bounded contexts. The name is ALWAYS in past
> tense and in the ubiquitous language of the domain.

---

## What is a domain event?

A **Domain Event** communicates that something important occurred in the business.
It is an immutable message that describes the fact in past tense.

```
✓ ReservationCreated
✓ PaymentApproved

✗ CreateReservation (this is a command, not an event)
✗ ReservationUpdated (too generic — what changed?)
```

### Difference between Command and Event

| Concept | Intent | Tense | Can fail? |
|---------|--------|-------|-----------|
| **Command** | Instruction to do something | Present | Yes |
| **Event** | Notification of something that occurred | Past | No (it already happened) |

```
Customer → [CreateReservation] → Reservation Service → [ReservationCreated] → Payment Service
              (Command)                                       (Event)
```

---

## Scope of this catalog

There are **four** events. Two constraints removed the rest:

- **No customer accounts.** There is no `UserRegistered` event: customers never register, and
  administrators are seeded by migration rather than self-registering. No payload carries a
  `customerId`; customer contact data travels with the reservation.
- **No notifications.** There is no Notification Service, so `ReservationReminderDue` was
  removed and every notification consumer was dropped. The customer sees the outcome on screen.

> An event with no consumer is speculative design. If messaging returns in a later version,
> reinstate the events then, not before.

---

## Event catalog

### Event: ReservationCreated

| Field | Value |
|-------|-------|
| **Name** | `ReservationCreated` |
| **Bounded Context** | Reservation Management |
| **Aggregate** | Reservation |
| **Trigger** | A customer successfully creates a PENDING reservation on an available court. |
| **Consumers** | Payment Service — creates a PENDING payment and, from MVP 2, starts the Wompi checkout. |
| **Exchange / routing key** | `futbolix.events` / `reservation.created` |
| **Schema version** | `v1` |
| **Delivery guarantee** | At-least-once |
| **MVP** | 1 |

**Payload:**
```json
{
  "eventId": "uuid",
  "eventType": "ReservationCreated",
  "aggregateId": "reservation-uuid",
  "aggregateType": "Reservation",
  "occurredAt": "2026-08-22T10:31:00Z",
  "version": 1,
  "payload": {
    "reservationId": "uuid",
    "courtId": "uuid",
    "reservationDate": "2026-08-25",
    "startTime": "18:00",
    "endTime": "20:00",
    "amount": 120000,
    "currency": "COP",
    "customerName": "Juan Perez",
    "customerEmail": "juan@example.com"
  }
}
```

> **Why `endTime` is in the payload:** a reservation covers one or more whole hours. Payment
> needs the amount, which is `hourly price x hours`, and the duration is what makes that
> amount verifiable. A payload with only `startTime` would hide the multi-hour case.
>
> **Why there is no `customerId`:** there is no customer account to reference. The contact
> data needed downstream travels in the event. Phone is deliberately omitted — Payment has no
> use for it, and it is personal data.

| Consuming service | Action | Idempotent? |
|------------------|--------|-------------|
| Payment Service | Creates a PENDING payment linked to the reservation. | Yes — `eventId` is the idempotency key, stored in a `processed_events` table |

---

### Event: PaymentApproved

| Field | Value |
|-------|-------|
| **Name** | `PaymentApproved` |
| **Bounded Context** | Payment |
| **Aggregate** | Payment |
| **Trigger** | Wompi confirms the payment succeeded, via a signature-verified webhook. |
| **Consumers** | Reservation Service — confirms the reservation. |
| **Exchange / routing key** | `futbolix.events` / `payment.approved` |
| **Schema version** | `v1` |
| **Delivery guarantee** | At-least-once |
| **MVP** | 2 |

**Payload:**
```json
{
  "eventId": "uuid",
  "eventType": "PaymentApproved",
  "aggregateId": "payment-uuid",
  "aggregateType": "Payment",
  "occurredAt": "2026-08-22T10:33:00Z",
  "version": 1,
  "payload": {
    "paymentId": "uuid",
    "reservationId": "uuid",
    "amount": 120000,
    "currency": "COP",
    "wompiTransactionId": "wompi-tx-123"
  }
}
```

| Consuming service | Action | Idempotent? |
|------------------|--------|-------------|
| Reservation Service | Moves the reservation from PENDING to CONFIRMED. | Yes — the event is ignored if the reservation is not PENDING |

> **Unresolved case:** if the reservation was already CANCELLED when this event arrives, the
> consumer ignores it — but the customer has been charged. The refund depends on Payment
> having consumed `ReservationCancelled`, and the ordering of the two is not guaranteed.
> **ADR-005 must define the outcome before this event is implemented.**

---

### Event: PaymentRejected

| Field | Value |
|-------|-------|
| **Name** | `PaymentRejected` |
| **Bounded Context** | Payment |
| **Aggregate** | Payment |
| **Trigger** | Wompi rejects or fails to process the payment. |
| **Consumers** | Reservation Service — rejects the reservation and frees the slot. |
| **Exchange / routing key** | `futbolix.events` / `payment.rejected` |
| **Schema version** | `v1` |
| **Delivery guarantee** | At-least-once |
| **MVP** | 2 |

**Payload:**
```json
{
  "eventId": "uuid",
  "eventType": "PaymentRejected",
  "aggregateId": "payment-uuid",
  "aggregateType": "Payment",
  "occurredAt": "2026-08-22T10:33:00Z",
  "version": 1,
  "payload": {
    "paymentId": "uuid",
    "reservationId": "uuid",
    "reason": "Insufficient funds"
  }
}
```

| Consuming service | Action | Idempotent? |
|------------------|--------|-------------|
| Reservation Service | Moves the reservation from PENDING to REJECTED, which frees the slot for other customers. | Yes |

> The customer is told on the `/booking/failed` screen, synchronously, at the moment Wompi
> redirects them back. This event exists to free the court, not to inform anyone.

---

### Event: ReservationCancelled

| Field | Value |
|-------|-------|
| **Name** | `ReservationCancelled` |
| **Bounded Context** | Reservation Management |
| **Aggregate** | Reservation |
| **Trigger** | A customer or an administrator cancels a PENDING or CONFIRMED reservation. |
| **Consumers** | Payment Service — refunds the payment through Wompi if it was APPROVED. |
| **Exchange / routing key** | `futbolix.events` / `reservation.cancelled` |
| **Schema version** | `v1` |
| **Delivery guarantee** | At-least-once |
| **MVP** | 2 |

**Payload:**
```json
{
  "eventId": "uuid",
  "eventType": "ReservationCancelled",
  "aggregateId": "reservation-uuid",
  "aggregateType": "Reservation",
  "occurredAt": "2026-08-22T12:00:00Z",
  "version": 1,
  "payload": {
    "reservationId": "uuid",
    "cancelledBy": "CUSTOMER"
  }
}
```

| Consuming service | Action | Idempotent? |
|------------------|--------|-------------|
| Payment Service | Refunds the payment through Wompi if its status was APPROVED. | Yes — a payment already REFUNDED is left untouched |

> `cancelledBy` is `CUSTOMER` or `ADMINISTRATOR`. It is not an identity: a customer cancelling
> proves nothing but knowledge of the reservation code.

---

## Standard fields for all events

| Field | Type | Description |
|-------|------|--------------|
| `eventId` | UUID | Unique event ID. **This is the idempotency key** |
| `eventType` | string | Event name in PascalCase |
| `aggregateId` | UUID | ID of the aggregate that generated the event |
| `aggregateType` | string | Aggregate type |
| `occurredAt` | ISO 8601 | When the business fact occurred |
| `version` | integer | Schema version, for evolution |
| `payload` | object | Event data, specific per type |

This contract is implemented by the `DomainEvent` interface in
`reservation-service/src/main/java/com/futbolix/reservation/domain/events/`.

> The MVP does not carry `correlationId` / `causationId`. Because there is no distributed
> tracing either (technical debt AT-002), following a reservation across services means
> correlating logs by hand. Adding a correlation id is the cheapest partial fix and should be
> considered before MVP 2.

---

## Event flow: Reservation → Payment → Confirmation

```
Customer
  │
  │  CreateReservation (command)
  ▼
[Aggregate: Reservation] (status = PENDING)
  │   the database exclusion constraint arbitrates the slot here
  │
  │  ReservationCreated (event)
  ▼
[Service: Payment]
Creates a PENDING payment; from MVP 2, starts the Wompi checkout
  │
  ├── Wompi approves ──▶ PaymentApproved (event) ──▶ [Reservation] status = CONFIRMED
  │
  └── Wompi rejects  ──▶ PaymentRejected (event) ──▶ [Reservation] status = REJECTED
                                                        (the slot is freed)
```

**In MVP 1 the flow stops after the PENDING payment is recorded.** That is enough to prove the
distributed backbone — two services, a broker, an idempotent consumer — without depending on
ADR-005 and ADR-006.

### Cancellation flow

```
Customer or Administrator
  │
  │  CancelReservation (command)
  ▼
[Aggregate: Reservation] (status = CANCELLED, the slot is freed)
  │
  │  ReservationCancelled (event)
  ▼
[Service: Payment]
Refunds through Wompi if the payment was APPROVED
```

---

## Event summary table

| Event | Origin context | Routing key | Consumers | Version | MVP |
|-------|---------------|-------------|-----------|---------|-----|
| ReservationCreated | Reservation Management | `reservation.created` | Payment Service | v1 | 1 |
| PaymentApproved | Payment | `payment.approved` | Reservation Service | v1 | 2 |
| PaymentRejected | Payment | `payment.rejected` | Reservation Service | v1 | 2 |
| ReservationCancelled | Reservation Management | `reservation.cancelled` | Payment Service | v1 | 2 |

---

## Policies — Reactions to events

| Trigger event | Policy | Emitted command | Service |
|--------------|--------|----------------|---------|
| ReservationCreated | Whenever a reservation is created, record a pending payment for its amount and start a Wompi checkout | `CreatePayment` | Payment Service |
| PaymentApproved | Whenever a payment is approved, confirm its reservation | `ConfirmReservation` | Reservation Service |
| PaymentRejected | Whenever a payment is rejected, reject the reservation and free the slot | `RejectReservation` | Reservation Service |
| ReservationCancelled | Whenever a reservation is cancelled and its payment was APPROVED, refund it | `RefundPayment` | Payment Service |

---

## Idempotency

RabbitMQ delivers at-least-once, so **every consumer must be idempotent**. This is a Definition
of Done criterion, not a recommendation: without it, the retry policy configured in
`05-architecture/overview.md` would confirm the same reservation repeatedly.

Each consumer records the `eventId` it has processed and ignores repeats.

```java
@Component
public class PaymentApprovedConsumer {

    private final ProcessedEventStore processedEvents;
    private final ConfirmReservationPort confirmReservation;

    @RabbitListener(queues = "reservation.payment-approved")
    @Transactional
    public void handle(PaymentApprovedEvent event) {
        // The check and the write share one transaction, so a crash in between
        // cannot mark an event processed that was never acted on.
        if (processedEvents.alreadyProcessed(event.eventId())) {
            return;
        }
        confirmReservation.execute(event.payload().reservationId());
        processedEvents.markProcessed(event.eventId());
    }
}
```

```sql
CREATE TABLE reservation.processed_events (
    event_id     UUID PRIMARY KEY,
    event_type   VARCHAR(100) NOT NULL,
    processed_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
```

> The primary key does the real work: if two deliveries are handled concurrently, the second
> insert fails and the transaction rolls back. The `alreadyProcessed` check is an optimisation,
> not the guarantee — the same reasoning as the no-double-booking constraint.

---

## Known gap: events can be lost

Persisting the aggregate and publishing its event are two separate operations. A crash in
between leaves a reservation PENDING forever, and no payment is ever started — the most visible
failure mode of Futbolix.

The Outbox pattern solves this. **The decision is pending in ADR-006**, tracked as technical
debt AT-004 at priority P1. Until it is resolved, the gap is documented in the code itself, in
`CreateReservationService`.

---

## Dead Letter Queue (DLQ)

When an event fails after N retries, it goes to the DLQ.

| Configuration | Value |
|--------------|-------|
| Retries before DLQ | 3 |
| Backoff | Exponential: 1s → 2s → 4s |
| DLQ retention | 7 days |
| Alert | When the DLQ holds more than 0 messages |

This matches the RabbitMQ listener configuration in each service's `application.yml`
(`max-attempts: 3`, `multiplier: 2`, `default-requeue-rejected: false`).

> Requeueing a rejected message without a limit is an infinite loop that looks like a healthy
> system. `default-requeue-rejected` is false for exactly that reason.

> DLQ runbook per service → `09-microservices/services/NN-service/runbook.md`

---

## Correlations

- Bounded contexts and their relationships → `02-domain/domain-map.md`
- Aggregates that emit these events → `02-domain/entities-and-rules.md`
- Retry, DLQ and broker configuration → `05-architecture/overview.md`
- Saga and Outbox decisions → `05-architecture/decisions/` (ADR-005, ADR-006, both pending)
- Per-service event catalog → `09-microservices/services/NN-service/events.md`
