# 05 — Architecture

> **What is this?** The system's design decisions: how it is organized, why,
> what alternatives were evaluated, and how it is deployed. ADRs are the treasure of this section.

## Why this section exists

A system's architecture is the set of decisions that are hard to change later.
Documenting them has three benefits:
1. **New team members** understand the system without having to ask everything from scratch
2. **The team** does not repeat already-resolved discussions
3. **Years later**, everyone remembers why each decision was made

---

## Binding decisions this section assumes

| Decision | Value |
|----------|-------|
| Services | **Four**: user, court, reservation, payment. There is no notification-service |
| Entry point | Spring Cloud Gateway as the single public entry point (ADR-004) |
| Customer accounts | None. Only administrators authenticate |
| Payments | **Real**, through Wompi in sandbox/test mode |
| Notifications (WhatsApp / email) | **Out of MVP scope** |
| Courts | Exactly four, seeded by Flyway migration |
| Reservation duration | One or more whole hours |
| Persistence | PostgreSQL, one isolated schema per service |
| Broker | RabbitMQ |

---

## Status of this section

| File | Status | Owner |
|------|--------|-------|
| `overview.md` | Complete | Tech Lead |
| `hexagonal-architecture.md` | Complete | Tech Lead |
| `pattern-guide.md` | Complete | Tech Lead |
| `deployment.md` | **Not created** — content currently drafted in this README, must be moved | DevOps |
| `cross-cutting.md` | **Not created** — content currently drafted in this README, must be moved | Tech Lead |
| `security-threat-model.md` | **Not created** — STRIDE table drafted, must be moved and completed | Tech Lead |
| `decisions/records/` | **Not created** — ADR-001 to ADR-004 drafted, must be split into one file each | Tech Lead |

> **Why this matters:** `00-governance/documentation-rules.md` states that each section's
> `README.md` explains the folder's purpose, and that content lives in its own `kebab-case.md`
> file. Diagrams, service catalogs and ADRs written inside this README are unreachable from the
> correlations other documents declare — for example `05-architecture/decisions/` is referenced
> from four different files and does not exist yet.

---

## What is here and how to fill it in

### `overview.md` ⭐ (Start here)
The technical snapshot: architectural style, C4 context and container diagrams, the service
catalog with ports and databases, architectural principles, and adopted patterns.

### `hexagonal-architecture.md` ⭐
How each service is organized internally: ports, adapters, the dependency rule, and the
folder structure every Futbolix service must follow.

### `pattern-guide.md` ⭐
The pattern catalog: when to use each pattern, when NOT to, and which ones this project has
actually adopted.

### `deployment.md` ⭐
How the system runs: Docker Compose topology, containers, the `futbolix-net` network, and the
PostgreSQL schema layout.

**To move here from this README:** the Docker Compose network diagram and the container
descriptions. Correct them first — the current draft lists five microservice containers
including `notification-service`, which no longer exists.

### `cross-cutting.md`
Concerns shared by every service: structured logging with SLF4J and Logback, the
`GlobalExceptionHandler` error contract, RabbitMQ retry policy and Dead Letter Queue behaviour.

**To move here from this README:** the logging, error handling and retry sections.

### `security-threat-model.md`
STRIDE analysis of the system.

**To move here from this README:** the STRIDE table. It currently covers Spoofing, Tampering
and Information Disclosure. Repudiation, Denial of Service and Elevation of Privilege are
missing, and the Tampering row says "pago simulado" — payments are real.

### `decisions/` ⭐⭐ — Architecture Decision Records (ADRs)

An ADR records one decision that is expensive to reverse. One decision per file, numbered
sequentially, using `decisions/_template-adr.md`.

**To move here from this README, one file each:**

| ADR | Title | Correction needed before moving |
|-----|-------|--------------------------------|
| ADR-001 | Documentation language | The current text allows "dualidad" for user-facing descriptions. `documentation-rules.md` says English is binding per category with no exceptions. Reconcile the two |
| ADR-002 | Authentication strategy (stateless JWT) | Add explicitly that customers are not authenticated, and that the public endpoints are protected by validation and rate limiting instead |
| ADR-003 | Database per service | Says "User, Court, Reservation, Payment, Notification". Remove Notification |
| ADR-004 | API Gateway pattern | Says "5 microservicios". Should be four |

**Missing ADRs the project needs:**

| ADR | Decision it must record | Why it is needed |
|-----|------------------------|------------------|
| ADR-005 | Consistency strategy for the reservation and payment flow | The reservation confirmation crosses two services. Is it a choreographed saga? What compensates a payment approved for a reservation that was cancelled meanwhile? |
| ADR-006 | Outbox pattern: adopted or not | Without it, a service can commit a reservation and then fail before publishing `ReservationCreated`. The event is lost and the reservation stays PENDING forever |
| ADR-007 | Reservation lookup mechanism | Customers have no account. The reservation code is the only retrieval key and it is a security control |

---

## Correlations with other sections

| Source | What it feeds into this section |
|--------|--------------------------------|
| `02-domain/domain-map.md` | Bounded contexts become the physical service boundaries |
| `02-domain/domain-events.md` | Event payloads become the RabbitMQ message contracts |
| `01-context/scope.md` | Constrains which outbound integrations exist. For the MVP that is Wompi and nothing else |
| `00-governance/security-policy.md` | Authentication, RBAC and the Wompi webhook controls |

> **Open propagation item:** `01-context/scope.md` and `01-context/overview.md` list four
> services and do not mention the API Gateway. ADR-004 adopts Spring Cloud Gateway, which is a
> fifth deployable container. Both documents must be updated, or ADR-004 must be revisited.

---

## The 5 most common architecture mistakes

**Microservices too small.** Each service matches one real bounded context. None is split
further, which would add network overhead without adding isolation.

**Shared database.** Sharing tables destroys operational independence. Each Futbolix service
owns its own isolated schema in PostgreSQL and communicates only through APIs or events.

**Only synchronous communication.** Depending on synchronous REST for long-running processes
degrades the user experience. The payment flow is coordinated asynchronously through RabbitMQ.

**No API Gateway.** Exposing services directly couples the frontend to the internal topology.
Spring Cloud Gateway is the single entry point, handling routing and preliminary security.

**No documented decisions.** Decisions that are not recorded are forgotten. The team uses ADRs
to preserve the project's history.

---

## Questions this section must answer

**How is the system organized into large blocks?**

A lightweight React + Vite web frontend and a distributed backend of four decoupled
microservices built on Hexagonal Architecture, coordinated by an API Gateway and an
asynchronous message broker.

**Why was each key technology chosen?**

Java 21 and Spring Boot 3.x provide strong typing and good native support for DDD. PostgreSQL
provides the transactional consistency required to enforce the no-double-booking invariant at
the database level. RabbitMQ decouples the reservation and payment contexts.

**What alternatives were evaluated and why were they discarded?**

A monolithic architecture was discarded because it coupled the change cycle of the external
payment provider to the reservation core. A shared database was discarded because it violates
per-service data isolation.

**How is the system deployed?**

Locally and in the `dev` environment through independent containers using Docker and Docker
Compose, isolated inside the private `futbolix-net` network. Staging and production are out of
MVP scope.

**What patterns does the team apply and how?**

Domain Events through asynchronous publishers and consumers on RabbitMQ, and an
Anti-Corruption Layer in infrastructure that keeps Wompi's contract out of the domain model.
