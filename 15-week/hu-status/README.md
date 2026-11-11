<!-- HU-STATUS TEMPLATE - do NOT remove the <!-- ... --> markers or the table headers.
     Your weekly grade is read AUTOMATICALLY from this file:
       15-week/hu-status/README.md  (inside YOUR fork). English. -->

# Weekly Status - Week 15

<!-- CONFIG-START - must match your profile repo (username/username) CONFIG -->
- FULL_NAME: Miguel Andres Gomez Gutierrez
- GITHUB_USER: soymiguelgomez
- TEAM: Futbolix
- SPRINT_GOAL: MVP 3 foundation - single PostgreSQL instance with one user per domain, RabbitMQ with least-privilege service users, the courts domain (database and API) running against it, and administrator login (customers domain) with every admin API checking the JWT
<!-- CONFIG-END -->

## 1. User stories worked this week
| HU ID | Title | Status (todo/doing/done) | Evidence (PR or commit URL) |
|---|---|---|---|
| HU-ADM-001 | Manage courts: courts schema, seed of the four courts and least-privilege roles (ftx-courts-db) | doing | https://github.com/code-corhuila/ftx-courts-db/pull/1 |
| HU-ADM-001 | Manage courts: courts API (list, get, administrator update) with tests (ftx-courts-api; split in #2 to #5) | doing | https://github.com/code-corhuila/ftx-courts-api/pull/2 |
| HU-ADM-001 / HU-RES-001 | Schedules API: weekly schedule, bookable slots (status and price read from ftx-courts-api) and administrator changes (ftx-schedules-api; split in #2 to #5) | doing | https://github.com/code-corhuila/ftx-schedules-api/pull/2 |
| N/A (no HU ID) | Single PostgreSQL instance aligned with Annex J and one login user per domain (ftx-infra-postgres) | doing | https://github.com/code-corhuila/ftx-infra-postgres/pull/12 |
| N/A (security story #56, #57, #58) | RabbitMQ broker with one least-privilege user per service (ftx-infra-postgres) | doing | https://github.com/code-corhuila/ftx-infra-postgres/pull/11 |
| N/A (no HU ID) | Remove the fixed admin password and personal-looking seed data from the frontend mock (ftx-front) | doing | https://github.com/code-corhuila/ftx-front/pull/17 |
| HU-ADM-002 | Administrator login: customers schema with administrator accounts and refresh tokens (ftx-customers-db) | doing | https://github.com/code-corhuila/ftx-customers-db/pull/2 |
| HU-ADM-002 | Administrator login: login, refresh, logout and JWKS with lockout and rate limit (ftx-customers-api; split in #3 to #8) | doing | https://github.com/code-corhuila/ftx-customers-api/pull/3 |
| HU-ADM-002 | Frontend uses the real login and courts services while reservations stay simulated (ftx-front) | doing | https://github.com/code-corhuila/ftx-front/pull/19 |
| HU-ADM-001 / HU-ADM-002 | Courts and schedules APIs check the administrator JWT instead of trusting X-User headers (security fix) | doing | https://github.com/code-corhuila/ftx-courts-api/pull/1#issuecomment-6801845127 |
| HU-RES-002 | Reject reservations that start in the past, and its frontend tests (ftx-front) | done | https://github.com/code-corhuila/ftx-front/pull/8 |
| N/A (no HU ID) | ADR-011 and ADR-012: runtime of courts, schedules and customers, and per-service JWT check (ftx-docs) | doing | https://github.com/code-corhuila/ftx-docs/pull/67 |
| N/A (no HU ID) | Root compose with the customers, courts and schedules APIs, one network and project per environment (ftx-infra-postgres) | doing | https://github.com/code-corhuila/ftx-infra-postgres/pull/13 |

## 2. My individual contribution
- `ftx-courts-db`: `courts.court` from `06-data/models.md` and the `Court` contract, seed of the four courts with the ids already used by `ftx-schedules-db`, `courts_writer` limited to `SELECT, UPDATE` (courts are never created or deleted, BR-001), one rollback per migration and 13 post-migration checks. Rebuild check passed on PostgreSQL 16.15: https://github.com/code-corhuila/ftx-courts-db/pull/1#issuecomment-6782274628
- `ftx-courts-api` (Java 21, Spring Boot 3.5, hexagonal): `GET /api/v1/courts`, `GET /api/v1/courts/{id}`, `PATCH /api/v1/admin/courts/{id}` with every response of the contract, correlation id, JSON logs and audit log (FR-036). 37 tests, including integration tests on the real `ftx-courts-db` migrations as `courts_app`, and 15 HTTP calls on a running instance: https://github.com/code-corhuila/ftx-courts-api/pull/1#issuecomment-6782931590
- `ftx-schedules-api`: schedules and bookable slots; court status and price come from `ftx-courts-api` over REST (never from the courts schema). 30 tests, and both services run together over HTTP: a court put in maintenance in `ftx-courts-api` stops offering slots here, and with `ftx-courts-api` stopped the answer is 503 in under 40 ms while this service stays up: https://github.com/code-corhuila/ftx-schedules-api/pull/1
- `ftx-infra-postgres`: `PG_*` variables, `env/` files, `platform` network and an init script that creates `schedules_app`, `courts_app`, `reservations_app`, `payments_app`; cross-domain permission checks recorded in https://github.com/code-corhuila/ftx-infra-postgres/pull/12#issuecomment-6782275074
- Answered the TB4 threat model review (`traceparent` in AMQP headers, `processed_events` against replays): https://github.com/code-corhuila/ftx-docs/pull/55
- Team plan for MVP 3, sprints and the final project, shared with the team.
- `ftx-customers-db` (HU-ADM-002): `customers.user_account` and `customers.refresh_token` from `06-data/data-dictionary.md` (user-service). The database refuses anything that is not a BCrypt hash, no administrator is seeded, and `customers_reader` cannot read the hash columns. Rebuild check passed on PostgreSQL 16.15 (migrate, migrate again, rollback, migrate): https://github.com/code-corhuila/ftx-customers-db/pull/2
- `ftx-customers-api` (HU-ADM-002, `auth-service.yaml`): RS256 access token of 1 hour, opaque refresh token of 7 days stored with BCrypt and rotated on every use, reuse of a spent token revokes its family, lockout after 5 failures, 10 attempts per address in 5 minutes, security events without emails or tokens, and the first administrator created from a BCrypt hash given at deployment. 60 tests, including two-owner tests and integration on the real migrations: https://github.com/code-corhuila/ftx-customers-api/pull/2
- Security fix in `ftx-courts-api` and `ftx-schedules-api`: they trusted `X-User-Id` / `X-User-Role` while their ports are published, so anyone could change a price or a schedule. Both now check the JWT with the JWKS of `ftx-customers-api`; spoofed headers answer 401 in a live run with the three services (45 and 37 tests): https://github.com/code-corhuila/ftx-courts-api/pull/1#issuecomment-6801845127 and https://github.com/code-corhuila/ftx-schedules-api/pull/1#issuecomment-6806942739
- `ftx-front`: mixed mode with the real login and courts services and a development proxy; checked in the browser (real login, price change saved in PostgreSQL). 84 tests: https://github.com/code-corhuila/ftx-front/pull/19
- `ftx-docs`: ADR-011 and ADR-012 (`ftx-customers-*` hosts the documented user-service, answering the open point of ADR-009); resolved the conflict of the Week 08 planning PR and merged it after its approval: https://github.com/code-corhuila/ftx-docs/pull/43

## 3. Blockers and risks
- The code-corhuila organization account is locked by billing: no GitHub Actions job starts in any `ftx-*` repository, so CI cannot be green until the instructor fixes it. All evidence this week is from local runs.
- Docker cannot run on my laptop (WSL and Virtual Machine Platform disabled); the `docker compose` flow and the image builds are still unverified.
- Payments still have no repository (ADR-009 open). Administrator authentication now lives in `ftx-customers-*` (ADR-012, proposed, waiting for review).
- None of this week's pull requests has a review yet; the gateway and reservations repositories, owned by other team members, still have no code.

## 4. Plan for next week
- Merge in order after review: `ftx-courts-db#1` and `ftx-customers-db#1`, `ftx-infra-postgres#12`, `#13`, then `#11`, then the APIs and `ftx-front#18`.
- Add the contract `GET /api/v1/health` to `ftx-courts-api`, and move the frontend from the development proxy to the gateway when it exists.
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
- https://github.com/code-corhuila/ftx-courts-api/pull/2 to /pull/5 (one change split in four parts; the first full pull request, with the live-run comments, is https://github.com/code-corhuila/ftx-courts-api/pull/1)
- https://github.com/code-corhuila/ftx-schedules-api/pull/2 to /pull/5 (split in four parts; first full pull request: https://github.com/code-corhuila/ftx-schedules-api/pull/1)
- https://github.com/code-corhuila/ftx-infra-postgres/pull/12
- https://github.com/code-corhuila/ftx-infra-postgres/pull/11
- https://github.com/code-corhuila/ftx-front/pull/17
- https://github.com/code-corhuila/ftx-docs/pull/55
- https://github.com/code-corhuila/ftx-customers-db/pull/2
- https://github.com/code-corhuila/ftx-customers-api/pull/3 to /pull/8 (split in six parts; first full pull requests: https://github.com/code-corhuila/ftx-customers-api/pull/1 and /pull/2)
- https://github.com/code-corhuila/ftx-front/pull/19
- https://github.com/code-corhuila/ftx-front/pull/8
- https://github.com/code-corhuila/ftx-infra-postgres/pull/13
- https://github.com/code-corhuila/ftx-docs/pull/67
- https://github.com/code-corhuila/ftx-docs/pull/43
- https://github.com/code-corhuila/ftx-schedules-api/pull/1#issuecomment-6806942739
- Self-check notes: user story branches follow `hu-xxx-dev` (`hu-adm-001-dev` in courts and schedules, `hu-adm-002-dev` in customers and the frontend; the first customers and frontend pull requests were replaced by `ftx-customers-db#2`, `ftx-customers-api#2` and `ftx-front#19` after renaming their `feat/` branches). Infrastructure and docs work has no HU ID and keeps `feat/` and `docs/` branches, which `00-governance/branching-policy.md` allows. The courts, schedules and customers API pull requests were longer than the 400 lines of code of `git-conventions.md`, so each one was split into stacked parts of at most 400 lines that compile and pass their own tests (`ftx-courts-api#2`-`#5`, `ftx-schedules-api#2`-`#5`, `ftx-customers-api#3`-`#8`). All test results are from local runs because CI is locked by billing. `docker build` and `docker compose up` are not verified (TD-003).
