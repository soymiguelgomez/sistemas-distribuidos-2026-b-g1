<!-- HU-STATUS TEMPLATE - do NOT remove the <!-- ... --> markers or the table headers.
     Your weekly grade is read AUTOMATICALLY from this file:
       11-week/hu-status/README.md  (inside YOUR fork). English. -->

# Weekly Status - Week 11

<!-- CONFIG-START - must match your profile repo (username/username) CONFIG -->
- FULL_NAME: Miguel Andres Gomez Gutierrez
- GITHUB_USER: soymiguelgomez
- TEAM: Futbolix
- SPRINT_GOAL: Release / MVP 2 (v2.0.0) - frontend test suite and past-start-time rule through reviewed PRs, ADR-009 and ADR-010, CHANGELOG 2.0.0, the Week 08 planning artifacts published, and the injected Wompi failure (HU-PAY-006) for the demo
<!-- CONFIG-END -->

## 1. User stories worked this week
| HU ID | Title | Status (todo/doing/done) | Evidence (PR or commit URL) |
|---|---|---|---|
| HU-RES-002 | Create Field Reservation - reject start times before the current business time (America/Bogota) | doing | https://github.com/code-corhuila/ftx-front/pull/8 |
| HU-RES-002 / HU-RES-004 / HU-ADM-001 | Frontend test setup and API client tests (merged, PRs #7 and #9); component tests for the 409 slot conflict, 404 lookup by code and admin route guard (PR #10, approved by ariel5253, not merged) | doing | https://github.com/code-corhuila/ftx-front/pull/7 |
| HU-PAY-006 | Fail Fast When Wompi Is Unavailable - frontend part, simulated in the mock: request timeout, injectable Wompi outage, circuit breaker, degraded payment screen with retry and cancel. Merged into `develop` | done | https://github.com/code-corhuila/ftx-front/pull/14 |
| HU-ARC-001 | Record ADR-009 and ADR-010 (ftx-docs) | doing | https://github.com/code-corhuila/ftx-docs/pull/45 |
| N/A (no HU ID) | Revert of PR #40, merged into ftx-docs `main` without the required approval | doing | https://github.com/code-corhuila/ftx-docs/pull/41 |
| N/A (no HU ID) | MVP 2 demo script Part 3 (injected failure) and the `ftx-infra-postgres` rename | doing | https://github.com/code-corhuila/ftx-docs/pull/46 |
| N/A (no HU ID) | Mock admin credentials read from env variables | doing | https://github.com/code-corhuila/ftx-front/pull/13 |
| N/A (no HU ID) | Error boundary around the app | doing | https://github.com/code-corhuila/ftx-front/pull/15 |
| N/A (no HU ID) | First ftx-front `CHANGELOG.md` | doing | https://github.com/code-corhuila/ftx-front/pull/16 |
| N/A (no HU ID) | Week 08 MVP 2 planning artifacts published (written 2026-09-23) | doing | https://github.com/code-corhuila/ftx-docs/pull/43 |
| N/A (no HU ID) | Board URL in `agile-conventions.md` points to the team project | doing | https://github.com/code-corhuila/ftx-docs/pull/44 |
| N/A (no HU ID) | Mock data: fourth court bookable | doing | https://github.com/code-corhuila/ftx-front/pull/6 |
| N/A (no HU ID) | Week 11 observability workshop, delivery 1 (CP0 to CP4) on the "customer creates a reservation" journey | done | https://github.com/soymiguelgomez/sistemas-distribuidos-2026-b-g1/tree/main/11-week/workshop |

Status on 2026-10-14 (afternoon): HERMAR55611 approved and merged ftx-front #7, #9 and #14 into `develop`; on that commit (`29f1767`) `npm run typecheck`, `npm test` (6 files, 40 tests) and `npm run build` pass. ariel5253 approved every other open PR listed here; they are not merged yet, so those rows stay "doing". Nothing of this week is in `qa` or `main`. HU-PAY-006 is "done" only for its frontend part: the real circuit breaker belongs to `payment-service`, which has no code.

### Acceptance criteria met
Criteria from `ftx-docs/04-requirements/user-stories.md`. Each item is covered by an automated test in the open PRs, run against a stubbed gateway or the browser mock, not against real services:
- HU-RES-002 AC3/AC4: a `409 RESERVATION_SLOT_UNAVAILABLE` leads to the full-page "Esa franja acaba de ser reservada" screen, which keeps the court and date. Every create request sends an `Idempotency-Key` (PRs #9, #10).
- HU-RES-002 (business rule): reservations cannot start before the current minute in America/Bogota; the mock answers `422 BUSINESS_RULE_VIOLATION` (PR #8). This minute-level rule is not yet written in HU-RES-002 nor in `reservation-service.yaml`; the PR asks the Product Owner to add it.
- HU-RES-004 AC1/AC3: a found code opens the detail page; a 404 and a malformed code show the same "not found" message (PR #10).
- HU-ADM-001 AC1/AC2: without a session, every `/admin` route redirects to the login (PR #10). Real enforcement belongs to the gateway and services.
- HU-PAY-006 AC1/AC2/AC3, in the browser mock only (PR #14): with the injected fault, checkout waits the 3 s Wompi timeout and answers `503 SERVICE_UNAVAILABLE`; after 3 failures the circuit opens and checkouts fail at once (AC1); once Wompi is back and the 10 s open interval expires, checkout works again (AC2); availability and reservation creation keep answering while the circuit is open (AC3). The reservation stays PENDING and the customer can retry or cancel it, which frees the slot. The real circuit breaker belongs to `payment-service`, which has no code.

## 2. My individual contribution
- ftx-front, four PRs to `develop` that replace the earlier branches `hu-front-tests-dev` and `hu-res-002-dev` (deleted from the remote on 2026-10-14). Commits re-applied with `git cherry-pick -x`:
  - PR #7 `chore/hu-res-002-test-setup`: Vitest 3, Testing Library, jsdom and `npm test` (`c6484c2`), and the removal of the dependencies used only by contract tests (`d8eb548`).
  - PR #8 `feat/hu-res-002-past-start-time`: past-start-time rule in the UI and the mock, with 23 tests (`90d79a2`, from `7aba700`).
  - PR #9 `chore/hu-res-002-tests-api-clients`: 20 unit tests for the API clients and `ErrorResponse` handling (`ccdfc75`).
  - PR #10 `chore/hu-res-002-tests-components`: 13 component tests (`3b52262`), and booking tests that use a future date relative to today (`6f6347f`).
  - Verified locally: `typecheck`, `build` and `npm test` pass on each branch; all four combined run 9 test files and 56 tests.
  - PR #6 `chore/enable-fourth-court-mock`: Cancha 4 starts as ACTIVE in the mock (`4f761bc`).
  - HU-PAY-006 and related changes. I first opened them as PR #11 and PR #12 and closed both the same day, because they broke `git-conventions.md`: scopes `api`, `ui`, `mock`, `booking` and empty instead of `web`; PR #11 mixed the story with two unrelated changes and was branched from #10 without needing it. Replaced by four PRs with new `feat(web)`/`chore(web)`/`docs(web)` commits (no published commit was rewritten):
    - PR #14 `feat/hu-pay-006-wompi-unavailable` (HU-PAY-006, branched from #9 because the tests need Vitest from #7 and `src/test/http.ts` from #9): request timeout (`41c5773`), Wompi outage and circuit breaker in the mock (`a51da6d`), degraded payment screen with retry and cancel (`65763b3`), README and `.env.example` (`6f673ff`). Before each commit: `typecheck` and `build` OK, and `vitest` with 22, 34, 40 and 40 tests passing. 20 of those tests are new; 200 added lines of source code without tests. By hand in `npm run dev` (on the first version, same code): retries took about 3.3 s, 3.3 s and then 0.26 s with the circuit open; the cancelled reservation freed its slot; after resetting the fault, checkout reached `/mock/wompi` again. Re-checked on this branch: the fault shows the degraded screen with the reservation pending.
    - PR #13 `chore/mock-admin-credentials-env` (from `develop`): mock admin credentials read from `VITE_MOCK_ADMIN_*` (`20c0ee3`). `typecheck` and `build` OK, 0 occurrences of the credentials in `dist/`, login checked in the browser with and without the variables.
    - PR #15 `feat/web-error-boundary` (branched from #7): error boundary (`4b8e3e2`), 2 tests passing.
    - PR #16 `chore/changelog-release-2-0-0` (from `develop`): first `CHANGELOG.md` of ftx-front (`216fcf6`). It notes that no `v2.0.0` tag exists and that `package.json` still says `0.1.0`, left to the release owner.
    - No work lost: merging #13, #14 and #15 gives the same `src/` as the tip of #11, except the #10 tests, which stay in #10.
- ftx-docs:
  - Pushed `hu-arc-001-dev` (HU-ARC-001: ADR-009, ADR-010, CHANGELOG 2.0.0, MVP 2 demo script). It reached `main` as PR #40, merged from my account ten seconds after it was opened and without the approval of ariel5253 that `branching-policy.md` requires.
  - Corrected it with PR #41 (`hotfix/revert-pr-40`, `ffa817c`), which restores `main`, and PR #42 (`feat/hu-arc-001-adr-009-010`, the same 7 commits re-applied with `cherry-pick -x`).
  - PR #43: published unchanged the Week 08 planning artifacts written on 2026-09-23 (`c6bb07a`, `cf57fc8`, `d6ec6dc`, `473cd7a`).
  - PR #44: Board URL of `agile-conventions.md` set to the team project #20 (`cfb7696`).
  - I added two commits to PR #42 that belonged to another topic, one of them with the wrong scope `docs(demo)` (`9835ec2`). I closed PR #42 and split it: PR #45 `docs/hu-arc-001-adr-009-010` reuses the revert and the 7 HU-ARC-001 commits as they are, plus `257af43`, which marks ADR-003 to ADR-007 as Accepted after PRs #37 and #38 were merged on 2026-10-14. PR #46 `docs/demo-part-3-infra-rename` (after #45) has Part 3 of the demo script (`26a6cd3`, re-done with `docs(docs)`) and the `ftx-infra-postgres` rename (`0e8df6c`, `cherry-pick -x` of `44dde55`). Checked: no "pending merge" reference left, every relative link resolves, and the only differences from the tip of #42 are the #37/#38 update and the new ftx-front PR numbers. Merge order: #41, #45, #46; all waiting for ariel5253.
  - Comment on PR #38 (Dannamo34): ADR-009 and ADR-010 referenced ADR-005, 006 and 007 as pending merge. #38 was merged on 2026-10-14.
- ftx-schedules-db: closed my PR #1 as superseded by HU-ADM-001 (v2.0.0), whose README credits that branch.
- This fork: weekly reports for weeks 06 to 11 updated with verifiable evidence.
- Week 11 workshop, delivery 1 (2026-10-20, in class), in `11-week/workshop/`, one push per checkpoint:
  - CP0 `README.md` with the CONFIG block and the link to my reflection document.
  - CP1 `01-journey.md`: hop table, Mermaid sequence with `traceparent` on every arrow and span tree for `POST /api/v1/reservations` (api-gateway, reservation-service, court-service, outbox, RabbitMQ `futbolix.events`, payment-service).
  - CP2 `02-log-contract.md`: JSON log fields, domain fields, never-log list and seven example lines of one failed request.
  - CP3 `03-instrumentation/`: `reservation-service` module in Node.js without dependencies (trace-context middleware, structured logger, propagation to court-service, `/metrics`). `npm test`: 3 tests, 3 passing; the propagation test fails when the outgoing `traceparent` is removed. Not in Java/Spring: no JDK, Maven or WSL on my machine.
  - CP4 `04-metrics.md`: golden signals per service, label cardinality, histogram buckets.
  - Before the workshop I merged `upstream/main` into this fork (`f4ff09a`), keeping my own `01-week/hu-status` files.

### Contribution to MVP 2 / v2.0.0
| Area | This week |
|---|---|
| Contracts (OpenAPI / events) | Contract tests against the ftx-docs OpenAPI contracts exist locally but are not published: ftx-docs is private and ftx-front is public, and the Tech Lead and the instructor have been asked whether the contracts may be copied there |
| Saga / Outbox | ADR-010 recommends a choreographed saga (Proposed, not implemented). Outbox: ADR-006 (Dannamo34, Accepted on 2026-10-14) adopts it; not implemented. Resilience shown in the frontend mock only: circuit breaker and client-side compensation (cancel the PENDING reservation), PR #14 |
| Per-environment config | `VITE_API_TIMEOUT_MS` and `VITE_MOCK_FAULTS` (PR #14), `VITE_MOCK_ADMIN_EMAIL` and `VITE_MOCK_ADMIN_PASSWORD` (PR #13) in ftx-front `.env.example` |
| ADR | ADR-009 and ADR-010, Proposed and not implemented (PR #45) |
| CHANGELOG | ftx-docs `CHANGELOG.md` `[2.0.0] - Unreleased` with "Not included in this release" (PR #45). ftx-front `CHANGELOG.md` with `[2.0.0] - Unreleased` (content of `release/2.0.0`) and the open PRs under `[Unreleased]` (PR #16) |
| Tests (code quality) | First test suite of ftx-front in PRs #7 to #10 (56 tests combined), plus 20 tests for HU-PAY-006 in PR #14 and 2 for the error boundary in PR #15 |
| Demo | Part 3 of the MVP 2 demo script (injected failure) written against ftx-front PR #14 (ftx-docs PR #46) |

### Commits (author soymiguelgomez, 2026-10-12 to 2026-10-20)
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
| ftx-front | `55604a5`, `4663914`, `d82b206`, `1ad0e71`, `5eaa3a2`, `5d6da8d` | 2026-10-14 07:31 | wrong scopes: feat(api), feat(ui), chore(mock), feat(mock), feat(booking), docs | `feat/hu-pay-006-payment-degradation` - PR #11 (closed, replaced) |
| ftx-front | `3115c90` | 2026-10-14 07:41 | docs: add a changelog for release 2.0.0 (no scope) | `chore/changelog-2-0-0` - PR #12 (closed, replaced) |
| ftx-docs | `9835ec2` | 2026-10-14 07:32 | docs(demo): describe part 3 (wrong scope) | `feat/hu-arc-001-adr-009-010` - PR #42 (closed, replaced) |
| ftx-docs | `44dde55` | 2026-10-14 07:39 | docs(docs): use the ftx-infra-postgres name and its v1.0.0 release | `feat/hu-arc-001-adr-009-010` - PR #42 (closed, replaced) |
| ftx-front | `20c0ee3` | 2026-10-14 07:57 | chore(web): read the simulated admin credentials from env variables | `chore/mock-admin-credentials-env` - PR #13 |
| ftx-front | `41c5773` | 2026-10-14 08:05 | feat(web): stop waiting for the gateway after a request timeout | `feat/hu-pay-006-wompi-unavailable` - PR #14 |
| ftx-front | `a51da6d` | 2026-10-14 08:06 | feat(web): simulate a wompi outage with a circuit breaker in the mock | `feat/hu-pay-006-wompi-unavailable` - PR #14 |
| ftx-front | `65763b3` | 2026-10-14 08:06 | feat(web): show a degraded payment screen when wompi is unavailable | `feat/hu-pay-006-wompi-unavailable` - PR #14 |
| ftx-front | `6f673ff` | 2026-10-14 08:07 | docs(web): document the injected wompi failure and its env variables | `feat/hu-pay-006-wompi-unavailable` - PR #14 |
| ftx-front | `4b8e3e2` | 2026-10-14 08:08 | feat(web): add an error boundary around the app | `feat/web-error-boundary` - PR #15 |
| ftx-front | `216fcf6` | 2026-10-14 08:09 | docs(web): add a changelog for release 2.0.0 | `chore/changelog-release-2-0-0` - PR #16 |
| ftx-front | `7c6406f` | 2026-10-14 15:09 | docs(web): list the pull requests merged into develop in the changelog | `chore/changelog-release-2-0-0` - PR #16 |
| ftx-docs | `257af43` | 2026-10-14 14:18 | docs(docs): reference adr-003 to adr-007 as accepted after prs #37 and #38 | `docs/hu-arc-001-adr-009-010` - PR #45 |
| ftx-docs | `26a6cd3` | 2026-10-14 14:18 | docs(docs): describe part 3 of the demo, injected wompi failure in the frontend mock | `docs/demo-part-3-infra-rename` - PR #46 |
| ftx-docs | `0e8df6c` | 2026-10-14 14:18 | docs(docs): use the ftx-infra-postgres name and its v1.0.0 release (`cherry-pick -x` of `44dde55`) | `docs/demo-part-3-infra-rename` - PR #46 |
| fork | `71a2246`, `919380c`, `b7fa855`, `2963b24`, `4fcd365`, `56e4925`, `6edc736`, `1cb58c8` | 2026-10-13 20:23 to 2026-10-14 07:42 | docs(hu-status): weekly reports | `main` of this fork |
| fork | `f4ff09a` | 2026-10-20 18:57 | chore(sync): merge upstream main into fork | `main` of this fork |
| fork | `ee1dbef` | 2026-10-20 19:02 | docs(w11): start observability workshop | `main` - CP0 |
| fork | `af73cd9` | 2026-10-20 19:09 | docs(w11): map critical journey and trace propagation | `main` - CP1 |
| fork | `f9c4eb1` | 2026-10-20 19:18 | docs(w11): define structured log contract | `main` - CP2 |
| fork | `b005df2` | 2026-10-20 19:24 | feat(w11): add trace-context middleware and structured logger | `main` - CP3, push 1 |
| fork | `6d4cf5a`, `b705c23`, `272a6b8`, `88bdbfd` | 2026-10-20 19:30 | feat(w11): add court-service client and request metrics; feat(w11): propagate context downstream and expose metrics; test(w11): prove trace_id propagation to court-service; docs(w11): add how-to-run with real console output | `main` - CP3, push 2 |
| fork | `8f9206a` | 2026-10-20 19:31 | docs(w11): define golden signals and metric catalog | `main` - CP4 |

Commit dates are the commit (re-application) dates; the original author dates of the cherry-picked commits are kept in each commit.

### Pull requests and flow
| Stage | Branch -> target | Status |
|---|---|---|
| dev | ftx-front #7, #9, #14 -> `develop` | **Merged** on 2026-10-14 by HERMAR55611, approved by HERMAR55611 and ariel5253 |
| dev | ftx-front #6, #8, #10, #13, #16 -> `develop` | Approved by ariel5253, review from HERMAR55611 pending; no conflicts with the new `develop` (checked with `git merge-tree`) |
| dev | ftx-front #15 -> `develop` | Approved by ariel5253; HERMAR55611 commented "LGTM. Error boundary reviewed by tech lead"; not merged |
| dev | ftx-front #11 and #12 -> `develop` | Closed on 2026-10-14 with a comment linking their replacements |
| qa | `hu-front-qa` -> `qa` (ftx-front #3) | Merged on 2026-10-13 by emelendez20201-ship-it with my Week 10 commits re-applied by `cherry-pick -x`. This week's commits are not in `qa` yet |
| main | ftx-front #5 `release/2.0.0` -> `main` (emelendez20201-ship-it) | Approved by ariel5253, not merged; it does not include this week's PRs. No `v2.0.0` tag in ftx-front |
| main (docs) | ftx-docs #41, then #45, then #46; also #43 and #44 -> `main` | Approved by ariel5253 on 2026-10-14, not merged yet. #42 closed on 2026-10-14, replaced by #45 and #46 |

## 3. Blockers and risks
- PR #40 in ftx-docs was merged into `main` from my account without review; `main` of ftx-docs has no branch protection (private repository; the protection API answers 403 on this plan). Correction in PRs #41 and #45.
- In the Week 08 files HU-ARC-001 means "ADR-005, ADR-006, ADR-007", while PR #45 uses it for "Record ADR-009 and ADR-010". The Product Owner must choose the IDs.
- PR #46 is stacked on #45 because it edits files that #45 creates; it must be merged after #41 and #45. (#14 and #15 were stacked on #7/#9; #7, #9 and #14 are now merged.)
- The ADR register of ftx-docs still lists ADR-003 to ADR-007 as not filed or pending, although #37 and #38 added them as Accepted (not changed by me; noted in the changelog of #45).
- `npm audit` reports advisories in Vitest 3's dev-only dependencies (`tinypool`, `@vitest/mocker`); the full fix needs Vitest 4.
- HU-PAY-006 is shown only in the browser mock: there is no `payment-service` (no repository and no code), so the real circuit breaker, the saga and the outbox are not implemented in any repository.
- Docker is not installed on my machine: the nginx image and Part 1 of the demo script have not been run.

## 4. Plan for next week
- Get the approved PRs merged (ftx-front #6, #8, #10, #13, #15, #16; ftx-docs #41, #45, #46, #43, #44) and promote the frontend changes to `qa` with `cherry-pick -x`.
- Get an answer on the contract copies (Tech Lead and instructor) and, if allowed, open the contract-tests PR.
- Rehearse Part 3 of the demo script (injected Wompi failure) with the team.
- Configure weekly Sprint iterations in the team board (Project #20) with the team.

## 5. Compliance self-check
- [x] Conventional Commits - `type(scope): summary`
- [ ] Per-environment HU branch + PR to that environment (hu-xxx-dev -> develop, ...)
- [x] Testable acceptance criteria
- [x] Tests added/updated (unit / integration)
- [ ] DDD / hexagonal boundaries respected (domain has no I/O)
- [x] No secrets; config via environment variables

## 6. Evidence links
- ftx-front PRs: https://github.com/code-corhuila/ftx-front/pull/6, https://github.com/code-corhuila/ftx-front/pull/7, https://github.com/code-corhuila/ftx-front/pull/8, https://github.com/code-corhuila/ftx-front/pull/9, https://github.com/code-corhuila/ftx-front/pull/10, https://github.com/code-corhuila/ftx-front/pull/13, https://github.com/code-corhuila/ftx-front/pull/14, https://github.com/code-corhuila/ftx-front/pull/15, https://github.com/code-corhuila/ftx-front/pull/16
- ftx-front PRs closed and replaced: https://github.com/code-corhuila/ftx-front/pull/11#issuecomment-6169135416, https://github.com/code-corhuila/ftx-front/pull/12#issuecomment-6169136617
- ftx-docs PRs: https://github.com/code-corhuila/ftx-docs/pull/40 (merged without review), https://github.com/code-corhuila/ftx-docs/pull/41, https://github.com/code-corhuila/ftx-docs/pull/43, https://github.com/code-corhuila/ftx-docs/pull/44, https://github.com/code-corhuila/ftx-docs/pull/45, https://github.com/code-corhuila/ftx-docs/pull/46
- ftx-docs PR closed and replaced: https://github.com/code-corhuila/ftx-docs/pull/42#issuecomment-6176409332
- Comment on ftx-docs PR #38: https://github.com/code-corhuila/ftx-docs/pull/38#issuecomment-6160545907
- Comment on ftx-front PR #5: https://github.com/code-corhuila/ftx-front/pull/5#issuecomment-6160546246
- ftx-schedules-db PR #1 (closed as superseded): https://github.com/code-corhuila/ftx-schedules-db/pull/1
- qa promotion of the Week 10 work: https://github.com/code-corhuila/ftx-front/pull/3
- Week 11 workshop folder: https://github.com/soymiguelgomez/sistemas-distribuidos-2026-b-g1/tree/main/11-week/workshop
- Week 11 workshop commits: https://github.com/soymiguelgomez/sistemas-distribuidos-2026-b-g1/commit/ee1dbef8ed4673a239cce8351ad739d343def328, https://github.com/soymiguelgomez/sistemas-distribuidos-2026-b-g1/commit/af73cd962f6b614d2a25ea1d8500cd428af16209, https://github.com/soymiguelgomez/sistemas-distribuidos-2026-b-g1/commit/f9c4eb1d9bbe0e4f99baadcd456bad8461a9eba8, https://github.com/soymiguelgomez/sistemas-distribuidos-2026-b-g1/commit/b005df2846b4d01d676b3872b00ec90d133a9626, https://github.com/soymiguelgomez/sistemas-distribuidos-2026-b-g1/commit/b705c234ca0b4a9ca6c32bcb93f8fd3f1d06984a, https://github.com/soymiguelgomez/sistemas-distribuidos-2026-b-g1/commit/272a6b8f20142999ac5d350bd07dffc27979fac1, https://github.com/soymiguelgomez/sistemas-distribuidos-2026-b-g1/commit/8f9206a0417a4439c3ad77436a3493230df2f413
- Self-check notes: every commit in the open PRs uses `type(scope): summary` with the scopes of `git-conventions.md` (`web` in ftx-front, `docs` in ftx-docs). Eight commits of this week used wrong or empty scopes; their PRs (#11, #12, #42) were closed and replaced with new commits, without rewriting history. The ftx-front branches use `feat/` and `chore/` children of `develop`, allowed by `branching-policy.md`, not `hu-xxx-dev`. The stories have Given/When/Then criteria. Tests were added in PRs #7 to #10, #14 and #15, and run before each new commit. The frontend has no DDD domain layer to evaluate. Configuration comes from `VITE_*` variables; with PR #13 the mock-only demo login is read from `VITE_MOCK_ADMIN_*` and is not in the production bundle.
