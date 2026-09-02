<!-- HU-STATUS TEMPLATE - do NOT remove the <!-- ... --> markers or the table headers.
     Your weekly grade is read AUTOMATICALLY from this file:
       01-week/hu-status/README.md  (inside YOUR fork). English. -->

# Weekly Status - Week 01

<!-- CONFIG-START - must match your profile repo (username/username) CONFIG -->
- FULL_NAME:Miguel Andres Gomez Gutierrez
- GITHUB_USER:soymiguelgomez
- TEAM:Futbol_mania
- SPRINT_GOAL:Define the initial product scope, organize the user story backlog, establish the DDD/hexagonal architecture baseline, and prepare the Git and development workflow for the Futbolix Soccer Field Management SaaS.
<!-- CONFIG-END -->

## 1. User stories worked this week

| HU ID | Title | Status (todo/doing/done) | Evidence (PR or commit URL) |
|-------|-------|--------------------------|------------------------------|
| HU-001 | Register a Business | doing | <!-- commit/PR URL --> |
| HU-002 | Configure a Soccer Field | doing | <!-- commit/PR URL --> |
| HU-003 | Configure Pricing | todo | |
| HU-004 | View Booking Calendar | todo | |
| HU-005 | Create a Booking | todo | |
| HU-006 | Prevent Double Bookings | todo | |
| HU-007 | Register a Customer | todo | |
| HU-008 | View Customer History | todo | |
| HU-009 | Record a Deposit | todo | |
| HU-010 | Record Full Payment | todo | |
| HU-011 | Record Payment Methods | todo | |
| HU-012 | View Daily Cash Flow | todo | |
| HU-013 | Record an Expense | todo | |
| HU-014 | Close the Cash Register | todo | |
| HU-015 | View Business Dashboard | todo | |
| HU-016 | View Field Occupancy | todo | |
| HU-017 | Identify Most Profitable Time Slots | todo | |
| HU-018 | View Public Availability | todo | |
| HU-019 | Book a Soccer Field Online | todo | |
| HU-020 | Receive Booking Confirmation | todo | |
| HU-021 | Create an Employee Account | todo | |
| HU-022 | Manage User Permissions | todo | |
| HU-023 | Select a Subscription Plan | todo | |
| HU-024 | Manage Subscription Status | todo | |

## 2. My individual contribution

- Defined the initial scope of Futbolix, a multi-tenant SaaS for soccer field management.
- Identified the main system actors and roles: owner, administrator/receptionist, employee, customer, and super administrator.
- Wrote and structured the initial user story backlog (HU-001 to HU-024) with clear titles and ownership.
- Organized the backlog into candidate bounded contexts: Business Management, Field Management, Booking, Customer, Payments, Finance, Reporting, Identity & Access, and Subscriptions.
- Prioritized the MVP slice: business registration, field configuration, pricing, and booking with double-booking prevention.
- Defined the multi-tenant approach so several businesses share the platform while keeping their data isolated by tenant.
- Documented the core business rule for HU-006: two confirmed bookings must never overlap on the same field and time range; this is treated as a domain invariant, not a UI validation.
- Drafted the layered architecture baseline following hexagonal architecture: adapters depend on application, application depends on domain, and the domain has no I/O.
- Defined the Git branching strategy (`hu-xxx-dev -> develop -> qa -> main`) and the Conventional Commits convention for the team.
- Set up the weekly status structure and the Kanban board used to track HU progress and WIP limits.

## 3. Blockers and risks

- No major technical blockers were identified during Week 01.
- The final technology stack (framework, database engine, ORM) still needs to be confirmed and recorded in an ADR.
- Payment gateway and WhatsApp notification integrations need further analysis; both are external services and will require timeouts, retries with backoff, and idempotency keys to avoid duplicate charges or duplicate messages.
- Business rules for pricing, cancellation policies, deposits, refunds, and minimum booking duration are not finalized yet.
- Multi-tenant data isolation is the main architectural risk: every query must be scoped by tenant so one business can never read another business's data.
- Concurrency risk on HU-006: two clients may request the same time slot at the same time. A uniqueness constraint at the database level plus optimistic locking is the candidate solution; it must be validated with a concurrency test.
- The subscription model and the per-plan limits (fields, users, bookings) still need to be defined.

## 4. Plan for next week

- Create the repository structure and the development environment (containers, environment variables, local setup).
- Write the first ADRs: technology stack, persistence strategy, and multi-tenancy model.
- Define module boundaries and the domain model for the Business and Field bounded contexts.
- Configure the database and implement the initial domain entities and value objects.
- Implement the authentication and authorization foundation, including role-based access control.
- Implement the tenant/business management module.
- Implement HU-001 (Register a Business) with testable acceptance criteria.
- Implement HU-002 (Configure a Soccer Field) with testable acceptance criteria.
- Add unit tests for the domain layer and integration tests for the persistence adapters.
- Create the `hu-001-dev` and `hu-002-dev` branches and open pull requests to `develop` following the branching strategy.
- Load all configuration through environment variables, with a committed `.env.example` and no secrets in the repository.

## 5. Compliance self-check

- [x] Conventional Commits - `type(scope): summary`
- [x] Per-environment HU branch + PR to that environment (hu-xxx-dev -> develop, ...)
- [x] Testable acceptance criteria
- [ ] Tests added/updated (unit / integration)
- [x] DDD / hexagonal boundaries respected (domain has no I/O)
- [x] No secrets; config via environment variables

## 6. Evidence links

- Repository: <!-- https://github.com/soymiguelgomez/... -->
- Kanban board: <!-- board URL -->
- Backlog document (HU-001 to HU-024): <!-- file or commit URL -->
- Week 01 commits: <!-- commit range or PR URL -->
