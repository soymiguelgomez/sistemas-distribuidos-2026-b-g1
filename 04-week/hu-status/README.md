<!-- HU-STATUS TEMPLATE - do NOT remove the <!-- ... --> markers or the table headers.
     Your weekly grade is read AUTOMATICALLY from this file:
       04-week/hu-status/README.md  (inside YOUR fork). English. -->

# Weekly Status - Week 04

<!-- CONFIG-START - must match your profile repo (username/username) CONFIG -->
- FULL_NAME:Miguel Andres Gomez Gutierrez
- GITHUB_USER:soymiguelgomez
- TEAM:Futbolix
- SPRINT_GOAL:Define the Futbolix domain model applying DDD - entities, aggregates, value objects, invariants and domain events - decompose the system into at least four domains with their cross-cutting components, establish the project documentation structure, and deliver the first interactive mockup of the administration system.
<!-- CONFIG-END -->

## 1. User stories worked this week
| HU ID | Title | Status (todo/doing/done) | Evidence (PR or commit URL) |
|---|---|---|---|
| HU-201 | Definition of entities, value objects and business rules | done | https://github.com/soymiguelgomez/sistemas-distribuidos-2026-b-g1/tree/main/04-week |
| HU-202 | Definition of domain events for the booking and payment flow | done | https://github.com/soymiguelgomez/sistemas-distribuidos-2026-b-g1/tree/main/04-week |
| HU-203 | System decomposition into four domains: Courts, Reservations, Customers and Schedules | done | https://github.com/soymiguelgomez/sistemas-distribuidos-2026-b-g1/tree/main/04-week |
| HU-204 | Definition of cross-cutting components: Infrastructure, API Gateway, Worker and Workflow | done | https://github.com/soymiguelgomez/sistemas-distribuidos-2026-b-g1/tree/main/04-week |
| HU-205 | Project documentation structure: 04-Requirements, 05-Architecture, 06-Data | done | https://github.com/soymiguelgomez/sistemas-distribuidos-2026-b-g1/tree/main/04-week |
| HU-206 | First interactive mockup of the Futbolix administration system | done | https://www.figma.com/make/PXzCMJ4OrM3PWfljA9Z4Qp/Interactive-web-app-mockup |

## 2. My individual contribution
- Worked on the definition of the domain model applying Domain-Driven Design. The main entities and aggregates of the system were identified, including User, Court, Reservation, Payment and Notification.
- Defined the value objects Email, Money and TimeSlot, together with the rules and invariants that must hold inside the domain. For example, a reservation cannot produce double availability for the same court and time slot, and a reservation can only move to CONFIRMED once the payment has been approved.
- Documented the domain events required to communicate relevant changes between bounded contexts: UserRegistered, ReservationCreated, PaymentApproved, PaymentRejected and ReservationCancelled.
- Decomposed the system into four domains and assigned the functionality of each one: Courts, which manages the sports spaces (query court, update court, view court status); Reservations, which manages the bookings (create, query, cancel, check availability); Customers, which manages the people who use the courts (register, query, update, look up their reservations); and Schedules, which manages the time slots available for the courts (query schedules, define duration, view available slots, block unavailable slots).
- Defined the cross-cutting components that support the domains: Infrastructure, which provides and manages the technical resources needed to run the system; API Gateway, which receives the requests and routes them to the corresponding service; Worker, which executes independent or background tasks; and Workflow, which automates testing, validation, build and deployment.
- Established the project documentation structure so each concern has its own place: 04-Requirements for the needs and functionality of the system, 05-Architecture for how the system is organised and communicates, and 06-Data for the data models and structures.
- Produced the first interactive mockup of the Futbolix administration system, covering the general layout of the application with the Home, Courts, Reservations, Customers, Schedules, Reports and Settings sections, the court cards with their status and type, and the daily summary panel showing bookings for the day, available courts, registered customers and available time slots.

## 3. Blockers and risks
- Definition of the first version: it was difficult to prioritise which functionality has to be ready for the first delivery.
- Organisation of the domains: there were initial doubts about how to distribute the functionality correctly across Courts, Reservations, Customers and Schedules.
- Definition of the project structure: organising the repositories and establishing how the domains and the cross-cutting components relate to each other was difficult at first.
- No major technical blockers appeared during the definition of the domain itself.
- Risk: the business rules defined in the documentation must be enforced later in the implementation with Java and Spring Boot; documentation alone does not guarantee the invariant.
- Risk: domain events must be processed idempotently, because the broker can deliver the same event more than once.
- Risk: the full integration of the events with their corresponding services still has to be validated.

## 4. Plan for next week
- Continue with the implementation of the hexagonal architecture.
- Translate the entities and business rules already defined into Java code with Spring Boot.
- Implement the aggregates and value objects identified this week.
- Implement the domain services and the corresponding ports.
- Write unit tests for the main business rules.
- Continue with the implementation of the booking and payment flow.

## 5. Compliance self-check
- [x] Conventional Commits - `type(scope): summary`
- [ ] Per-environment HU branch + PR to that environment (hu-xxx-dev -> develop, ...)
- [x] Testable acceptance criteria
- [ ] Tests added/updated (unit / integration)
- [x] DDD / hexagonal boundaries respected (domain has no I/O)
- [x] No secrets; config via environment variables

## 6. Evidence links
- Repository: https://github.com/soymiguelgomez/sistemas-distribuidos-2026-b-g1
- Week 04: https://github.com/soymiguelgomez/sistemas-distribuidos-2026-b-g1/tree/main/04-week
- HU Status: https://github.com/soymiguelgomez/sistemas-distribuidos-2026-b-g1/tree/main/04-week/hu-status
- Interactive mockup (Figma): https://www.figma.com/make/PXzCMJ4OrM3PWfljA9Z4Qp/Interactive-web-app-mockup?code-node-id=0-6&p=f&t=A6sKdzoqgJAifYh0-0&fullscreen=1
