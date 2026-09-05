# Design Patterns and Microservices Guide

> This document is the project's pattern catalog.
> For each pattern: when to use it, when NOT to, and an implementation example.
> Patterns are not recipes — they are tools. Use them when the problem requires it.

> **Stack:** examples are Java 21 + Spring Boot 3.x and use the Futbolix domain
> (courts, reservations, payments). Where a pattern is not adopted by this project, the
> example is still Futbolix-shaped so the trade-off is concrete.

---

## Index

**Design patterns (GoF and SOLID)**
1. [Creational patterns](#creational)
2. [Structural patterns](#structural)
3. [Behavioral patterns](#behavioral)

**Microservices patterns**
4. [System decomposition](#decomposition)
5. [Inter-service communication](#communication)
6. [Resilience](#resilience)
7. [Data and consistency](#data)
8. [Observability](#observability)

---

## Design patterns (GoF) {#creational}

### 1. Factory Method

**Problem:** You want to create objects without exposing the creation logic or coupling code to
the concrete type.

**When to use it:**
- When creation has complex logic (validations, derived values)
- When an aggregate must never exist in an invalid state

**Used in Futbolix:** yes — every aggregate root.

```java
public final class Reservation {

    // Creation from a business action: validates invariants and derives the amount
    public static Reservation create(UUID courtId,
                                     LocalDate date,
                                     TimeSlot slot,
                                     CustomerContact customer,
                                     Money hourlyPrice) {
        if (date.isBefore(LocalDate.now())) {
            throw new BusinessRuleException("Reservation date cannot be in the past");
        }
        Money amount = hourlyPrice.multiply(slot.hours());
        return new Reservation(ReservationId.newId(), courtId, date, slot,
                               customer, amount, ReservationStatus.PENDING,
                               ReservationCode.generate());
    }

    // Reconstruction from persistence: no invariant re-validation, no new code generated
    public static Reservation reconstitute(ReservationState state) {
        return new Reservation(state.id(), state.courtId(), state.date(), state.slot(),
                               state.customer(), state.amount(), state.status(), state.code());
    }
}
```

> The distinction matters: `create` enforces rules and generates the reservation code;
> `reconstitute` must not, or loading an old row would regenerate the customer's lookup key.

---

### 2. Builder

**Problem:** An object has many parameters and construction becomes unreadable.

**When to use it:** complex configuration objects and, above all, test data builders.

**Used in Futbolix:** in tests only. The production aggregates use factory methods.

```java
// Test data builder — keeps tests readable and focused on what varies
Reservation reservation = aReservation()
        .onCourt(COURT_1)
        .onDate(LocalDate.now().plusDays(2))
        .from(LocalTime.of(18, 0)).to(LocalTime.of(20, 0))
        .forCustomer("Juan Perez", "+573001234567", "juan@example.com")
        .withStatus(ReservationStatus.CONFIRMED)
        .build();
```

---

### 3. Singleton (with caution)

**Problem:** A class must have exactly one instance.

**WARNING:** a self-managed singleton makes testing difficult. Let the DI container own the
lifecycle instead.

**Used in Futbolix:** implicitly — Spring beans are singletons by default. No class implements
the pattern by hand.

```java
// ✓ Singleton managed by Spring, not by the class itself
@Configuration
public class WompiConfig {
    @Bean
    public WompiClient wompiClient(WompiProperties properties) {
        return new WompiClient(properties);
    }
}
```

---

### 4. Adapter {#structural}

**Problem:** You want to use an existing system but its interface does not match the one you
need.

**When to use it:** integration with external APIs. In hexagonal architecture this is the
Anti-Corruption Layer.

**Used in Futbolix:** yes — this is how Wompi stays out of the domain.

```java
// The domain declares the interface it needs, in its own language
package com.futbolix.payment.domain.ports.out;

public interface PaymentGatewayPort {
    PaymentIntent createIntent(Money amount, ReservationId reservationId);
}
```

```java
// The adapter translates between the domain and Wompi's model
package com.futbolix.payment.infrastructure.adapters.out.wompi;

@Component
public class WompiPaymentAdapter implements PaymentGatewayPort {

    private final WompiClient wompi;

    @Override
    public PaymentIntent createIntent(Money amount, ReservationId reservationId) {
        // Domain model -> Wompi model. Wompi works in cents.
        WompiTransactionRequest request = new WompiTransactionRequest(
                amount.toCents(),
                amount.currency(),          // "COP"
                reservationId.value().toString()
        );

        WompiTransactionResponse response = wompi.createTransaction(request);

        // Wompi model -> domain model. Wompi's status strings never leak inward.
        return new PaymentIntent(
                response.id(),
                response.checkoutUrl(),
                mapStatus(response.status())
        );
    }

    private PaymentStatus mapStatus(String wompiStatus) {
        return switch (wompiStatus) {
            case "APPROVED" -> PaymentStatus.APPROVED;
            case "DECLINED", "ERROR" -> PaymentStatus.REJECTED;
            default -> PaymentStatus.PENDING;
        };
    }
}
```

> **Why this matters here:** if Wompi renames a status next year, exactly one method changes.
> Without the adapter, the string `"APPROVED"` would be scattered across the domain.

---

### 5. Decorator

**Problem:** You want to add behavior to an object without modifying it or inheriting from it.

**When to use it:** logging, caching, retries around a port.

**Used in Futbolix:** candidate, not adopted. Court prices and schedules change rarely and are
read on every availability query, so caching them behind a decorator is a reasonable future
optimisation. It is not needed at MVP load.

```java
// Candidate: cache court data without the reservation domain knowing
public class CachedCourtAvailabilityAdapter implements CourtAvailabilityPort {

    private final CourtAvailabilityPort delegate;
    private final Cache cache;

    @Override
    public Money hourlyPriceOf(UUID courtId) {
        return cache.get(courtId, () -> delegate.hourlyPriceOf(courtId));
    }
}
```

---

### 6. Observer / Internal Event Bus {#behavioral}

**Problem:** An object needs to notify others without knowing them directly.

**When to use it:** to accumulate domain events inside an aggregate and publish them after the
transaction commits.

**Used in Futbolix:** yes — this is how `ReservationCreated` leaves the aggregate.

```java
public final class Reservation {

    private final List<DomainEvent> events = new ArrayList<>();

    public void confirm() {
        if (status != ReservationStatus.PENDING) {
            throw new BusinessRuleException("Only a PENDING reservation can be confirmed");
        }
        this.status = ReservationStatus.CONFIRMED;
        this.events.add(new ReservationConfirmed(id, code));
    }

    // The use case pulls the events and hands them to the publisher port.
    // The aggregate never touches RabbitMQ.
    public List<DomainEvent> pullDomainEvents() {
        List<DomainEvent> pulled = List.copyOf(events);
        events.clear();
        return pulled;
    }
}
```

---

### 7. Strategy

**Problem:** You want to swap algorithms at runtime.

**When to use it:** pricing rules, discount policies, cancellation policies.

**Used in Futbolix:** not adopted. Pricing is a single rule — `hourly price x hours` — and
promotions are explicitly out of MVP scope. Recorded here because it is the natural extension
point if the facility later introduces peak-hour or weekend rates.

```java
// Not implemented. This is the shape it would take.
public interface PricingStrategy {
    Money priceFor(Court court, LocalDate date, TimeSlot slot);
}
```

> Adding a strategy interface for a single implementation is speculative generality. Add it when
> the second rule exists, not before.

---

### 8. Template Method

**Problem:** An algorithm has a fixed structure but some steps vary.

**Used in Futbolix:** not adopted. There is no family of processes with a shared skeleton in the
MVP. Documented for completeness.

---

## Microservices Patterns

### Decomposition {#decomposition}

#### API Gateway

**Problem:** Clients would otherwise need to know the address of every service.

```
                    ┌─────────────────┐
React Web ────────▶ │   API Gateway   │ ──▶ [user-service   :8081]
                    │ Spring Cloud    │ ──▶ [court-service  :8082]
                    │ Gateway :8080   │ ──▶ [reservation-svc:8083]
                    └─────────────────┘ ──▶ [payment-service:8084]
                         Does:
                    - Routing
                    - JWT validation
                    - Rate limiting
                    - CORS
```

**Adopted in Futbolix:** yes — ADR-004. Spring Cloud Gateway.

**Futbolix-specific responsibility:** rate limiting is not optional here. The reservation
creation and reservation lookup endpoints are public and unauthenticated, so the gateway is the
only place that stops reservation-code brute forcing and availability scraping.

---

#### Backend for Frontend (BFF)

**Problem:** Different clients need data in very different shapes.

**Adopted in Futbolix:** no. There is one client, a web frontend. A standard gateway is enough,
and each BFF is another API to maintain.

---

#### Strangler Fig

**Problem:** Migrating a monolith incrementally.

**Adopted in Futbolix:** not applicable. There is no legacy system — Futbolix replaces a manual
process, not existing software.

---

### Inter-service communication {#communication}

#### Synchronous: REST

| Aspect | REST | gRPC |
|--------|------|------|
| Protocol | HTTP/1.1 or HTTP/2 | HTTP/2 |
| Serialization | JSON (human-readable) | Protocol Buffers (efficient) |
| Typing | Manual with OpenAPI | Automatic with `.proto` |
| Streaming | Not native | Yes |
| Recommended use | Public APIs, external communication | High-volume internal traffic |

**Adopted in Futbolix:** REST only. gRPC's advantages do not pay for themselves at this scale,
and OpenAPI contracts are already a governance requirement.

**Where synchronous calls happen in Futbolix:**
- Frontend → gateway → any service
- reservation-service → court-service, to read court status and hourly price during availability
  checks. This is the one internal synchronous dependency, and it is why court-service needs a
  Circuit Breaker around it.

---

#### Asynchronous: RabbitMQ

```
[reservation-service] ──ReservationCreated──▶ [queue] ──▶ [payment-service]

[payment-service] ──PaymentApproved/Rejected──▶ [queue] ──▶ [reservation-service]
```

**Adopted in Futbolix:** yes, for the reservation ↔ payment flow.

**Why asynchronous here:** the customer should not wait on an open HTTP connection while Wompi
processes a card. The reservation is created as PENDING immediately; confirmation arrives later
through an event.

**Delivery guarantee:** at-least-once. Every consumer must be idempotent — see
`02-domain/domain-events.md`.

---

### Resilience {#resilience}

#### Circuit Breaker

**Problem:** A slow or failing dependency drags your service down with it.

```
CLOSED (normal):
  Calls pass through → if N consecutive failures → OPEN

OPEN (tripped):
  Calls fail immediately → after T seconds → HALF-OPEN

HALF-OPEN (probing):
  Allow one call → fails: back to OPEN | succeeds: back to CLOSED
```

**Adopted in Futbolix:** yes, in two places.

```java
@Component
public class WompiPaymentAdapter implements PaymentGatewayPort {

    @CircuitBreaker(name = "wompi", fallbackMethod = "gatewayUnavailable")
    @Retry(name = "wompi")
    @Override
    public PaymentIntent createIntent(Money amount, ReservationId reservationId) {
        return translate(wompi.createTransaction(toRequest(amount, reservationId)));
    }

    private PaymentIntent gatewayUnavailable(Money amount, ReservationId id, Throwable t) {
        // Do not fail silently and do not confirm anything.
        // The payment stays PENDING and the customer is told to retry.
        throw new PaymentGatewayUnavailableException(id, t);
    }
}
```

| Protected call | Why |
|---------------|-----|
| payment-service → Wompi | An external provider we do not control |
| reservation-service → court-service | If court-service is down, availability checks must fail fast rather than hang every reservation attempt |

**Tool:** Resilience4j.

---

#### Retry with Exponential Backoff

**Problem:** Transient failures — unstable network, a service restarting.

**Adopted in Futbolix:** yes, on RabbitMQ consumers and on the Wompi client.

```yaml
# application.yml — RabbitMQ consumer retry, then Dead Letter Queue
spring:
  rabbitmq:
    listener:
      simple:
        retry:
          enabled: true
          max-attempts: 3
          initial-interval: 1s
          multiplier: 2        # 1s -> 2s -> 4s
        default-requeue-rejected: false   # send to DLQ instead of looping forever
```

> **Careful:** retry is only safe because the consumers are idempotent. Retrying a
> non-idempotent `PaymentApproved` handler would confirm the same reservation repeatedly.

---

### Data and consistency {#data}

#### Database per Service

**Rule:** each service owns its data. No service reads another service's tables.

```
✓ Correct:
  reservation-service → schema "reservation"
  payment-service     → schema "payment"

✗ Incorrect:
  payment-service → JOIN on reservation.reservations
```

**Adopted in Futbolix:** yes — ADR-003, with one deviation recorded in
`05-architecture/overview.md`: all four schemas live in a single PostgreSQL container for the
academic MVP. Isolation is by schema ownership and separate database users, not by separate
instances.

**How data is shared instead:** payment-service holds a `reservationId`, nothing more. To learn
anything else about the reservation, it consumes an event or calls the API.

---

#### Saga (Distributed transactions)

**Problem:** A business transaction spans multiple services and cannot use a distributed ACID
transaction.

**Status in Futbolix: decision pending — ADR-005.** This is the most important open decision in
the project.

The reservation flow already is a saga, whether or not it is called one:

```
[reservation-service]                        [payment-service]
   │ ReservationCreated ──────────────────────▶ │
   │                                    creates PENDING payment,
   │                                    starts Wompi checkout
   │ ◀──────────────────── PaymentApproved ──── │
   │ status = CONFIRMED
   │
   │ ◀──────────────────── PaymentRejected ──── │
   │ status = REJECTED
```

**The compensation the team has not defined yet:** a customer cancels a PENDING reservation
while Wompi is still processing. The reservation becomes CANCELLED, then `PaymentApproved`
arrives. The money was taken for a reservation that no longer exists.

```
Step 1: Create reservation (PENDING)  → Compensation: cancel reservation
Step 2: Charge through Wompi          → Compensation: refund through Wompi
Step 3: Confirm reservation           → Compensation: cancel and refund
```

`02-domain/domain-events.md` already defines `ReservationCancelled` with a Payment Service
consumer that refunds an APPROVED payment. That is the compensating action. It needs to be
recorded as a deliberate saga decision in an ADR, and the race above needs a defined outcome.

---

#### CQRS

**Problem:** The write model and the read model pull in different directions.

**Adopted in Futbolix:** no. Reads and writes use nearly the same shape, and the read volume of
a four-court facility does not justify a second model. Revisit only if the availability query
becomes a measured bottleneck.

---

#### Outbox Pattern

**Problem:** Guaranteeing that saving to the database and publishing the event either both
happen or neither does.

**Status in Futbolix: decision pending — ADR-006.** Registered as technical debt AT-004,
priority P1.

```
❌ Without Outbox (events can be lost):
  BEGIN TRANSACTION
    INSERT INTO reservations ...
  COMMIT
  // crash here -> the reservation is PENDING forever, no payment ever starts
  publish(ReservationCreated)

✓ With Outbox (atomic):
  BEGIN TRANSACTION
    INSERT INTO reservations ...
    INSERT INTO outbox (event_type, payload, published) VALUES ('ReservationCreated', '...', false)
  COMMIT
  // a separate relay reads the outbox and publishes
  // if publishing fails, the event is still there
```

```sql
CREATE TABLE reservation.outbox (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type    VARCHAR(100) NOT NULL,
  payload       JSONB NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  published_at  TIMESTAMPTZ,
  published     BOOLEAN DEFAULT false
);

CREATE INDEX idx_outbox_unpublished ON reservation.outbox (created_at) WHERE published = false;
```

**Recommendation:** adopt it. Without the outbox, the single most visible failure mode of
Futbolix is a customer who reserved a court, was never asked to pay, and holds a reservation
that will never confirm. That is worse than any latency the relay adds.

---

#### Event Sourcing

**Adopted in Futbolix:** no. Full history is not a requirement, and the complexity is
substantial. The `status` column plus a `created_at` timestamp cover what the administrator
needs.

---

### Observability {#observability}

#### Sidecar Pattern

**Adopted in Futbolix:** no. There is no Kubernetes or service mesh in this project; the system
runs on Docker Compose. Logging is done in-process with SLF4J and Logback.

**Consequence, recorded as AT-002:** there is no distributed tracing. Debugging a reservation
that crosses the gateway, reservation-service, RabbitMQ and payment-service means correlating
logs by hand. The mitigation is a correlation ID propagated on every request and every event —
see `05-architecture/cross-cutting.md`.

---

## When NOT to use each pattern

| Pattern | Do not use it when... |
|---------|----------------------|
| CQRS | The read and write models are similar. It only adds complexity |
| Event Sourcing | You do not need complete history. It is hard to implement and maintain |
| Saga | The transaction fits in a single service. Use a plain ACID transaction |
| Circuit Breaker | The call is internal to the same service. The overhead is not worth it |
| BFF | Clients have similar needs. A standard API Gateway is sufficient |
| Strategy | There is only one implementation. That is speculative generality |
| Outbox | The event is advisory and losing it has no business consequence |

---

## Patterns adopted in this project

| Pattern | Adopted? | Justification / ADR |
|---------|---------|---------------------|
| Hexagonal Architecture | **Yes** | Keeps Wompi and JPA out of the domain — `hexagonal-architecture.md` |
| API Gateway | **Yes** | ADR-004. Single entry point; also where public-endpoint rate limiting lives |
| Database per Service | **Yes** | ADR-003, with the single-instance deviation recorded in `overview.md` |
| Domain Events | **Yes** | Decouples reservation from payment — `02-domain/domain-events.md` |
| Anti-Corruption Layer | **Yes** | Wompi's status strings never reach the domain |
| Factory Method | **Yes** | Every aggregate root; an aggregate is never constructed invalid |
| Observer (internal events) | **Yes** | Aggregates accumulate events; the use case publishes them |
| Circuit Breaker | **Yes** | Around Wompi and around court-service. Resilience4j |
| Retry + Backoff + DLQ | **Yes** | RabbitMQ consumers, 3 attempts, 1s/2s/4s |
| Saga (choreographed) | **Pending — ADR-005** | The flow already is one; the cancellation race needs a defined outcome |
| Outbox Pattern | **Pending — ADR-006** | Recommended. AT-004, priority P1 |
| Builder | Tests only | Test data builders; production uses factory methods |
| Decorator | No | Candidate for caching court data if availability queries become slow |
| Strategy | No | One pricing rule. Add when a second one exists |
| Template Method | No | No family of processes with a shared skeleton |
| CQRS | No | Read and write models are nearly identical |
| Event Sourcing | No | Full history is not a requirement |
| BFF | No | One client |
| Sidecar | No | No Kubernetes or service mesh in this project |

---

## Correlations

- Hexagonal Architecture → `05-architecture/hexagonal-architecture.md`
- Architecture overview and technical debt → `05-architecture/overview.md`
- ADRs for pattern decisions → `05-architecture/decisions/`
- Event catalog and idempotency → `02-domain/domain-events.md`
- Saga implementation → `09-microservices/services/04-payment-service/events.md`
- Circuit Breaker runbook → `09-microservices/services/04-payment-service/runbook.md`
- Outbox in the data model → `06-data/models.md`
