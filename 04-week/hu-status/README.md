<!-- HU-STATUS TEMPLATE - do NOT remove the <!-- ... --> markers or the table headers.
     Your weekly grade is read AUTOMATICALLY from this file:
       04-week/hu-status/README.md  (inside YOUR fork). English. -->

# Weekly Status - Week 04

<!-- CONFIG-START - must match your profile repo (username/username) CONFIG -->
- FULL_NAME:Miguel Andres Gomez Gutierrez
- GITHUB_USER:soymiguelgomez
- TEAM:Futbolix
- SPRINT_GOAL:Define the Futbolix domain model applying DDD - entities, aggregates, value objects, invariants and domain events - decompose the system into its bounded contexts, resolve the open MVP scope decisions, and consolidate the team documentation repository so governance, domain, product and UX are coherent with a single definition of the product.
<!-- CONFIG-END -->

## 1. User stories worked this week

| HU ID | Title | Status (todo/doing/done) | Evidence (PR or commit URL) |
|---|---|---|---|
| HU-201 | Definition of entities, value objects and business rules | done | https://github.com/code-corhuila/ftx-docs/blob/main/02-domain/entities-and-rules.md |
| HU-202 | Definition of domain events for the booking and payment flow | done | https://github.com/code-corhuila/ftx-docs/blob/main/02-domain/domain-events.md |
| HU-203 | Decomposition of the system into bounded contexts | done | https://github.com/code-corhuila/ftx-docs/blob/main/02-domain/domain-map.md |
| HU-204 | Definition of cross-cutting components: infrastructure, API gateway, worker and workflow | done | https://github.com/code-corhuila/ftx-docs/blob/main/05-architecture/overview.md |
| HU-205 | Project documentation structure: 04-Requirements, 05-Architecture, 06-Data | done | https://github.com/code-corhuila/ftx-docs |
| HU-206 | First interactive mockup of the Futbolix administration system | done | https://www.figma.com/make/PXzCMJ4OrM3PWfljA9Z4Qp/Interactive-web-app-mockup |
| HU-207 | Resolution of the open MVP scope decisions and cross-document audit | done | https://github.com/code-corhuila/ftx-docs/blob/main/01-context/scope.md |
| HU-208 | Correction of the domain model after the scope decisions | done | https://github.com/code-corhuila/ftx-docs/tree/main/02-domain |
| HU-209 | Consolidation of the governance documents | done | https://github.com/code-corhuila/ftx-docs/tree/main/00-governance |
| HU-210 | Definition of the UX/UI baseline: navigation map and design system | done | https://github.com/code-corhuila/ftx-docs/tree/main/12-ux-ui |

## 2. My individual contribution

- Worked on the definition of the domain model applying Domain-Driven Design. The main entities and aggregates were identified: User (administrators only), Court, Reservation and Payment.
- Defined the value objects Money, TimeSlot, CustomerContact and ReservationCode, together with the invariants that must hold inside the domain. For example, two reservations cannot overlap on the same court, date and time slot; a reservation only moves to CONFIRMED after its payment is approved; and the amount is always the court's hourly price multiplied by the number of hours reserved.
- Documented the domain events required to communicate changes between bounded contexts: ReservationCreated, PaymentApproved, PaymentRejected and ReservationCancelled, with their payloads, consumers and idempotency keys.
- Decomposed the system into four bounded contexts and assigned the responsibility of each one: Court Management (the four courts, their schedules, prices and status), Reservation Management (availability, creation, confirmation, cancellation and lookup - the core domain), Payment (real payments through the Wompi gateway), and User Management (administrator authentication).
- Defined the cross-cutting components that support the contexts: infrastructure resources, the API gateway that routes requests to each service, background workers, and the workflow that automates testing, validation, build and deployment.
- Established the documentation structure of the team repository so each concern has its own place: 00-governance, 01-context, 02-domain, 03-product, 04-requirements, 05-architecture, 06-data and 12-ux-ui.
- Resolved the open scope decisions that were blocking the domain model, and audited the repository for contradictions between sections: customers reserve without an account, payments are real through Wompi, notifications are out of MVP scope, the facility has exactly four fixed courts, and a reservation covers one or more whole hours.
- Corrected the domain map: removed the Notification bounded context and its external messaging integration, restricted User Management to administrators, removed the User Management to Reservation Management relationship that existed only because of the discarded customer account, and classified the four contexts into core, supporting and generic.
- Corrected the event catalog: removed the two events that no longer had a consumer once notifications left the scope, aligned the ReservationCreated payload with the model by removing the customer identifier and adding the end time, the currency and the customer contact data, and documented the idempotency mechanism with a processed events table.
- Consolidated the governance section, correcting eight documents: git conventions with the per-environment branch strategy and the Futbolix commit scopes, agile conventions which were an unfilled template, definition of done and definition of ready adjusted to the real roles and environments, documentation rules with a consistency table for facts repeated across documents, the per-microservice documentation standard with the four real services, and the security policy and technical security rules rewritten for the Java and Spring Boot stack with the actual Futbolix roles and the payment gateway controls.
- Defined the UX/UI baseline: the navigation map with the real routes, the access matrix and the reservation flow including the slot conflict case, and the design system with the tokens derived from the mockup and the colour mapping for every reservation, payment and court status.

## 3. Blockers and risks

- Definition of the first version: it was difficult to prioritise which functionality has to be ready for the first delivery.
- Organisation of the domains: there were initial doubts about how to distribute the functionality across the bounded contexts.
- Definition of the project structure: organising the repositories and establishing how the contexts and the cross-cutting components relate to each other was difficult at first.
- No major technical blockers appeared during the definition of the domain itself.
- The documentation had grown into contradictions between sections, because different documents were written against different assumptions about the same product. The audit resolved them, and a consistency table was added to the documentation rules so the same facts are not restated differently in the future.
- The team repository does not yet have the develop and qa branches, so no user story has been delivered through a per-environment pull request yet.
- Risk: the business rules defined in the documentation must be enforced later in the implementation with Java and Spring Boot; documentation alone does not guarantee an invariant.
- Risk: the no-double-booking rule cannot be enforced only in application code, because two concurrent requests would both pass the check. It has to be backed by a database constraint and proven with a concurrency test.
- Risk: domain events must be processed idempotently, because the broker can deliver the same event more than once.
- Risk: persisting a reservation and publishing its event are not atomic. A failure between the two would leave a reservation pending with no payment ever started.
- Risk: the ordering between a reservation cancellation and a payment approval is not guaranteed. A customer could be charged for a reservation that was already cancelled.
- Risk: the mockup was designed for the administration panel, while the first delivery targets the customer reservation flow. The screens for that flow still have to be designed.

## 4. Plan for next week

- Create the develop and qa branches in the team repositories and configure branch protection, so every user story is delivered through a pull request to the corresponding environment.
- Record the pending architecture decisions as ADRs: consistency strategy for the reservation and payment flow, adoption of the Outbox pattern, and the reservation lookup mechanism.
- Set up the project structure with Docker Compose for PostgreSQL, RabbitMQ and the services.
- Implement the pure domain of the reservation service in Java: the Reservation aggregate, the Money, TimeSlot, CustomerContact and ReservationCode value objects, and their invariants.
- Implement the ports and adapters following hexagonal architecture, keeping the domain free of any framework dependency.
- Create the Flyway migration with the database constraint that enforces the no-double-booking rule.
- Write unit tests for every domain invariant and an integration test with Testcontainers proving that concurrent attempts on the same slot produce exactly one reservation.
- Implement the court service with the four courts seeded by migration.
- Design the customer-flow screens that are missing from the mockup, including the slot conflict screen.

## 5. Compliance self-check

- [x] Conventional Commits - `type(scope): summary`
- [ ] Per-environment HU branch + PR to that environment (hu-xxx-dev -> develop, ...)
- [x] Testable acceptance criteria
- [ ] Tests added/updated (unit / integration)
- [x] DDD / hexagonal boundaries respected (domain has no I/O)
- [x] No secrets; config via environment variables

## 6. Evidence links

- Team documentation repository: https://github.com/code-corhuila/ftx-docs
- Domain model: https://github.com/code-corhuila/ftx-docs/tree/main/02-domain
- Governance: https://github.com/code-corhuila/ftx-docs/tree/main/00-governance
- Project context and scope: https://github.com/code-corhuila/ftx-docs/tree/main/01-context
- Product definition: https://github.com/code-corhuila/ftx-docs/tree/main/03-product
- Architecture and ADRs: https://github.com/code-corhuila/ftx-docs/tree/main/05-architecture
- UX/UI: https://github.com/code-corhuila/ftx-docs/tree/main/12-ux-ui
- Personal fork (weekly deliveries): https://github.com/soymiguelgomez/sistemas-distribuidos-2026-b-g1
- Week 04 HU status: https://github.com/soymiguelgomez/sistemas-distribuidos-2026-b-g1/tree/main/04-week/hu-status
- Interactive mockup (Figma): https://www.figma.com/make/PXzCMJ4OrM3PWfljA9Z4Qp/Interactive-web-app-mockup?code-node-id=0-6&p=f&t=A6sKdzoqgJAifYh0-0&fullscreen=1
