<!-- HU-STATUS TEMPLATE - do NOT remove the <!-- ... --> markers or the table headers.
     Your weekly grade is read AUTOMATICALLY from this file:
       11-week/hu-status/README.md  (inside YOUR fork). English. -->

# Weekly Status - Week 11

<!-- CONFIG-START - must match your profile repo (username/username) CONFIG -->
- FULL_NAME: Miguel Andres Gomez Gutierrez
- GITHUB_USER: soymiguelgomez
- TEAM: Futbolix
- SPRINT_GOAL: Release / MVP 2 (v2.0.0) - frontend test suite (unit, component, contract), resilience, CHANGELOG and pending ADRs
<!-- CONFIG-END -->

## 1. User stories worked this week
| HU ID | Title | Status (todo/doing/done) | Evidence (PR or commit URL) |
|---|---|---|---|
| HU-RES-002 | Create Field Reservation - reject start times before the current business time (America/Bogota) | doing | https://github.com/code-corhuila/ftx-front/commit/7aba700e6e338df3666a3122b82c0b23becf0266 |
| HU-RES-002 / HU-RES-004 / HU-ADM-001 | Frontend tests: 409 slot conflict, 404 lookup by code, admin route guard | doing | https://github.com/code-corhuila/ftx-front/tree/hu-front-tests-dev |
| N/A (no HU ID) | Contract tests: mock responses validated against the ftx-docs OpenAPI contracts | doing | https://github.com/code-corhuila/ftx-front/commit/b4b8f7966ff309fd09bf7ac44173882e98187fdb |
| N/A (no HU ID) | Mock data: fourth court bookable | doing | https://github.com/code-corhuila/ftx-front/commit/4f761bcacc3cd9bd1825aca3c2fbb92ddf771272 |

All rows are "doing": the branches are pushed, but no PR to `develop` has been opened or merged yet (status on 2026-10-13).

### Acceptance criteria met
Criteria from `ftx-docs/04-requirements/user-stories.md`. Each item is now covered by an automated test, run against a stubbed gateway or the browser mock, not against the real services:
- HU-RES-002 AC3/AC4: a `409 RESERVATION_SLOT_UNAVAILABLE` leads to the full-page "Esa franja acaba de ser reservada" screen, which keeps the court and date (`BookingDetailsPage.test.tsx`). Every create request sends an `Idempotency-Key`.
- HU-RES-002 (business rule): `7aba700` rejects start times before the current minute in America/Bogota. Its own tests cover past, future and equal times, the time zone and the month change. The mock answers `422 BUSINESS_RULE_VIOLATION`.
- HU-RES-004 AC1/AC3: a found code opens the detail page; a 404 and a malformed code show the same "not found" message, and a malformed code never calls the API (`LookupPage.test.tsx`).
- HU-ADM-001 AC1/AC2: without a session, every `/admin` route redirects to the login and remembers the requested route; with a session the content is shown (`RequireAdmin.test.tsx`). Real enforcement still belongs to the gateway and services.

## 2. My individual contribution
- `hu-front-tests-dev` (from `develop` `ce0c808`):
  - Set up Vitest 3, Testing Library and jsdom, with `npm test`. The tests never read the local `.env`.
  - 20 unit tests for the API clients (`/api/v1` prefix, query, `Idempotency-Key`, `Authorization`, retries of reads, token refresh on 401) and for `ErrorResponse` handling.
  - 13 component tests: `ReservationCodeBlock`, the 409 screen, the 404 on lookup by code, `RequireAdmin`.
  - 11 contract tests: every mock response, success and error, is validated with ajv against the OpenAPI schemas copied from ftx-docs (`main` `c0e9d23`) into `contracts/openapi/`, plus 4 tests proving the validator rejects invalid bodies. No difference between the mock and the contracts was found.
  - README: how to run the tests, and the team's `hu-[story]-[environment]` branch naming.
  - `typecheck`, `build` and `npm test` pass (48 tests).
- `7aba700` (`feat/block-past-reservation-slots`): reservations cannot start before the current business minute in America/Bogota, in both the UI and the mock, with Vitest tests.
- `4f761bc` (`chore/enable-fourth-court-mock`): Cancha 4 starts as ACTIVE in the mock, and `DB_VERSION` 2 reseeds browsers that kept the old data.

### Contribution to MVP 2 / v2.0.0
| Area | This week |
|---|---|
| Contracts (OpenAPI / events) | Yes: contract tests keep the frontend's mock aligned with `07-api/contracts/openapi` |
| Saga / Outbox | None yet |
| Per-environment config | None yet (moving the demo credential to `VITE_*` variables is planned) |
| ADR | None yet (ADR-005 and ADR-007 planned in ftx-docs) |
| CHANGELOG | None yet (`CHANGELOG.md` [2.0.0] planned for ftx-front and ftx-docs) |
| Tests (code quality) | Yes: first test suite of ftx-front - unit, component and contract (48 tests) |

### Commits (author soymiguelgomez, 2026-10-12 to 2026-10-13)
| Repo | Hash | Date | Message | Branch / PR |
|---|---|---|---|---|
| ftx-front | `4f761bc` | 2026-10-13 16:56 | chore(web): enable the fourth court in the mock data | `chore/enable-fourth-court-mock` - no PR yet |
| ftx-front | `7aba700` | 2026-10-13 17:05 | feat(web): reject reservations that start before the current time | `feat/block-past-reservation-slots` - no PR yet |
| ftx-front | `d06cb96` | 2026-10-13 20:43 | chore(web): set up vitest with testing library and jsdom | `hu-front-tests-dev` - no PR yet |
| ftx-front | `20cf262` | 2026-10-13 20:43 | test(web): cover api clients and error response handling | `hu-front-tests-dev` - no PR yet |
| ftx-front | `549cf8b` | 2026-10-13 20:43 | test(web): cover reservation code, slot conflict, lookup 404 and admin guard | `hu-front-tests-dev` - no PR yet |
| ftx-front | `b4b8f79` | 2026-10-13 20:43 | test(web): validate mock responses against the openapi contracts | `hu-front-tests-dev` - no PR yet |
| ftx-front | `477d44f` | 2026-10-13 20:43 | docs(web): document how to run the tests | `hu-front-tests-dev` - no PR yet |
| ftx-front | `45bc116` | 2026-10-13 21:08 | docs(web): document the hu branch naming and the test folders | `hu-front-tests-dev` - not pushed yet |
| ftx-docs | - | - | No commits this week so far | - |

### Pull requests and flow
| Stage | Branch -> target | Status |
|---|---|---|
| dev | `hu-front-tests-dev` -> `develop` | Pushed 2026-10-13, PR not opened |
| dev | `feat/block-past-reservation-slots` -> `develop` | Pushed 2026-10-13, PR not opened |
| dev | `chore/enable-fourth-court-mock` -> `develop` | Pushed 2026-10-13, PR not opened |
| qa | `hu-front-qa` -> `qa` | Created 2026-10-13 by emelendez20201-ship-it with my Week 10 commits re-applied by `cherry-pick -x` (`6f192fb`, `2c91da1`, `944f75c`) and PR #2's translation. No PR to `qa` yet |
| main | `hu-front-main` -> `main` | Not started |

## 3. Blockers and risks
- `7aba700` and `hu-front-tests-dev` both add Vitest and the `test` script, and `7aba700` changes the README in Spanish while `develop` now has it in English. Whichever PR is merged second must be rebased (package files and README).
- `npm audit` reports 2 critical and 1 moderate advisories in Vitest 3's own dependencies (`tinypool`, `@vitest/mocker`). They are dev-only and not in the nginx image; the full fix needs Vitest 4, a breaking upgrade.
- The demo administrator login is still a string in `src/api/mock/constants.ts`.
- Docker is not installed on my machine, so the nginx image build has not been verified locally.
- No PR has been opened yet, so nothing from this week is in `develop`, `qa` or `main`.

## 4. Plan for next week
- Resilience in ftx-front (`hu-front-resilience-dev`): retry notice for 5xx, 503 and timeouts, an error boundary, a polling limit on the payment confirmation, and the demo credential moved to `VITE_*` variables.
- Open the PRs to `develop`, then promote with `cherry-pick -x` through `hu-front-qa` -> `qa` and `hu-front-main` -> `main`; add `CHANGELOG.md` [2.0.0] and version 2.0.0.
- ftx-docs: ADR-005 and ADR-007 (Proposed), `CHANGELOG.md` [2.0.0], and PRs for the two 10-devops branches left without one in Week 08.

## 5. Compliance self-check
- [x] Conventional Commits - `type(scope): summary`
- [ ] Per-environment HU branch + PR to that environment (hu-xxx-dev -> develop, ...)
- [x] Testable acceptance criteria
- [x] Tests added/updated (unit / integration)
- [ ] DDD / hexagonal boundaries respected (domain has no I/O)
- [x] No secrets; config via environment variables

## 6. Evidence links
- Tests branch: https://github.com/code-corhuila/ftx-front/tree/hu-front-tests-dev
- Open the PR to develop: https://github.com/code-corhuila/ftx-front/pull/new/hu-front-tests-dev
- Contract tests: https://github.com/code-corhuila/ftx-front/blob/hu-front-tests-dev/src/api/mock/contract.test.ts
- Past start times: https://github.com/code-corhuila/ftx-front/commit/7aba700e6e338df3666a3122b82c0b23becf0266
- Fourth court: https://github.com/code-corhuila/ftx-front/commit/4f761bcacc3cd9bd1825aca3c2fbb92ddf771272
- qa branch: https://github.com/code-corhuila/ftx-front/tree/hu-front-qa
- Self-check notes: all commits use `type(scope): summary`. `hu-front-tests-dev` follows the hu branch naming, but its PR to `develop` is not open yet. The stories have Given/When/Then criteria. 48 tests were added, plus the tests in `7aba700`. The frontend has no DDD domain layer to evaluate. Configuration comes from `VITE_*` variables with no real secret; the only credential is the mock-only demo login, which is planned to move to `VITE_*` variables.
