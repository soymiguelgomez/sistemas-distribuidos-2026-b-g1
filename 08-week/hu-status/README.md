<!-- HU-STATUS TEMPLATE - do NOT remove the <!-- ... --> markers or the table headers.
     Your weekly grade is read AUTOMATICALLY from this file:
       08-week/hu-status/README.md  (inside YOUR fork). English. -->

# Weekly Status - Week 08

<!-- CONFIG-START - must match your profile repo (username/username) CONFIG -->
- FULL_NAME: Miguel Andres Gomez Gutierrez
- GITHUB_USER: soymiguelgomez
- TEAM: Futbolix
- SPRINT_GOAL: Prepare MVP 2 payments contract-first - payment-service OpenAPI contract and payment sequence/state diagrams - reconcile the 10-devops environment docs and start the schedules database repository
<!-- CONFIG-END -->

## 1. User stories worked this week
| HU ID | Title | Status (todo/doing/done) | Evidence (PR or commit URL) |
|---|---|---|---|
| HU-ARC-002 | API Review of the proposed payment-service contract | doing | https://github.com/code-corhuila/ftx-docs/pull/29 |
| HU-PAY-003 | Start the Wompi Sandbox checkout - contract and sequence only, no implementation | todo | https://github.com/code-corhuila/ftx-docs/pull/29 |
| HU-PAY-004 | Apply the Wompi payment result - contract and diagrams only, no implementation | todo | https://github.com/code-corhuila/ftx-docs/pull/30 |
| N/A (no HU ID) | ADR-005/006/007 pending | todo | N/A |
| N/A (no HU ID) | ftx-schedules-db: first files of the schedules database repository | doing | https://github.com/code-corhuila/ftx-schedules-db/pull/1 |
| N/A (no HU ID) | 10-devops: reconcile `environments.md` with the branching policy and restore `ci-cd.md` | doing | https://github.com/code-corhuila/ftx-docs/commit/534dbd3545802257b6fed04a156ba8e59e073c9e |
| N/A (no HU ID) | 10-devops: rename `local-setup.md` sections and add the WSL2 note | doing | https://github.com/code-corhuila/ftx-docs/commit/35a8d29ff5d2d8b9f3ff09e3d8c6559f96066032 |

Note on "ADR-005/006/007 pending": in Week 08 the ADR register in ftx-docs `main` listed ADR-005 (reservation and payment consistency), ADR-006 (outbox) and ADR-007 (reservation lookup) as pending decisions, and the payment contract depends on them. I did not write them. They were later drafted by Dannamo34 in ftx-docs PR #38 (2026-10-06), which is not merged.

### Acceptance criteria met
- HU-ARC-002, HU-PAY-003 and HU-PAY-004 are referenced in my contract and diagrams, but their story definitions are not in any ftx-docs branch (checked on 2026-10-13), so I cannot check criteria against them.
- The closest defined story is HU-PAY-001 (`04-requirements/user-stories.md` on `main`). This week I **specified** its criteria in the contract and diagrams. Nothing was implemented, so none of them is met in running code:
  - AC1 Initiate payment -> `POST /payments/checkouts` (public, `Idempotency-Key` required) and the "Start the checkout" block of SEQ-04.
  - AC2 Approved payment -> SEQ-04: `PENDING -> APPROVED`, `PaymentApproved v1` published, reservation `PENDING -> CONFIRMED`.
  - AC3 Rejected payment -> SEQ-08: `PENDING -> REJECTED`, `PaymentRejected v1` published, reservation `PENDING -> REJECTED`; an invalid signature returns 401.
  - AC4 Payment association -> payment looked up by reservation code; unique `wompi_transaction_id`, so a duplicate result changes nothing.

## 2. My individual contribution
- Wrote the contract-first draft `07-api/contracts/openapi/payment-service.yaml` (OpenAPI 3.0.3, status "Proposed - pending API Review"): `GET /health`, `POST /payments/checkouts`, `POST /payments/wompi/webhook` verified by `X-Event-Checksum`. It lists open points Q-002 (webhook path), Q-011 (reservation key) and ADR-007 (reservation code format). Commit `21fc087`, PR #29, merged into `main`.
- Added the PlantUML sources for SEQ-04 (approved payment), SEQ-08 (rejected payment and invalid signature) and ST-02 (payment lifecycle `PENDING -> APPROVED / REJECTED -> REFUNDED`) in `08-uml/diagrams/source/`. Commit `02aec66`, PR #30, merged into `main`. The commit message mentions rendered SVGs, but the commit only contains the three `.puml` files.
- Reconciled `10-devops/environments.md` with `00-governance/branching-policy.md`. The one rule not taken verbatim from the policy is labeled as a proposal pending Tech Lead approval. Also restored `10-devops/ci-cd.md`, which `10-devops/README.md` requires (`534dbd3`, branch only, no PR).
- Renamed the `local-setup.md` tool sections and added a Windows/WSL2 + Testcontainers note (`35a8d29`, branch only, no PR).
- ftx-schedules-db: on 2026-09-27 pushed `7603eab` to branch `chore/schedules-db-baseline` (`.env.example`, `.gitignore`, `Dockerfile`, `docker-compose.yml`, README) and opened PR #1 to `develop`, titled "hu-001-dev". The commit message says "add schema, seed and migration CI", but the commit has no schema, seed or CI file; those came in Week 09.
- In this fork: filled the Week 08 status report (`a38a1d8`, `62d286a`) and added copies of the payment contract and diagrams in `08-week/hu-status/` (`067b2e6`).

### Contribution to MVP 2 / v2.0.0
| Area | This week |
|---|---|
| Contracts (OpenAPI / events) | Yes: `payment-service.yaml` (PR #29). The diagrams use the `PaymentApproved v1` / `PaymentRejected v1` events on `futbolix.events` |
| Saga / Outbox | Saga, design only: the diagrams model the choreographed reservation -> payment -> reservation flow, with idempotent consumers (`processed_events`, unique `wompi_transaction_id`). Outbox: none. The diagram leaves late or conflicting results to ADR-005 |
| Per-environment config | `environments.md` reconciled and `ci-cd.md` restored, on branch `docs/reconcile-environments-and-ci-cd` (not merged). ftx-schedules-db: `.env.example` and a Compose file driven by environment variables (PR #1, not merged) |
| ADR | None written. The contract depends on pending ADR-005 and ADR-007 |
| CHANGELOG | None (no CHANGELOG file existed in ftx-docs or ftx-front) |

### Commits (author soymiguelgomez, 2026-09-21 to 2026-09-27)
| Repo | Hash | Date | Message | Branch / PR |
|---|---|---|---|---|
| ftx-docs | `534dbd3` | 2026-09-21 14:53 | ocs: reconcile environments.md | `docs/reconcile-environments-and-ci-cd` - no PR |
| ftx-docs | `35a8d29` | 2026-09-21 14:55 | docs: rename local-setup sections and add WSL2 | `docs/local-setup-wsl2-and-renames` - no PR |
| ftx-docs | `21fc087` | 2026-09-23 19:38 | docs: payment diagrams | `docs/payment-contract` - PR #29 |
| ftx-docs | `02aec66` | 2026-09-23 19:43 | docs(payment): add payment sequence | `docs(payment)-add-payment-sequence-and-state-diagrams` - PR #30 |
| fork | `a38a1d8` | 2026-09-23 19:15 | docs(hu-status): fill week 08 status report | `main` of this fork |
| fork | `62d286a` | 2026-09-23 19:36 | docs(docs): fill week 08 hu status | `main` of this fork |
| fork | `067b2e6` | 2026-09-23 19:45 | docs(payment): add payment sequence | `main` of this fork |
| ftx-schedules-db | `7603eab` | 2026-09-27 17:24 | feat(schedules): add schema, seed and migration CI | `chore/schedules-db-baseline` - PR #1 |
| ftx-front | - | - | No commits this week | - |

### Pull requests and flow
| PR | Branch -> target | Merged | Merge commit |
|---|---|---|---|
| ftx-docs #29 | `docs/payment-contract` -> `main` | 2026-09-27, by Dannamo34 | `47caa44` |
| ftx-docs #30 | `docs(payment)-add-payment-sequence-and-state-diagrams` -> `main` | 2026-09-27, by Dannamo34 | `fd8b73f` |
| ftx-docs #16 (from Week 07) | `docs/update-10-local-setup` -> `main` | 2026-09-27, by Dannamo34 | `82d8676` |
| ftx-schedules-db #1 | `chore/schedules-db-baseline` -> `develop` | No, still open on 2026-10-13 | - |
| (none) | `docs/reconcile-environments-and-ci-cd` | No PR opened | - |
| (none) | `docs/local-setup-wsl2-and-renames` | No PR opened | - |

- ftx-docs: the flow `hu-xxx-dev -> develop -> qa -> main` does **not apply**. Per `00-governance/branching-policy.md`, the documentation repository only has `main`, fed by a child branch and a PR.
- ftx-schedules-db: PR #1 targets `develop` from a `chore/` branch, not from a `hu-xxx-dev` branch. It was never promoted to `qa` or `main`.

## 3. Blockers and risks
- Commit `534dbd3` has a typo in its type (`ocs:` instead of `docs:`). `21fc087` says "payment diagrams" but only adds the OpenAPI contract, and `7603eab` says "schema, seed and migration CI" but adds none of them.
- `534dbd3` and `35a8d29` were pushed without a PR, so the reconciled `environments.md` and `ci-cd.md` are not in `main`.
- The contract is blocked by open points Q-002 (webhook path), Q-011 (`ReservationCreated` v1 does not carry the reservation code) and ADR-007 (code format). ADR-005 must define what happens to a payment result for a reservation that is no longer PENDING.
- The Week 08 report I submitted on 2026-09-23 linked a `docs/mvp2-planning` branch (story map, split stories, dependencies, open questions). That branch is not on the remote (checked on 2026-10-13), and none of those files appears in any ftx-docs branch with me as author, so that work is not counted here.

## 4. Plan for next week
- Week 09 (as executed, see `09-week/hu-status`): align the architecture overview's error format and health checks with the API contracts, merge my pending 10-devops PRs (#15, #17), and add the schema, seed and checks to ftx-schedules-db PR #1.

## 5. Compliance self-check
- [ ] Conventional Commits - `type(scope): summary`
- [ ] Per-environment HU branch + PR to that environment (hu-xxx-dev -> develop, ...)
- [ ] Testable acceptance criteria
- [ ] Tests added/updated (unit / integration)
- [ ] DDD / hexagonal boundaries respected (domain has no I/O)
- [x] No secrets; config via environment variables

## 6. Evidence links
- PR #29 (payment-service contract): https://github.com/code-corhuila/ftx-docs/pull/29 - commit https://github.com/code-corhuila/ftx-docs/commit/21fc087e11957bf1042062fc028c3e302f57723b
- PR #30 (SEQ-04, SEQ-08, ST-02): https://github.com/code-corhuila/ftx-docs/pull/30 - commit https://github.com/code-corhuila/ftx-docs/commit/02aec6611d74e75c4bd5ca534d23ed11f5b02dfe
- Contract on main: https://github.com/code-corhuila/ftx-docs/blob/main/07-api/contracts/openapi/payment-service.yaml
- SEQ-04 source on main: https://github.com/code-corhuila/ftx-docs/blob/main/08-uml/diagrams/source/seq-payment.puml
- Reconcile environments (no PR): https://github.com/code-corhuila/ftx-docs/tree/docs/reconcile-environments-and-ci-cd
- Local setup WSL2 (no PR): https://github.com/code-corhuila/ftx-docs/tree/docs/local-setup-wsl2-and-renames
- ftx-schedules-db PR #1: https://github.com/code-corhuila/ftx-schedules-db/pull/1 - commit https://github.com/code-corhuila/ftx-schedules-db/commit/7603eabc36e5867efe7bd4f67414ed1051bc9a19
- Fork commits: https://github.com/soymiguelgomez/sistemas-distribuidos-2026-b-g1/commit/a38a1d803019f84f57ce74c50be34f72057da5c1, https://github.com/soymiguelgomez/sistemas-distribuidos-2026-b-g1/commit/62d286a19850658ba527ce9a73147e936ac7476f, https://github.com/soymiguelgomez/sistemas-distribuidos-2026-b-g1/commit/067b2e6f5fe616552706d90479bff056c78d2119
- Session material: https://code-corhuila.github.io/ova-web/2026-B/distribuidos/08-week/02-session/
- Self-check notes: 1 of 8 commits does not follow Conventional Commits (`ocs:`); the branches are `docs/...` and `chore/...`, not HU branches; the HU-ARC-002 / HU-PAY-003 / HU-PAY-004 definitions are not in the repository; no tests; no code, so DDD does not apply; the contract keeps the Wompi webhook secret inside payment-service, `environments.md` loads it from the environment (`APP_PAYMENT_WOMPI_EVENTS_SECRET`), and ftx-schedules-db reads its database settings from `.env` with placeholders in `.env.example`.
