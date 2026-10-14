<!-- HU-STATUS TEMPLATE - do NOT remove the <!-- ... --> markers or the table headers.
     Your weekly grade is read AUTOMATICALLY from this file:
       11-week/hu-status/README.md  (inside YOUR fork). English. -->

# Weekly Status - Week 11

<!-- CONFIG-START - must match your profile repo (username/username) CONFIG -->
- FULL_NAME: Miguel Andres Gomez Gutierrez
- GITHUB_USER: soymiguelgomez
- TEAM: Futbolix
- SPRINT_GOAL: Release / MVP 2 (v2.0.0) - frontend test suite and past-start-time rule through reviewed PRs, ADR-009 and ADR-010, CHANGELOG 2.0.0, and the Week 08 planning artifacts published
<!-- CONFIG-END -->

## 1. User stories worked this week
| HU ID | Title | Status (todo/doing/done) | Evidence (PR or commit URL) |
|---|---|---|---|
| HU-RES-002 | Create Field Reservation - reject start times before the current business time (America/Bogota) | doing | https://github.com/code-corhuila/ftx-front/pull/8 |
| HU-RES-002 / HU-RES-004 / HU-ADM-001 | Frontend test setup, API client tests and component tests (409 slot conflict, 404 lookup by code, admin route guard) | doing | https://github.com/code-corhuila/ftx-front/pull/7 |
| HU-ARC-001 | Record ADR-009 and ADR-010 (ftx-docs) | doing | https://github.com/code-corhuila/ftx-docs/pull/42 |
| N/A (no HU ID) | Revert of PR #40, merged into ftx-docs `main` without the required approval | doing | https://github.com/code-corhuila/ftx-docs/pull/41 |
| N/A (no HU ID) | Week 08 MVP 2 planning artifacts published (written 2026-09-23) | doing | https://github.com/code-corhuila/ftx-docs/pull/43 |
| N/A (no HU ID) | Board URL in `agile-conventions.md` points to the team project | doing | https://github.com/code-corhuila/ftx-docs/pull/44 |
| N/A (no HU ID) | Mock data: fourth court bookable | doing | https://github.com/code-corhuila/ftx-front/pull/6 |

All rows are "doing": every PR is open and waiting for review (status on 2026-10-14). Nothing of this week is merged in `develop`, `qa` or `main`.

### Acceptance criteria met
Criteria from `ftx-docs/04-requirements/user-stories.md`. Each item is covered by an automated test in the open PRs, run against a stubbed gateway or the browser mock, not against real services:
- HU-RES-002 AC3/AC4: a `409 RESERVATION_SLOT_UNAVAILABLE` leads to the full-page "Esa franja acaba de ser reservada" screen, which keeps the court and date. Every create request sends an `Idempotency-Key` (PRs #9, #10).
- HU-RES-002 (business rule): reservations cannot start before the current minute in America/Bogota; the mock answers `422 BUSINESS_RULE_VIOLATION` (PR #8). This minute-level rule is not yet written in HU-RES-002 nor in `reservation-service.yaml`; the PR asks the Product Owner to add it.
- HU-RES-004 AC1/AC3: a found code opens the detail page; a 404 and a malformed code show the same "not found" message (PR #10).
- HU-ADM-001 AC1/AC2: without a session, every `/admin` route redirects to the login (PR #10). Real enforcement belongs to the gateway and services.

## 2. My individual contribution
- ftx-front, four PRs to `develop` that replace the earlier branches `hu-front-tests-dev` and `hu-res-002-dev` (deleted from the remote on 2026-10-14). Commits re-applied with `git cherry-pick -x`:
  - PR #7 `chore/hu-res-002-test-setup`: Vitest 3, Testing Library, jsdom and `npm test` (`c6484c2`), and the removal of the dependencies used only by contract tests (`d8eb548`).
  - PR #8 `feat/hu-res-002-past-start-time`: past-start-time rule in the UI and the mock, with 23 tests (`90d79a2`, from `7aba700`).
  - PR #9 `chore/hu-res-002-tests-api-clients`: 20 unit tests for the API clients and `ErrorResponse` handling (`ccdfc75`).
  - PR #10 `chore/hu-res-002-tests-components`: 13 component tests (`3b52262`), and booking tests that use a future date relative to today (`6f6347f`).
  - Verified locally: `typecheck`, `build` and `npm test` pass on each branch; all four combined run 9 test files and 56 tests.
  - PR #6 `chore/enable-fourth-court-mock`: Cancha 4 starts as ACTIVE in the mock (`4f761bc`).
- ftx-docs:
  - Pushed `hu-arc-001-dev` (HU-ARC-001: ADR-009, ADR-010, CHANGELOG 2.0.0, MVP 2 demo script). It reached `main` as PR #40, merged from my account ten seconds after it was opened and without the approval of ariel5253 that `branching-policy.md` requires.
  - Corrected it with PR #41 (`hotfix/revert-pr-40`, `ffa817c`), which restores `main`, and PR #42 (`feat/hu-arc-001-adr-009-010`, the same 7 commits re-applied with `cherry-pick -x`), both waiting for ariel5253.
  - PR #43: published unchanged the Week 08 planning artifacts written on 2026-09-23 (`c6bb07a`, `cf57fc8`, `d6ec6dc`, `473cd7a`).
  - PR #44: Board URL of `agile-conventions.md` set to the team project #20 (`cfb7696`).
  - Comment on PR #38 (Dannamo34): ADR-009 and ADR-010 reference ADR-005, 006 and 007 as pending merge.
- ftx-schedules-db: closed my PR #1 as superseded by HU-ADM-001 (v2.0.0), whose README credits that branch.
- This fork: weekly reports for weeks 06 to 11 updated with verifiable evidence.

### Contribution to MVP 2 / v2.0.0
| Area | This week |
|---|---|
| Contracts (OpenAPI / events) | Contract tests against the ftx-docs OpenAPI contracts exist locally but are not published: ftx-docs is private and ftx-front is public, and the Tech Lead and the instructor have been asked whether the contracts may be copied there |
| Saga / Outbox | ADR-010 recommends a choreographed saga (Proposed, not implemented). Outbox: ADR-006 pending merge in PR #38 |
| Per-environment config | None this week |
| ADR | ADR-009 and ADR-010, Proposed and not implemented (PR #42) |
| CHANGELOG | ftx-docs `CHANGELOG.md` `[2.0.0] - Unreleased` with "Not included in this release" (PR #42). ftx-front: none |
| Tests (code quality) | First test suite of ftx-front in PRs #7 to #10 (56 tests combined) |

### Commits (author soymiguelgomez, 2026-10-12 to 2026-10-14)
| Repo | Hash | Date | Message | Branch / PR |
|---|---|---|---|---|
| ftx-front | `4f761bc` | 2026-10-13 16:56 | chore(web): enable the fourth court in the mock data | `chore/enable-fourth-court-mock` - PR #6 |
| ftx-front | `c6484c2` | 2026-10-13 22:57 | chore(web): set up vitest with testing library and jsdom | `chore/hu-res-002-test-setup` - PR #7 |
| ftx-front | `d8eb548` | 2026-10-13 22:57 | chore(web): keep only the test runner dependencies | `chore/hu-res-002-test-setup` - PR #7 |
| ftx-front | `90d79a2` | 2026-10-13 22:58 | feat(web): reject reservations that start before the current time | `feat/hu-res-002-past-start-time` - PR #8 |
| ftx-front | `ccdfc75` | 2026-10-13 22:59 | test(web): cover api clients and error response handling | `chore/hu-res-002-tests-api-clients` - PR #9 |
| ftx-front | `3b52262` | 2026-10-13 22:59 | test(web): cover reservation code, slot conflict, lookup 404 and admin guard | `chore/hu-res-002-tests-components` - PR #10 |
| ftx-front | `6f6347f` | 2026-10-13 23:00 | test(web): use a future date relative to today in the booking details tests | `chore/hu-res-002-tests-components` - PR #10 |
| ftx-docs | `d944c05` to `b9daa4f` (7) | 2026-10-13 21:51 to 22:22 | docs(docs): HU-ARC-001, ADR-009, ADR-010, changelog, demo script | `hu-arc-001-dev` - PR #40 (merged without review) |
| ftx-docs | `ffa817c` | 2026-10-13 22:53 | docs(docs): revert pr #40, merged into main without the required approval | `hotfix/revert-pr-40` - PR #41 |
| ftx-docs | `c778561` to `e189e5e` (7) | 2026-10-13 22:56 | same 7 commits re-applied with `cherry-pick -x` | `feat/hu-arc-001-adr-009-010` - PR #42 |
| ftx-docs | `c6bb07a`, `cf57fc8`, `d6ec6dc`, `473cd7a` | 2026-10-14 07:10 | docs(docs): week 08 mvp 2 planning artifacts | `docs/mvp2-planning` - PR #43 |
| ftx-docs | `cfb7696` | 2026-10-14 07:12 | docs(docs): point the board url to the team project | `docs/agile-board-url` - PR #44 |
| fork | `71a2246`, `919380c`, `b7fa855`, `2963b24`, `4fcd365` | 2026-10-13 20:23 to 2026-10-14 07:12 | docs(hu-status): weekly reports | `main` of this fork |

Commit dates are the commit (re-application) dates; the original author dates of the cherry-picked commits are kept in each commit.

### Pull requests and flow
| Stage | Branch -> target | Status |
|---|---|---|
| dev | ftx-front #6 `chore/enable-fourth-court-mock` -> `develop` | Open, review requested from HERMAR55611 (and ariel5253 by CODEOWNERS) |
| dev | ftx-front #7, #8, #9, #10 -> `develop` | Open, same reviewers; merge order #7, then #8 and #9, then #10 |
| qa | `hu-front-qa` -> `qa` (ftx-front #3) | Merged on 2026-10-13 by emelendez20201-ship-it with my Week 10 commits re-applied by `cherry-pick -x`. This week's commits are not in `qa` yet |
| main | ftx-front #5 `release/2.0.0` -> `main` (emelendez20201-ship-it) | Open; it does not include this week's PRs (comment posted asking whether to include them) |
| main (docs) | ftx-docs #41, then #42, #43, #44 -> `main` | Open, review requested from ariel5253 |

## 3. Blockers and risks
- PR #40 in ftx-docs was merged into `main` from my account without review; `main` of ftx-docs has no branch protection (private repository; the protection API answers 403 on this plan). Correction in PRs #41 and #42.
- In the Week 08 files HU-ARC-001 means "ADR-005, ADR-006, ADR-007", while PR #42 uses it for "Record ADR-009 and ADR-010". The Product Owner must choose the IDs.
- PR #7 alone leaves `npm test` with exit code 1 ("No test files found") until PR #8 or #9 is merged.
- `npm audit` reports advisories in Vitest 3's dev-only dependencies (`tinypool`, `@vitest/mocker`); the full fix needs Vitest 4.
- The demo administrator login is still a string in `src/api/mock/constants.ts`.
- Docker is not installed on my machine: the nginx image and Part 1 of the demo script have not been run.

## 4. Plan for next week
- Address review comments on ftx-front #6 to #10 and ftx-docs #41 to #44; after merge, promote the frontend changes to `qa` with `cherry-pick -x`.
- Get an answer on the contract copies (Tech Lead and instructor) and, if allowed, open the contract-tests PR.
- Move the demo credential of ftx-front to `VITE_*` variables.
- Configure weekly Sprint iterations in the team board (Project #20) with the team.

## 5. Compliance self-check
- [x] Conventional Commits - `type(scope): summary`
- [ ] Per-environment HU branch + PR to that environment (hu-xxx-dev -> develop, ...)
- [x] Testable acceptance criteria
- [x] Tests added/updated (unit / integration)
- [ ] DDD / hexagonal boundaries respected (domain has no I/O)
- [x] No secrets; config via environment variables

## 6. Evidence links
- ftx-front PRs: https://github.com/code-corhuila/ftx-front/pull/6, https://github.com/code-corhuila/ftx-front/pull/7, https://github.com/code-corhuila/ftx-front/pull/8, https://github.com/code-corhuila/ftx-front/pull/9, https://github.com/code-corhuila/ftx-front/pull/10
- ftx-docs PRs: https://github.com/code-corhuila/ftx-docs/pull/40 (merged without review), https://github.com/code-corhuila/ftx-docs/pull/41, https://github.com/code-corhuila/ftx-docs/pull/42, https://github.com/code-corhuila/ftx-docs/pull/43, https://github.com/code-corhuila/ftx-docs/pull/44
- Comment on ftx-docs PR #38: https://github.com/code-corhuila/ftx-docs/pull/38#issuecomment-6160545907
- Comment on ftx-front PR #5: https://github.com/code-corhuila/ftx-front/pull/5#issuecomment-6160546246
- ftx-schedules-db PR #1 (closed as superseded): https://github.com/code-corhuila/ftx-schedules-db/pull/1
- qa promotion of the Week 10 work: https://github.com/code-corhuila/ftx-front/pull/3
- Self-check notes: all commits use `type(scope): summary` (the hu-status commit `b7fa855` too). The ftx-front branches use `feat/` and `chore/` children of `develop`, allowed by `branching-policy.md`, not `hu-xxx-dev`. The stories have Given/When/Then criteria. Tests were added in PRs #7 to #10. The frontend has no DDD domain layer to evaluate. Configuration comes from `VITE_*` variables; the only credential is the mock-only demo login.
