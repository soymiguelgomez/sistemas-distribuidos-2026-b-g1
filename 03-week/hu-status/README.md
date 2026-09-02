<!-- HU-STATUS TEMPLATE - do NOT remove the <!-- ... --> markers or the table headers.
     Your weekly grade is read AUTOMATICALLY from this file:
       03-week/hu-status/README.md  (inside YOUR fork). English. -->

# Weekly Status - Week 03

<!-- CONFIG-START - must match your profile repo (username/username) CONFIG -->
- FULL_NAME:Miguel Andres Gomez Gutierrez
- GITHUB_USER:soymiguelgomez
- TEAM:Futbolix
- SPRINT_GOAL:Establish the strategic DDD foundation for Futbolix - problem definition, product vision, system scope, ubiquitous language, domain events, bounded context map, entities, value objects and business rules - so the team shares a single model before moving into requirements, architecture and implementation.
<!-- CONFIG-END -->

## 1. User stories worked this week

| HU ID | Title | Status (todo/doing/done) | Evidence (PR or commit URL) |
|---|---|---|---|
| HU-101 | Project glossary and ubiquitous language | done | <!-- commit/PR URL --> |
| HU-102 | System overview: purpose, users, main services and technologies | done | <!-- commit/PR URL --> |
| HU-103 | System scope: what is in and out of the MVP | done | <!-- commit/PR URL --> |
| HU-104 | Domain events: producers and reacting services | done | <!-- commit/PR URL --> |
| HU-105 | Domain map and bounded contexts | done | <!-- commit/PR URL --> |
| HU-106 | Entities, value objects and business rules | done | <!-- commit/PR URL --> |
| HU-107 | Problem definition: affected users, causes, impact and risks | done | <!-- commit/PR URL --> |
| HU-108 | Product vision and delivered value | done | <!-- commit/PR URL --> |

## 2. My individual contribution

- Wrote the Futbolix glossary so the whole team uses the same vocabulary for booking, field, time slot, availability, tenant and payment, establishing the ubiquitous language required by DDD.
- Produced the system overview describing what Futbolix is, the problem it solves, who its users are, the main services that compose it and the technology stack under consideration.
- Defined the system scope, drawing an explicit line between what belongs to the MVP and what is deferred, so the team can prioritise the booking flow before secondary features.
- Identified the relevant domain events, together with the service that publishes each one and the services that must react to it. This is the basis for asynchronous communication between services and avoids point-to-point coupling.
- Built the domain map and identified the bounded contexts, establishing Booking as the core domain and the remaining contexts as supporting or generic.
- Defined the main entities, value objects and business rules of the domain, separating what has identity and lifecycle from what is defined only by its value and is therefore immutable.
- Analysed the problem statement: current situation, affected users, root causes, business impact and the main risks associated with the current manual process.
- Defined the product vision, describing where the team wants to take Futbolix and the value it delivers to customers and administrators.
- Kept the Kanban board up to date so every artifact produced this week is traceable to a card.

## 3. Blockers and risks

- Team coordination is the main blocker: members have work commitments and it has been difficult to find shared meeting slots.
- Document reviews were delayed because of that limited availability, which slowed down the approval of some artifacts.
- Some modelling decisions required extended discussion before the team reached agreement, particularly around context boundaries.
- Documents from previous weeks must be revisited to keep them coherent with the model defined this week, since the scope and the naming of the project have evolved.
- Modelling risk: the boundaries between bounded contexts are not fully closed yet. If a context is drawn too wide, the services will end up sharing data and the benefit of the separation is lost.
- Distributed systems risk: once the booking flow spans more than one service, the double-booking rule cannot rely on a single local transaction. The team must decide between an invariant kept inside a single Booking aggregate or a saga with compensating actions, and record the decision in an ADR.
- Domain events introduce at-least-once delivery, so consumers will have to be idempotent to avoid duplicate bookings or duplicate charges.

## 4. Plan for next week

- Derive the functional and non-functional requirements from the model defined this week.
- Build the traceability matrix linking requirements to bounded contexts and domain events.
- Write the user stories with a Definition of Ready and testable acceptance criteria.
- Define the system architecture and record the key decisions as ADRs: service boundaries, synchronous versus asynchronous communication, and the consistency strategy for bookings.
- Define the data model, the data dictionary and the first migrations, per context.
- Reflect all of the above on the Kanban board so every item has a visible card and owner.
- Set up the repository structure that mirrors the bounded contexts, keeping the domain layer free of I/O.
- Agree on a fixed weekly synchronisation slot to remove the coordination blocker reported this week.

## 5. Compliance self-check

- [ ] Conventional Commits - `type(scope): summary`
- [ ] Per-environment HU branch + PR to that environment (hu-xxx-dev -> develop, ...)
- [ ] Testable acceptance criteria
- [ ] Tests added/updated (unit / integration)
- [x] DDD / hexagonal boundaries respected (domain has no I/O)
- [x] No secrets; config via environment variables

## 6. Evidence links

- Kanban board: https://github.com/users/soymiguelgomez/projects/2/views/1
- Repository: <!-- add repository URL -->
- Glossary / ubiquitous language: <!-- add file or commit URL -->
- System overview and scope: <!-- add file or commit URL -->
- Domain events and bounded context map: <!-- add file or commit URL -->
- Entities, value objects and business rules: <!-- add file or commit URL -->
- Problem definition and product vision: <!-- add file or commit URL -->
