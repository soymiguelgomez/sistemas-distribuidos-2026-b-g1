<!-- HU-STATUS TEMPLATE - do NOT remove the <!-- ... --> markers or the table headers.
     Your weekly grade is read AUTOMATICALLY from this file:
       10-week/hu-status/README.md  (inside YOUR fork). English. -->

# Weekly Status - Week 10

<!-- CONFIG-START - must match your profile repo (username/username) CONFIG -->
- FULL_NAME: Miguel Andres Gomez Gutierrez
- GITHUB_USER: soymiguelgomez
- TEAM: Futbolix
- SPRINT_GOAL: Deliver the Futbolix web frontend (React + Vite) wired to the API Gateway contracts, merged into ftx-front develop
<!-- CONFIG-END -->

## 1. User stories worked this week
| HU ID | Title | Status (todo/doing/done) | Evidence (PR or commit URL) |
|---|---|---|---|
| HU-RES-001 | View Field Availability - frontend | doing | https://github.com/code-corhuila/ftx-front/pull/1 |
| HU-RES-002 | Create Field Reservation - frontend | doing | https://github.com/code-corhuila/ftx-front/pull/1 |
| HU-PAY-003 | Start the Wompi Sandbox checkout - frontend redirect | doing | https://github.com/code-corhuila/ftx-front/pull/1 |
| HU-RES-004 | Look Up Reservation - frontend | doing | https://github.com/code-corhuila/ftx-front/pull/1 |
| HU-RES-003 | Cancel Reservation by code - frontend | doing | https://github.com/code-corhuila/ftx-front/pull/1 |
| HU-ADM-001 | Manage Courts, Schedules, Prices, and Status - admin panel | doing | https://github.com/code-corhuila/ftx-front/pull/1 |

All rows are "doing": the screens are merged into `develop`, but they have only run against the browser-side mock (`VITE_API_MOCK=true`), not against the real services, and they have not been promoted to `qa` or `main`.

### Acceptance criteria met
Criteria from `ftx-docs/04-requirements/user-stories.md`. The services own these rules; the frontend covers its side of each one. Each item has been checked against the mock only.
- HU-RES-001: AC1 lists the configured courts; AC2 shows the whole-hour slots for the chosen court and date; AC4 shows "No hay franjas disponibles para esta fecha". AC3 (exclude occupied slots) depends on reservation-service: the UI only shows the slots the API returns.
- HU-RES-002: AC2 collects name, email and phone; AC3/AC4 show the `409 RESERVATION_SLOT_UNAVAILABLE` error; AC5 shows the reservation code with a copy button (`ReservationCodeBlock`). AC1 (PENDING status) is the service's responsibility.
- HU-PAY-003 (story definition not in ftx-docs; covered by the `payment-service.yaml` contract): `/booking/payment` starts the checkout and redirects to Wompi, accepting only a safe redirect URL.
- HU-RES-004: AC1 finds a reservation by code; AC2 shows its status; AC3 shows a "not found" message on 404.
- HU-RES-003: AC1 cancels by code from `/reservations/:code`; AC3 shows `409 RESERVATION_NOT_CANCELLABLE`. AC2 (release the slot) and AC4 (keep history) are the service's responsibility.
- HU-ADM-001: AC1/AC2 send every `/admin` route without a session to the login page (`RequireAdmin`) and renew the JWT with the refresh token. Real access control must still be enforced by the gateway and services. AC3/AC5/AC6 are covered by the court form (name, capacity, hourly price, status transitions) and AC4 by the schedules page.

## 2. My individual contribution
- `e419ef1` `feat(web)`: React 19 + Vite 6 + TypeScript frontend that implements the `ftx-docs/12-ux-ui/navigation-map.md` screens against the `ftx-docs/07-api` OpenAPI contracts. It covers the public booking flow with the Wompi redirect, reservation lookup and cancellation by code, the admin panel (courts, schedules, reservations) with JWT refresh, a browser-side mock of the gateway, an nginx `Dockerfile` for qa/prod, and a README that points to ftx-docs instead of the LMS Library scaffold.
- `c6d5085` `fix(web)`: `ScrollToTop` returned the result of `window.scrollTo` from an effect, so React treated it as a cleanup function and the page went blank on the first navigation.
- `2b900a7` `chore(web)`: `package-lock.json`, so local installs, CI and the Docker build (`npm ci`) resolve the same versions.
- Opened PR #1 `feat/web-frontend` -> `develop` and merged it on 2026-10-05 (`d2a26fc`).

### Contribution to MVP 2 / v2.0.0
| Area | This week |
|---|---|
| Contracts (OpenAPI / events) | Consumer of the contracts: `src/api/types.ts` and the API clients follow `07-api` (base path `/api/v1`, `ErrorResponse` codes, `Idempotency-Key` for checkout) |
| Saga / Outbox | None in code. The confirmation page handles the payment saga's eventual consistency: it shows "Confirmando tu pago..." while the reservation is still PENDING |
| Per-environment config | Yes: `VITE_API_BASE_URL` (local/develop `:8080`, qa `:8180`, prod `:8280`, as in `10-devops/environments.md`) and `VITE_API_MOCK` in `.env.example`; `.env` and `.env.*` are git-ignored; nginx Docker image for qa/prod |
| ADR | None |
| CHANGELOG | None. No CHANGELOG file and no `v2.0.0` tag exist in ftx-front or ftx-docs; `package.json` version is `0.1.0` |

### Commits (author soymiguelgomez, 2026-10-05 to 2026-10-11)
| Repo | Hash | Date | Message | Branch / PR |
|---|---|---|---|---|
| ftx-front | `e419ef1` | 2026-10-05 09:00 | feat(web): add react + vite frontend wired to the api gateway | `feat/web-frontend` - PR #1 |
| ftx-front | `c6d5085` | 2026-10-05 09:07 | fix(web): keep effect callbacks from returning a value | `feat/web-frontend` - PR #1 |
| ftx-front | `2b900a7` | 2026-10-05 09:07 | chore(web): add package-lock.json | `feat/web-frontend` - PR #1 |
| ftx-front | `d2a26fc` | 2026-10-05 09:14 | Merge pull request #1 from code-corhuila/feat/web-frontend | merge into `develop` |
| ftx-docs | - | - | No commits this week | - |
| ftx-schedules-db | - | - | No commits this week | - |
| fork | - | - | No commits this week | - |

### Pull requests and flow
| Stage | Branch -> target | Status | Commit |
|---|---|---|---|
| dev | `feat/web-frontend` -> `develop` (PR #1) | Merged 2026-10-05 by soymiguelgomez | `d2a26fc` |
| qa | `hu-front-qa` -> `qa` (PR #3) | Not in Week 10. On 2026-10-13 (Week 11) emelendez20201-ship-it created `hu-front-qa` from `qa` with my three commits re-applied by `cherry-pick -x` (`6f192fb`, `2c91da1`, `944f75c`) plus PR #2's translation, and merged it into `qa` as PR #3 | `0837657` |
| main | `hu-front-main` -> `main` | Not started; `main` is still the initial seed and ftx-front has no tags (checked on 2026-10-13) | - |

## 3. Blockers and risks
- The frontend has only run against the browser mock; no microservice or API Gateway was available to test against.
- No automated tests: `package.json` only has `typecheck` and `build` (`tsc --noEmit && vite build`).
- The mock contains a demo administrator login (`src/api/mock/constants.ts`). It only works inside the browser mock, but it is a password string in the source.
- PR #1 has no review: I opened it at 09:12 and merged it myself at 09:14 on 2026-10-05. `branching-policy.md` leaves the review rule on `develop` to the team, but no teammate reviewed this change.
- The `develop` branch name for PR #1 is `feat/web-frontend` (allowed for `develop` by `ftx-docs/00-governance/branching-policy.md`), not the `hu-xxx-dev` name used in the course README.

## 4. Plan for next week
- Promote the frontend: `hu-front-qa` -> `qa` (done by emelendez20201-ship-it on 2026-10-13, PR #3), then `hu-front-main` -> `main`.
- Done in Week 11 (see `11-week/hu-status`): `4f761bc` fourth court in the mock (ftx-front PR #6) and the past-start-time rule `7aba700`, re-applied in PR #8; both open.
- Add frontend tests: done in Week 11 in ftx-front PRs #7, #9 and #10 (open, waiting for review).
- Connect the UI to the real API Gateway once the services are deployed in `develop`.

## 5. Compliance self-check
- [x] Conventional Commits - `type(scope): summary`
- [ ] Per-environment HU branch + PR to that environment (hu-xxx-dev -> develop, ...)
- [x] Testable acceptance criteria
- [ ] Tests added/updated (unit / integration)
- [ ] DDD / hexagonal boundaries respected (domain has no I/O)
- [x] No secrets; config via environment variables

## 6. Evidence links
- PR #1: https://github.com/code-corhuila/ftx-front/pull/1
- `e419ef1`: https://github.com/code-corhuila/ftx-front/commit/e419ef15abde1899c03aadd2d9ad62edaae3824b
- `c6d5085`: https://github.com/code-corhuila/ftx-front/commit/c6d5085debdfa6c2e33152096ce5dd1b4ec03e74
- `2b900a7`: https://github.com/code-corhuila/ftx-front/commit/2b900a70feafa943da2e3a0fd2168ac0ae615c61
- Merge into develop: https://github.com/code-corhuila/ftx-front/commit/d2a26fca2ee6eab072fa0c0d4fd2c135eab79823
- qa branch (Week 11): https://github.com/code-corhuila/ftx-front/tree/hu-front-qa
- Promotion to qa (Week 11, by emelendez20201-ship-it): https://github.com/code-corhuila/ftx-front/pull/3 - re-applied commits with the `cherry-pick -x` trail: https://github.com/code-corhuila/ftx-front/commit/6f192fb44591795d299e6a10ebf2f911bd7e080d, https://github.com/code-corhuila/ftx-front/commit/2c91da1783501fc9d697fb9963bba7f735826129, https://github.com/code-corhuila/ftx-front/commit/944f75c3ce65245678ec9df49f4c972f7b1a73ca
- Self-check notes: all three commits use `type(scope): summary`. PR #1 went to `develop` from `feat/web-frontend`, not from a `hu-xxx-dev` branch, and was not promoted to `qa` or `main` this week. The stories have Given/When/Then criteria in `04-requirements/user-stories.md`. There are no tests. The frontend has no DDD domain layer to evaluate. Configuration comes from `VITE_*` environment variables with no real secret; the only credential is the mock-only demo login noted in section 3.
