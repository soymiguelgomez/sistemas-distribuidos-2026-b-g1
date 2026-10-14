<!-- HU-STATUS TEMPLATE - do NOT remove the <!-- ... --> markers or the table headers.
     Your weekly grade is read AUTOMATICALLY from this file:
       07-week/hu-status/README.md  (inside YOUR fork). English. -->

# Weekly Status - Week 07

<!-- CONFIG-START - must match your profile repo (username/username) CONFIG -->
- FULL_NAME: Miguel Andres Gomez Gutierrez
- GITHUB_USER: soymiguelgomez
- TEAM: Futbolix
- SPRINT_GOAL: Document the Futbolix environments (local, develop, qa, prod), local setup and per-environment configuration in ftx-docs/10-devops
<!-- CONFIG-END -->

## 1. User stories worked this week
| HU ID | Title | Status (todo/doing/done) | Evidence (PR or commit URL) |
|---|---|---|---|
| N/A (no HU ID) | 10-devops: deployment environments and per-environment configuration (`environments.md`) | done | https://github.com/code-corhuila/ftx-docs/pull/15 |
| N/A (no HU ID) | 10-devops: local project setup (`local-setup.md`) | done | https://github.com/code-corhuila/ftx-docs/pull/16 |
| N/A (no HU ID) | 10-devops: section README (`README.md`) | done | https://github.com/code-corhuila/ftx-docs/pull/17 |
| N/A (no HU ID) | 10-devops: first rewrite of README, environments and local setup | done | https://github.com/code-corhuila/ftx-docs/pull/6 |

### Acceptance criteria met
- This week's work is documentation in `10-devops`. None of the commits or PRs references a user story, and no story in `04-requirements/user-stories.md` covers it, so there are no Given/When/Then criteria to report.
- "done" above means the PR was merged into `main`, the only permanent branch of the docs repository.

## 2. My individual contribution
- Rewrote `10-devops/README.md`, `environments.md` and `local-setup.md` (3 files, +229 / -299) - commit `1423ea4`, merged through PR #6.
- `environments.md` (`4e9746b`, +356 / -99): environment model (`local`, `develop`, `qa`, `prod`, all on Docker Compose); the branch that feeds each environment (`hu-XXX-dev` -> `develop`, `hu-XXX-qa` -> `qa`, `hu-XXX-main` -> `main`); promotion by `git cherry-pick -x`; Compose topology; configuration per environment (naming convention, variables that differ and variables that stay the same); secrets table (Wompi Sandbox events and integrity secrets, PostgreSQL and RabbitMQ passwords, rotation); Wompi Sandbox per environment; migrations; deploy strategy, checklist and rollback.
- `local-setup.md` (`4ab6938`, +234 / -135): prerequisites per stack (Java + Spring Boot backend, React + Vite frontend), ports, step-by-step setup with environment variables, daily workflow with `hu-012-dev` and Conventional Commits, and common issues (ports, Flyway, JWT key, Testcontainers, Wompi webhook).
- `10-devops/README.md` (`2b6fb9c`, +49 / -28): documents in the section, decisions it records and open questions.

### Contribution to MVP 2 / v2.0.0
| Area | This week |
|---|---|
| Contracts (OpenAPI / events) | None |
| Saga / Outbox | None |
| Per-environment config | Yes: `10-devops/environments.md` defines per-environment variables, secrets and the dev / qa / main promotion flow (PR #15) |
| ADR | None written (`environments.md` cites ADR-008) |
| CHANGELOG | None (no CHANGELOG file exists in ftx-docs or ftx-front) |

### Commits (author soymiguelgomez, 2026-09-14 to 2026-09-20)
| Repo | Hash | Date | Message | Branch / PR |
|---|---|---|---|---|
| ftx-docs | `e9750ed` | 2026-09-16 19:34 | Add files via upload | PR #4 - not merged |
| ftx-docs | `1423ea4` | 2026-09-16 20:12 | Add files via upload | `dev` - PR #6 |
| ftx-docs | `4e9746b` | 2026-09-18 19:41 | Add files via upload | `docs/update-10-environments.md` - PR #15 |
| ftx-docs | `4ab6938` | 2026-09-18 19:44 | Add files via upload | `docs/update-10-local-setup` - PR #16 |
| ftx-docs | `2b6fb9c` | 2026-09-18 19:45 | Add files via upload | `docs/update-10-readme` - PR #17 |
| ftx-front | - | - | No commits this week | - |
| ftx-schedules-db | - | - | No commits this week | - |
| fork | - | - | No commits this week | - |

### Pull requests and flow
| PR | Branch -> target | Merged | Merge commit |
|---|---|---|---|
| ftx-docs #4 | `soymiguelgomez-patch-1` -> `dev` (head `e9750ed`) | No, closed. Approved by ariel5253 on 2026-09-17 09:14; the same 10-devops content went in through PR #6 (`1423ea4`) | - |
| ftx-docs #6 | `dev` -> `main` | 2026-09-17, by Dannamo34; approved by ariel5253 on 2026-09-17 | `724332b` |
| ftx-docs #15 | `docs/update-10-environments.md` -> `main` | 2026-09-29 (Week 09), by soymiguelgomez; approved by ariel5253 on 2026-09-19 13:08 | `50ecaa9` |
| ftx-docs #16 | `docs/update-10-local-setup` -> `main` | 2026-09-27 (Week 08), by Dannamo34; approved by ariel5253 on 2026-09-19 13:09 | `82d8676` |
| ftx-docs #17 | `docs/update-10-readme` -> `main` | 2026-09-29 (Week 09), by soymiguelgomez; approved by ariel5253 on 2026-09-19 20:26 | `c0e9d23` |

- Flow `hu-xxx-dev -> develop -> qa -> main`: **not applicable** to ftx-docs. Per `00-governance/branching-policy.md`, the documentation repository has one permanent branch, `main`, fed by a child branch and a PR with "1 approval · ariel5253". PRs #6, #15, #16 and #17 followed that rule: each one has an approval from ariel5253 before its merge (links in section 6). PR #4 targeted `dev` and was closed.

## 3. Blockers and risks
- All five commits carry the GitHub web uploader message `Add files via upload`, which does not follow Conventional Commits.
- PRs #15 and #17 were not merged until 2026-09-29.
- `10-devops/README.md` lists `ci-cd.md`, which did not exist in the repository yet. I restored it in Week 08 on a branch that was not merged.

## 4. Plan for next week
- Week 08 (as executed, see `08-week/hu-status`): reconcile `environments.md` with the branching policy, restore `ci-cd.md`, and draft the payment-service contract and payment diagrams.

## 5. Compliance self-check
- [ ] Conventional Commits - `type(scope): summary`
- [ ] Per-environment HU branch + PR to that environment (hu-xxx-dev -> develop, ...)
- [ ] Testable acceptance criteria
- [ ] Tests added/updated (unit / integration)
- [ ] DDD / hexagonal boundaries respected (domain has no I/O)
- [x] No secrets; config via environment variables

## 6. Evidence links
- PR #6: https://github.com/code-corhuila/ftx-docs/pull/6 - commit https://github.com/code-corhuila/ftx-docs/commit/1423ea420813cbb928bbc982a43fb9b03793cb1b
- PR #15: https://github.com/code-corhuila/ftx-docs/pull/15 - commit https://github.com/code-corhuila/ftx-docs/commit/4e9746b5f86673637fbe30d611ac7dbbcd70cc78
- PR #16: https://github.com/code-corhuila/ftx-docs/pull/16 - commit https://github.com/code-corhuila/ftx-docs/commit/4ab6938fbd16e909da5f08bb03592993a97e3773
- PR #17: https://github.com/code-corhuila/ftx-docs/pull/17 - commit https://github.com/code-corhuila/ftx-docs/commit/2b6fb9c5e76d934ee1da5f5c3bc0e0c4def0e09b
- PR #4 (closed, not merged): https://github.com/code-corhuila/ftx-docs/pull/4
- Approvals by ariel5253: https://github.com/code-corhuila/ftx-docs/pull/6#pullrequestreview-5240905724, https://github.com/code-corhuila/ftx-docs/pull/15#pullrequestreview-5256924272, https://github.com/code-corhuila/ftx-docs/pull/16#pullrequestreview-5256929885, https://github.com/code-corhuila/ftx-docs/pull/17#pullrequestreview-5258779726
- Environments document: https://github.com/code-corhuila/ftx-docs/blob/main/10-devops/environments.md
- Self-check notes: the commits are `Add files via upload` (not Conventional Commits); the branches are `dev` / `docs/...`, not HU branches; no user story or tests are involved; there is no code, so DDD does not apply; `environments.md` keeps secrets out of the repository (placeholders only in `.env.example`, real values in the environment).
