<!-- HU-STATUS TEMPLATE - do NOT remove the <!-- ... --> markers or the table headers.
     Your weekly grade is read AUTOMATICALLY from this file:
       09-week/hu-status/README.md  (inside YOUR fork). English. -->

# Weekly Status - Week 09

<!-- CONFIG-START - must match your profile repo (username/username) CONFIG -->
- FULL_NAME: Miguel Andres Gomez Gutierrez
- GITHUB_USER: soymiguelgomez
- TEAM: Futbolix
- SPRINT_GOAL: Align the architecture overview with the API contracts, merge the pending 10-devops documentation PRs, and add the schedules schema, seed and checks to ftx-schedules-db
<!-- CONFIG-END -->

## 1. User stories worked this week
| HU ID | Title | Status (todo/doing/done) | Evidence (PR or commit URL) |
|---|---|---|---|
| N/A (no HU ID) | ftx-schedules-db: schedules table, seed of 4 courts x 7 days and post-migration checks | doing | https://github.com/code-corhuila/ftx-schedules-db/pull/1 |
| N/A (no HU ID) | Align `05-architecture/overview.md` error format and health checks with the API contracts | done | https://github.com/code-corhuila/ftx-docs/pull/33 |
| N/A (no HU ID) | Remove the trailing blank line in `05-architecture/overview.md` (review finding 3) | doing | https://github.com/code-corhuila/ftx-docs/pull/35 |
| N/A (no HU ID) | Merge my 10-devops PRs from Week 07 (`environments.md`, `README.md`) | done | https://github.com/code-corhuila/ftx-docs/pull/15 |

### Acceptance criteria met
- None of this week's commits or PRs references a user story, so there are no Given/When/Then criteria to report. ftx-schedules-db PR #1 is titled "hu-001-dev", which is not an HU ID of the backlog.
- What PR #33 verifiably achieves: the error format in `overview.md` now matches `ErrorResponse` in `_shared.yaml` (`error`, `message`, `details`, `traceId`), and the health checks use `/health` and `/health/readiness`, the paths in the OpenAPI contracts.
- What ftx-schedules-db PR #1 contains at the end of the week (not merged): `schedules` table with day, hour-order and whole-hour checks, one schedule per court and day, an `updated_at` trigger, no foreign key to the courts database, a seed of 4 courts x 7 days (06:00-22:00) and `tests/verify.sql` with 8 checks.

## 2. My individual contribution
- ftx-schedules-db, branch `chore/schedules-db-baseline` (PR #1 to `develop`):
  - `dc77768`: added `V001__create_schedules_table.sql`, `V002__seed_court_schedules.sql`, `migrations.yml` and `verify.sql` at the repository root.
  - `3aab189` to `a5b836a`, `e6ef2ac`, `3f2768e`, `ffa4bcd`: moved the files into `db/migration/` and `tests/` through the GitHub web editor (delete and upload). The CI file `migrations.yml` was deleted (`f3e0723`) and not added again, although the README still describes it.
  - `2ba97bb`: added back `.env.example`, `.gitignore`, `Dockerfile` and `docker-compose.yml`, and updated the `Dockerfile` and README.
- ftx-docs:
  - `edb161b`: aligned `05-architecture/overview.md` with the API contracts (error format and health-check paths). PR #33, which I merged into `main` on 2026-09-29.
  - Merged three PRs into `main` on 2026-09-29: #33 (`7883a73`), #15 (`50ecaa9`, `environments.md` from Week 07) and #17 (`c0e9d23`, `10-devops/README.md` from Week 07).
  - `7a7ef6f`: created a revert of PR #33 on branch `revert-33-docs/product-backlog-architecture-ux`. No PR was opened for it, so the PR #33 change is still in `main`.
  - `5adf903`: removed the stray trailing blank line at the end of `overview.md` (review finding 3, no content change). PR #35, not merged.

### Contribution to MVP 2 / v2.0.0
| Area | This week |
|---|---|
| Contracts (OpenAPI / events) | Yes: the architecture overview now follows the `ErrorResponse` schema and the health paths of the OpenAPI contracts (PR #33) |
| Saga / Outbox | None |
| Per-environment config | Merged PR #15 (`10-devops/environments.md`, written in Week 07) into `main`. ftx-schedules-db: database settings from `.env`, placeholders in `.env.example` |
| ADR | None |
| CHANGELOG | None (no CHANGELOG file existed in ftx-docs or ftx-front) |
| Database | ftx-schedules-db schema, seed and checks on PR #1 (not merged). HERMAR55611 later adapted this design and merged it as HU-ADM-001, released as `v2.0.0` on 2026-10-13; the README on `main` credits this branch |

### Commits (author soymiguelgomez, 2026-09-28 to 2026-10-04)
| Repo | Hash | Date | Message | Branch / PR |
|---|---|---|---|---|
| ftx-schedules-db | `dc77768` | 2026-09-28 08:43 | feat(schedules): add schema, seed, verify | `chore/schedules-db-baseline` - PR #1 |
| ftx-schedules-db | `3aab189` | 2026-09-28 09:03 | Delete verify.sql | `chore/schedules-db-baseline` - PR #1 |
| ftx-schedules-db | `f3e0723` | 2026-09-28 09:04 | Delete migrations.yml | `chore/schedules-db-baseline` - PR #1 |
| ftx-schedules-db | `a4a5f14` | 2026-09-28 09:04 | Delete V002__seed_court_schedules.sql | `chore/schedules-db-baseline` - PR #1 |
| ftx-schedules-db | `24a066c` | 2026-09-28 09:04 | Delete V001__create_schedules_table.sql | `chore/schedules-db-baseline` - PR #1 |
| ftx-schedules-db | `596634b` | 2026-09-28 09:04 | Delete docker-compose.yml | `chore/schedules-db-baseline` - PR #1 |
| ftx-schedules-db | `2130608` | 2026-09-28 09:04 | Delete Dockerfile | `chore/schedules-db-baseline` - PR #1 |
| ftx-schedules-db | `79bacd2` | 2026-09-28 09:04 | Delete .gitignore | `chore/schedules-db-baseline` - PR #1 |
| ftx-schedules-db | `a5b836a` | 2026-09-28 09:04 | Delete .env.example | `chore/schedules-db-baseline` - PR #1 |
| ftx-schedules-db | `2ba97bb` | 2026-09-28 09:09 | fix(schedules-db): align schema with documented | `chore/schedules-db-baseline` - PR #1 |
| ftx-schedules-db | `e6ef2ac` | 2026-09-28 09:10 | Create db | `chore/schedules-db-baseline` - PR #1 |
| ftx-schedules-db | `3f2768e` | 2026-09-28 09:10 | Delete db | `chore/schedules-db-baseline` - PR #1 |
| ftx-schedules-db | `ffa4bcd` | 2026-09-28 09:12 | Add files via upload | `chore/schedules-db-baseline` - PR #1 |
| ftx-docs | `edb161b` | 2026-09-28 10:44 | docs: align error format and health checks with api contracts | `docs/product-backlog-architecture-ux` - PR #33 |
| ftx-docs | `7883a73` | 2026-09-29 19:08 | Merge pull request #33 from code-corhuila/docs/product-backlog-architecture-ux | merge into `main` |
| ftx-docs | `50ecaa9` | 2026-09-29 19:09 | Merge pull request #15 from code-corhuila/docs/update-10-environments.md | merge into `main` |
| ftx-docs | `c0e9d23` | 2026-09-29 19:09 | Merge pull request #17 from code-corhuila/docs/update-10-readme | merge into `main` |
| ftx-docs | `7a7ef6f` | 2026-09-29 19:15 | Revert "docs: align error format and health checks with api contracts" | `revert-33-docs/product-backlog-architecture-ux` - no PR |
| ftx-docs | `5adf903` | 2026-09-29 19:19 | docs: remove trailing blank line in architecture | `docs/overview-trailing-line` - PR #35 |
| ftx-front | - | - | No commits this week | - |
| fork | - | - | No commits this week | - |

### Pull requests and flow
| PR | Branch -> target | Merged | Merge commit |
|---|---|---|---|
| ftx-schedules-db #1 (opened in Week 08) | `chore/schedules-db-baseline` -> `develop` | No, still open on 2026-10-14; approved by ariel5253 on 2026-09-28 at 08:52 and 09:29; it now conflicts with `develop` | - |
| ftx-docs #33 | `docs/product-backlog-architecture-ux` -> `main` | 2026-09-29, by soymiguelgomez; approved by ariel5253 on 2026-09-28 10:51 | `7883a73` |
| ftx-docs #15 | `docs/update-10-environments.md` -> `main` | 2026-09-29, by soymiguelgomez; approved by ariel5253 on 2026-09-19 13:08 | `50ecaa9` |
| ftx-docs #17 | `docs/update-10-readme` -> `main` | 2026-09-29, by soymiguelgomez; approved by ariel5253 on 2026-09-19 20:26 | `c0e9d23` |
| ftx-docs #35 | `docs/overview-trailing-line` -> `main` | Not merged as of 2026-10-14; approved by ariel5253 on 2026-09-29 20:47 | - |
| (none) | `revert-33-docs/product-backlog-architecture-ux` | No PR opened | - |

- ftx-docs: the flow `hu-xxx-dev -> develop -> qa -> main` does **not apply**. Per `00-governance/branching-policy.md`, the documentation repository only has `main`, fed by a child branch and a PR.
- ftx-schedules-db: PR #1 targets `develop` from a `chore/` branch, not from a `hu-xxx-dev` branch, and was never promoted to `qa` or `main`.

## 3. Blockers and risks
- 11 of the 13 ftx-schedules-db commits come from the GitHub web editor ("Delete ...", "Create db", "Add files via upload") and do not follow Conventional Commits.
- ftx-schedules-db: the README of the branch describes `.github/workflows/migrations.yml`, but that file was deleted and not added again, so the checks do not run in CI.
- PR #35 is not merged; `overview.md` on `main` still ends with the trailing blank line.
- The revert branch for PR #33 was left without a PR. It should be deleted, or a PR opened if the change really has to be undone.
- I merged PRs #33, #15 and #17 myself, after each one was approved by ariel5253, as `branching-policy.md` requires for `main` (links in section 6). PR #35 is approved but still not merged.

## 4. Plan for next week
- Week 10 (as executed, see `10-week/hu-status`): build the React + Vite web frontend in ftx-front against the ftx-docs OpenAPI contracts and open the PR to `develop`.

## 5. Compliance self-check
- [ ] Conventional Commits - `type(scope): summary`
- [ ] Per-environment HU branch + PR to that environment (hu-xxx-dev -> develop, ...)
- [ ] Testable acceptance criteria
- [x] Tests added/updated (unit / integration)
- [ ] DDD / hexagonal boundaries respected (domain has no I/O)
- [x] No secrets; config via environment variables

## 6. Evidence links
- ftx-schedules-db PR #1: https://github.com/code-corhuila/ftx-schedules-db/pull/1
- ftx-schedules-db schema and checks: https://github.com/code-corhuila/ftx-schedules-db/commit/dc77768c22b46523fdb46dceaba3a434b985132f, https://github.com/code-corhuila/ftx-schedules-db/commit/ffa4bcdeeaae260cd5e222a1789c77c50e33e7cf
- PR #33: https://github.com/code-corhuila/ftx-docs/pull/33 - commit https://github.com/code-corhuila/ftx-docs/commit/edb161ba691ec215da08a6618954c9f86f944cfb
- PR #15 merge: https://github.com/code-corhuila/ftx-docs/commit/50ecaa926e672d5432cb8eb9928079238a0c3a43
- PR #17 merge: https://github.com/code-corhuila/ftx-docs/commit/c0e9d231be5a88bc9173c5ecde62e750c2c056e7
- PR #35: https://github.com/code-corhuila/ftx-docs/pull/35 - commit https://github.com/code-corhuila/ftx-docs/commit/5adf9035127e99af3d2f042790e1a2a819a40e30
- Revert commit (no PR): https://github.com/code-corhuila/ftx-docs/commit/7a7ef6f10da3bdc004f7713f1858ebfd377f29a4
- Approvals by ariel5253: https://github.com/code-corhuila/ftx-docs/pull/33#pullrequestreview-5341228766, https://github.com/code-corhuila/ftx-docs/pull/35#pullrequestreview-5360538049, https://github.com/code-corhuila/ftx-schedules-db/pull/1#pullrequestreview-5340138792
- Credit on ftx-schedules-db `main` (README, "Credits": "The table design, the court-id contract and the first checks come from the baseline branch `chore/schedules-db-baseline` by Miguel Gómez."): https://github.com/code-corhuila/ftx-schedules-db/blob/main/README.md
- Self-check notes: the ftx-docs commits follow `type: summary`, but 11 of the 13 ftx-schedules-db commits do not. The branches are `docs/...` and `chore/...`, not HU branches. No user story is involved. Tests: `tests/verify.sql` holds 8 SQL post-migration checks, although the CI file that ran them was deleted. There is no application code, so DDD does not apply. ftx-schedules-db reads its database settings from `.env`, with placeholders in `.env.example`.
