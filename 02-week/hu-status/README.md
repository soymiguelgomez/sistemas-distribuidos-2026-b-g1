<!-- HU-STATUS TEMPLATE - do NOT remove the <!-- ... --> markers or the table headers.
     Your weekly grade is read AUTOMATICALLY from this file:
       02-week/hu-status/README.md  (inside YOUR fork). English. -->

# Weekly Status - Week 02

<!-- CONFIG-START - must match your profile repo (username/username) CONFIG -->
- FULL_NAME:Miguel Andres Gomez Gutierrez
- GITHUB_USER:soymiguelgomez
- TEAM:futbolix
- SPRINT_GOAL:Produce and baseline the Software Requirements Specification (SRS v1.0) for the Soccer Field Booking and Administration System, covering functional and non-functional requirements, business rules, data model, use cases and the proposed REST API contract.
<!-- CONFIG-END -->

## 1. User stories worked this week

| HU ID | Title | Status (todo/doing/done) | Evidence (PR or commit URL) |
|-------|-------|--------------------------|------------------------------|
| HU-000 | Software Requirements Specification (SRS v1.0) | done | https://github.com/users/soymiguelgomez/projects/2/views/1 |
| HU-001 | Display the four soccer fields (RF-01) | todo | |
| HU-002 | View field details (RF-02) | todo | |
| HU-003 | View field pricing (RF-03) | todo | |
| HU-004 | Check field availability (RF-04) | todo | |
| HU-005 | Select a field (RF-05) | todo | |
| HU-006 | Select date and time slot (RF-06) | todo | |
| HU-007 | Register customer data without an account (RF-07) | todo | |
| HU-008 | Create a booking (RF-08) | todo | |
| HU-009 | Calculate booking amount (RF-09) | todo | |
| HU-010 | Record payment status (RF-10) | todo | |
| HU-011 | Confirm a booking (RF-11) | todo | |
| HU-012 | Look up an existing booking (RF-12) | todo | |
| HU-013 | Manage fields - admin CRUD (RF-13) | todo | |
| HU-014 | Manage time slots (RF-14) | todo | |
| HU-015 | Manage pricing (RF-15) | todo | |
| HU-016 | Manage bookings (RF-16) | todo | |
| HU-017 | Manage payments (RF-17) | todo | |

## 2. My individual contribution

- Co-authored the Software Requirements Specification v1.0 for the Soccer Field Booking and Administration System, released as a document for review on 15/08/2026.
- Defined and documented the 17 functional requirements (RF-01 to RF-17) covering the field catalog, pricing, availability, date and time slot selection, customer registration, booking creation, amount calculation, payment recording, confirmation, booking lookup, and the administrative CRUD for fields, time slots, pricing, bookings and payments.
- Defined the 10 non-functional requirements (RNF-01 to RNF-10) covering usability, performance, security, consistency, availability, browser and mobile compatibility, scalability, API communication, persistence and maintainability.
- Documented the 10 business rules (RN-01 to RN-10), including RN-03: a booking cannot be created on an already occupied time slot, which is the core consistency invariant of the system.
- Defined the data model with four entities (CANCHA, HORARIO, RESERVA, PAGO), their main fields and relationships, including the decision to store customer data with the booking instead of creating a separate user account entity.
- Specified the 11 use cases (CU-01 to CU-11) split by actor (customer and administrator) and built the traceability matrix linking business needs to requirements and use cases.
- Proposed the REST API contract with 8 endpoints over /api/canchas, /api/disponibilidad, /api/reservas and /api/pagos, defining the HTTP method and purpose of each one.
- Defined the component separation for the distributed architecture: frontend, backend/API, booking and payment module, and database, communicating over REST/JSON.
- Defined the acceptance criteria (CA-01 to CA-08) and the evidence expected per requirement, so each requirement can be verified with a screenshot, an API test or a database check.
- Set up the GitHub Project board used to track the user stories derived from these requirements.

## 3. Blockers and risks

- The REST API endpoints are still a proposal; they must be frozen during the technical design phase before implementation starts.
- The payment gateway and payment provider have not been selected, which blocks the detailed design of RF-10 and RF-17.
- Cancellation and refund policies are undefined (RN-10 explicitly defers them), so the booking state machine cannot be closed yet.
- Operating hours and the final pricing for the four fields are still undetermined, which affects RF-03, RF-06 and RF-09.
- Deployment infrastructure, server configuration, maximum concurrent users and the target availability percentage are undefined, so RNF-02 and RNF-05 have no measurable threshold yet.
- Main technical risk: two concurrent requests could book the same field, date and time slot. RN-03, RNF-04 and CA-04 all depend on this. A database-level unique constraint on (field, date, start time) plus transactional validation is the candidate solution, and it must be proven with a concurrency test rather than only a UI check.
- Field dimensions and capacity are not final, so the CANCHA entity may still change.

## 4. Plan for next week

- Refine the 17 functional requirements into implementable user stories with a Definition of Ready.
- Write specific, testable acceptance criteria for each user story, derived from CA-01 to CA-08.
- Freeze the REST API contract and document it in Swagger/OpenAPI.
- Design and create the database schema for CANCHA, HORARIO, RESERVA and PAGO, including the unique constraint that enforces RN-03.
- Set up the repository structure for frontend, backend/API and database, with responsibilities separated as described in RNF-10.
- Set up the local development environment and load configuration through environment variables, with a committed .env.example and no secrets in the repository.
- Create the HU branches following the team convention (hu-xxx-dev) and open pull requests to develop.
- Start implementation of HU-001 and HU-004, which unblock the main booking flow.
- Add the first unit tests for the booking validation logic and an integration test for the availability query.

## 5. Compliance self-check

- [ ] Conventional Commits - `type(scope): summary`
- [ ] Per-environment HU branch + PR to that environment (hu-xxx-dev -> develop, ...)
- [x] Testable acceptance criteria
- [ ] Tests added/updated (unit / integration)
- [ ] DDD / hexagonal boundaries respected (domain has no I/O)
- [x] No secrets; config via environment variables

## 6. Evidence links

- GitHub Project board: https://github.com/users/soymiguelgomez/projects/2/views/1
- Requirements document (SRS v1.0, 15/08/2026): <!-- add repo file URL or commit URL -->
- Repository: <!-- add repository URL -->
