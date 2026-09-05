# Per-Microservice Documentation Standard

> Defines exactly what documents each microservice must have, who writes them,
> when they are created, and when they must be updated. Non-compliance blocks the merge.

---

## The four Futbolix services

The MVP has exactly four microservices, defined in `01-context/overview.md`. Each one maps to a
bounded context in `02-domain/domain-map.md`.

| NN | Service | Responsibility | Owns |
|----|---------|---------------|------|
| 01 | user-service | Administrator authentication and role management | Administrator accounts |
| 02 | court-service | The four courts, their schedules, prices and status | Courts and schedules |
| 03 | reservation-service | Reservation creation, confirmation, cancellation and lookup | Reservations and customer contact data |
| 04 | payment-service | Payment processing through Wompi Sandbox | Payments and Wompi transaction references |

---

## Required structure for each service

Each microservice lives in `09-microservices/services/NN-service-name/` and MUST have:

```
09-microservices/services/NN-service-name/
├── README.md         ⭐ REQUIRED from the sprint the service is created
├── data-model.md     ⭐ REQUIRED before creating migrations
├── events.md         ⭐ REQUIRED if the service emits/consumes events
├── decisions.md      🔵 RECOMMENDED — internal technical decisions of the service
└── runbook.md        🟢 REQUIRED before the service runs in the dev environment
```

And its OpenAPI contract in:
```
07-api/contracts/openapi/service-name.yaml   ⭐ REQUIRED if it exposes REST endpoints
```

---

## README.md — Service technical sheet

**When to create it:** At the start of the sprint where the service is created
**Owner:** Developer assigned to the service
**Update when:** Responsibility, ports, or dependencies between services change

Minimum content (use `_template/service/README.md`):

| Section | What it must say |
|---------|-----------------|
| Responsibility | One sentence: what it does and what data it is the authoritative owner of |
| Architecture location | Port, repository, DB schema, who it communicates with |
| Responsibilities (what it DOES) | List of concrete responsibilities |
| Out of scope (what it does NOT do) | What it delegated and to whom |
| How to run locally | Exact Maven and Docker Compose commands, must work from a clean checkout |
| Related documents | Links to the other files of the service |

---

## data-model.md — Service data model

**When to create it:** Before the first migration script
**Owner:** Developer assigned to the service
**Update when:** A table is created or modified

Minimum content:
- ER diagram (Mermaid) of the service's tables
- Description of each table with its columns, types, constraints, and purpose
- Migration strategy: **Flyway**, using versioned scripts under `src/main/resources/db/migration`
- Every database schema change MUST include the corresponding Flyway migration
- Flyway migrations MUST be executable successfully in a clean environment before the change is considered complete

**Database engine:** all Futbolix services use **PostgreSQL**, each with its own schema. A
service may not read another service's tables. If a service ever needs a different engine, that
requires an ADR in `05-architecture/decisions/`.

**Rules:**
- A field whose reason for existing is not obvious MUST have a comment in the diagram.
- Constraints that enforce a domain invariant MUST be named after it. The uniqueness constraint
  that prevents double booking is the clearest example and must appear in
  `reservation-service/data-model.md`.
- The four courts are seeded by a Flyway migration in `court-service`. There is no endpoint to
  create or delete courts.

---

## Testing standard

Each microservice should use **JUnit 5** and **Mockito** for unit and application-level testing.

**Testcontainers** must be used when integration tests require real infrastructure dependencies,
such as **PostgreSQL** or **RabbitMQ**.

Testing responsibilities include:

- Unit tests for domain rules and application use cases using JUnit 5 and Mockito
- Integration tests with Testcontainers when PostgreSQL, RabbitMQ, or other infrastructure
  dependencies are involved
- Tests for database migrations when the data model changes
- Tests for event publishing and consumption when RabbitMQ is involved
- Idempotency tests for event consumers
- Contract tests for REST endpoints defined by OpenAPI

Testcontainers-based integration tests must be reproducible from a clean checkout and must not
depend on manually installed local infrastructure.
---

## events.md — Service event catalog

**When to create it:** When the service publishes or consumes its first domain event
**Owner:** Developer assigned to the service
**Update when:** An event is added, modified, or removed

Services that publish or consume asynchronous events through **RabbitMQ** MUST document those
events in their `events.md` file.

Minimum content for every event:

- Event name
- Event purpose
- Publisher
- Consumer(s)
- RabbitMQ exchange and routing key
- When the event is emitted
- Message structure
- Required fields
- Example payload
- Idempotency considerations
- Failure, retry and Dead Letter Queue behavior
- Versioning considerations when the event schema changes

The document must contain:

- A table of published events: name, purpose, exchange/routing key, trigger, and schema
- A table of consumed events: name, publisher, action triggered, idempotency strategy, and failure handling
- The payload schema and at least one example payload for each event

**Broker:** RabbitMQ. Delivery is at-least-once, so **every consumer MUST be idempotent** and the
document MUST state which key is used for deduplication.

Any event that changes the state of another service must define how duplicate delivery, processing
failure, retry, and Dead Letter Queue handling are managed.

See standard event structure: `02-domain/domain-events.md`
---

## decisions.md — Service technical decisions

**When to create it:** When the team makes a non-obvious technical decision about the service
**Owner:** Whoever made the decision
**Update when:** A new decision is made or a previous one is revoked

Recommended format: miniADR (without the full rigor of an architecture ADR):
```markdown
### Decision: [short name]
**Date:** [date]
**Context:** [what problem was being solved]
**Decision:** [what was decided]
**Consequences:** [known trade-offs]
```

---

## runbook.md — Service operations manual

**When to create it:** Before the service runs in the shared dev environment
**Owner:** Responsible developer + DevOps
**Update when:** A new operational issue is discovered or a procedure changes

Minimum content:
- How to verify the service is healthy (Spring Boot Actuator health endpoint, key metrics)
- Known symptoms and their causes: "If you see X, the problem is Y, the solution is Z"
- How to roll the service back
- How to run Flyway migrations
- How to inspect and replay the Dead Letter Queue
- For `payment-service`: what to do when Wompi Sandbox is unreachable or a Wompi Sandbox webhook is not received

---

## OpenAPI Contract

**When to create it:** Before implementing the service's first endpoint (API-first)
**Owner:** Developer assigned to the service
**Update when:** An endpoint is added, modified, or removed

**API-First Rule:** The contract is written BEFORE the code. Contract tests validate
that the code fulfills the contract, not the other way around.

Use the template: `07-api/contracts/openapi/_template-service.yaml`

---

## How to add a new microservice

> The MVP scope is fixed at four services. Adding a fifth requires an ADR justifying why the
> responsibility does not fit in an existing bounded context.

1. Create the ADR in `05-architecture/decisions/` and get it approved
2. Copy `09-microservices/_template/service/` → `09-microservices/services/NN-name/`
3. Update `09-microservices/service-catalog.md` with the new service's entry
4. Update `09-microservices/dependency-map.md` (or create it if it doesn't exist)
5. Update `02-domain/domain-map.md` with the new bounded context
6. Copy `07-api/contracts/openapi/_template-service.yaml` → `07-api/contracts/openapi/service-name.yaml`
7. Create a PR with at least the README.md and the sketched API contract

---

## Correlations

- Service template → `09-microservices/_template/service/`
- Service catalog → `09-microservices/service-catalog.md`
- API contracts → `07-api/contracts/openapi/`
- Bounded contexts → `02-domain/domain-map.md`
- General documentation rules → `00-governance/documentation-rules.md`
