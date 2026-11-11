<!-- HU-STATUS TEMPLATE - do NOT remove the <!-- ... --> markers or the table headers.
     Your weekly grade is read AUTOMATICALLY from this file:
       15-week/hu-status/README.md  (inside YOUR fork). English. -->

# Weekly Status - Week 15

<!-- CONFIG-START - must match your profile repo (username/username) CONFIG -->
- FULL_NAME: Miguel Andres Gomez Gutierrez
- GITHUB_USER: soymiguelgomez
- TEAM: Futbolix
- SPRINT_GOAL: MVP 3 foundation - single PostgreSQL instance with one user per domain, RabbitMQ with least-privilege service users, and the courts domain (database and API) running against it
<!-- CONFIG-END -->

## 1. User stories worked this week
| HU ID | Title | Status (todo/doing/done) | Evidence (PR or commit URL) |
|---|---|---|---|
| HU-ADM-001 | Manage courts: courts schema, seed of the four courts and least-privilege roles (ftx-courts-db) | doing | https://github.com/code-corhuila/ftx-courts-db/pull/1 |
| HU-ADM-001 | Manage courts: courts API (list, get, administrator update) with tests (ftx-courts-api) | doing | https://github.com/code-corhuila/ftx-courts-api/pull/1 |
| HU-ADM-001 / HU-RES-001 | Schedules API: weekly schedule, bookable slots (status and price read from ftx-courts-api) and administrator changes (ftx-schedules-api) | doing | https://github.com/code-corhuila/ftx-schedules-api/pull/1 |
| N/A (no HU ID) | Single PostgreSQL instance aligned with Annex J and one login user per domain (ftx-infra-postgres) | doing | https://github.com/code-corhuila/ftx-infra-postgres/pull/12 |
| N/A (security story #56, #57, #58) | RabbitMQ broker with one least-privilege user per service (ftx-infra-postgres) | doing | https://github.com/code-corhuila/ftx-infra-postgres/pull/11 |
| N/A (no HU ID) | Remove the fixed admin password and personal-looking seed data from the frontend mock (ftx-front) | doing | https://github.com/code-corhuila/ftx-front/pull/17 |

## 2. My individual contribution
- `ftx-courts-db`: `courts.court` from `06-data/models.md` and the `Court` contract, seed of the four courts with the ids already used by `ftx-schedules-db`, `courts_writer` limited to `SELECT, UPDATE` (courts are never created or deleted, BR-001), one rollback per migration and 13 post-migration checks. Rebuild check passed on PostgreSQL 16.15: https://github.com/code-corhuila/ftx-courts-db/pull/1#issuecomment-6782274628
- `ftx-courts-api` (Java 21, Spring Boot 3.5, hexagonal): `GET /api/v1/courts`, `GET /api/v1/courts/{id}`, `PATCH /api/v1/admin/courts/{id}` with every response of the contract, correlation id, JSON logs and audit log (FR-036). 37 tests, including integration tests on the real `ftx-courts-db` migrations as `courts_app`, and 15 HTTP calls on a running instance: https://github.com/code-corhuila/ftx-courts-api/pull/1#issuecomment-6782931590
- `ftx-schedules-api`: schedules and bookable slots; court status and price come from `ftx-courts-api` over REST (never from the courts schema). 30 tests, and both services run together over HTTP: a court put in maintenance in `ftx-courts-api` stops offering slots here, and with `ftx-courts-api` stopped the answer is 503 in under 40 ms while this service stays up: https://github.com/code-corhuila/ftx-schedules-api/pull/1
- `ftx-infra-postgres`: `PG_*` variables, `env/` files, `platform` network and an init script that creates `schedules_app`, `courts_app`, `reservations_app`, `payments_app`; cross-domain permission checks recorded in https://github.com/code-corhuila/ftx-infra-postgres/pull/12#issuecomment-6782275074
- Answered the TB4 threat model review (`traceparent` in AMQP headers, `processed_events` against replays): https://github.com/code-corhuila/ftx-docs/pull/55
- Team plan for MVP 3, sprints and the final project, shared with the team.

## 3. Blockers and risks
- The code-corhuila organization account is locked by billing: no GitHub Actions job starts in any `ftx-*` repository, so CI cannot be green until the instructor fixes it. All evidence this week is from local runs.
- Docker cannot run on my laptop (WSL and Virtual Machine Platform disabled); the `docker compose` flow and the image builds are still unverified.
- Payments and administrator authentication still have no repository (ADR-009 open).

## 4. Plan for next week
- Merge in order after review: `ftx-courts-db#1`, `ftx-infra-postgres#12`, then `#11`.
- Connect `ftx-front` to `ftx-courts-api` and `ftx-schedules-api` through the gateway.
- Enable WSL and run the full `docker compose` flow following the READMEs.
- Promote to `qa` and `main` with `v3.0.0` for the release.

## 5. Compliance self-check
- [x] Conventional Commits - `type(scope): summary`
- [x] Per-environment HU branch + PR to that environment (hu-xxx-dev -> develop, ...)
- [x] Testable acceptance criteria
- [x] Tests added/updated (unit / integration)
- [x] DDD / hexagonal boundaries respected (domain has no I/O)
- [x] No secrets; config via environment variables

## 6. Evidence links
- https://github.com/code-corhuila/ftx-courts-db/pull/1
- https://github.com/code-corhuila/ftx-courts-api/pull/1
- https://github.com/code-corhuila/ftx-schedules-api/pull/1
- https://github.com/code-corhuila/ftx-infra-postgres/pull/12
- https://github.com/code-corhuila/ftx-infra-postgres/pull/11
- https://github.com/code-corhuila/ftx-front/pull/17
- https://github.com/code-corhuila/ftx-docs/pull/55
