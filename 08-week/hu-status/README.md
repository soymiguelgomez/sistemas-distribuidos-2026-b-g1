<!-- HU-STATUS TEMPLATE - do NOT remove the <!-- ... --> markers or the table headers.
     Your weekly grade is read AUTOMATICALLY from this file:
       08-week/hu-status/README.md  (inside YOUR fork). English. -->

# Weekly Status - Week 08

<!-- CONFIG-START - must match your profile repo (username/username) CONFIG -->
- FULL_NAME: Miguel Andres Gomez Gutierrez
- GITHUB_USER: soymiguelgomez
- TEAM: Futbolix
- SPRINT_GOAL: Plan Futbolix MVP 2 - story map, planning-poker estimates, cross-service dependency sequence and a velocity-based MVP 2 commitment
<!-- CONFIG-END -->

## 1. User stories worked this week
| HU ID | Title | Status (todo/doing/done) | Evidence (PR or commit URL) |
|---|---|---|---|
| HU-ARC-002 | API Review of the payment-service contract | doing | https://github.com/code-corhuila/ftx-docs/blob/docs/payment-contract/07-api/contracts/openapi/payment-service.yaml |
| HU-ARC-001 | Record ADR-005, ADR-006 and ADR-007 | todo | https://github.com/code-corhuila/ftx-docs/blob/docs/mvp2-planning/15-project-control/dependencies.md |
| HU-PAY-003 | Start the Wompi Sandbox Checkout | todo | https://github.com/code-corhuila/ftx-docs/blob/docs/mvp2-planning/04-requirements/user-stories.md |
| HU-RES-006 | Publish Reservation Events Through a Transactional Outbox | todo | https://github.com/code-corhuila/ftx-docs/blob/docs/mvp2-planning/04-requirements/user-stories.md |
| HU-PAY-004 | Apply the Wompi Payment Result | todo | https://github.com/code-corhuila/ftx-docs/blob/docs/mvp2-planning/04-requirements/user-stories.md |
| HU-RES-005 | Confirm or Reject the Reservation from the Payment Result | todo | https://github.com/code-corhuila/ftx-docs/blob/docs/mvp2-planning/04-requirements/user-stories.md |

## 2. My individual contribution
- Built the Futbolix story map (6 backbone activities: find a court, reserve, pay, follow up, cancel, administer) with release rows MVP 1 / Week 08 prerequisites / MVP 2 committed / pull list / MVP 3 / later, in `03-product/product-backlog.md`.
- Split the stories too large for a 1-week sprint: HU-PAY-001 (13+), HU-RES-003 (8) and HU-ADM-001 (8+) into 10 sprint-sized stories, and turned technical debt AT-004 into HU-RES-006. All 11 new stories have Given/When/Then criteria and the non-functional requirements the Definition of Ready asks for, in `04-requirements/user-stories.md`.
- Proposed Fibonacci estimates with HU-RES-005 (3 SP) as the anchor story and flagged where planning poker is expected to disagree.
- Committed 18 of 20 SP for the MVP 2 window (W09 + W10) against the proposed 10 SP/sprint capacity, because velocity has never been measured; HU-RES-006 is the declared first item to drop; 19 SP stay in an ordered pull list.
- Applied the Definition of Ready to the plan: the three pending ADRs and the payment contract are closed in the Week 08 refinement, before W09 planning, instead of consuming MVP 2 capacity.
- Wrote the contract-first draft `07-api/contracts/openapi/payment-service.yaml` (OpenAPI 3.0.3, validated) and the payment diagrams registered in `08-uml/diagram-index.md` but missing: SEQ-04, SEQ-08 and ST-02 (PlantUML sources plus rendered SVG).
- Mapped cross-service dependencies and broke the reservation-service / payment-service mutual wait with the v1 event contracts and fixture messages / stub adapters, in `15-project-control/dependencies.md`.
- Filled the risk register (R-001 to R-007) and recorded 12 open questions and 22 documentation inconsistencies, each with an owner, in `15-project-control/`.

## 3. Blockers and risks
- The MVP 1 walking skeleton (HU-RES-002 + HU-PAY-002) is not shown as Done in the documentation (overview reports v0.1.0, no release). Its status must be confirmed at W09 planning (2026-09-28) - R-001.
- ADR-005, ADR-006 and ADR-007 are pending; without them no payment story meets the Definition of Ready. Due 2026-09-27 (Tech Lead) - R-002.
- Wompi Sandbox credentials must be available before W09 (DevOps, 2026-09-27) - R-003.
- No documented way for the Wompi Sandbox webhook to reach a local Docker Compose environment (Q-001) - R-004.
- The payment contract needs the reservation code in `ReservationCreated`, which the v1 payload does not carry (Q-011).
- Velocity is unmeasured; 10 SP/sprint is a proposal. W09 is the first real measurement - R-005.

## 4. Plan for next week
- Before W09 planning: API Review of `payment-service.yaml` (HU-ARC-002) and ADR-005/006/007 (HU-ARC-001), both due 2026-09-27.
- W09 planning (2026-09-28): confirm the MVP 1 skeleton and Wompi credentials; run planning poker on the proposed estimates and record the agreed values in GitHub Projects.
- W09 commitment (10 SP): HU-PAY-003 (5) and HU-RES-006 (5), due 2026-10-04.
- W09 review (2026-10-04): record the first measured velocity in `agile-conventions.md` and decide whether HU-RES-006 stays in MVP 2.

## 5. Compliance self-check
- [x] Conventional Commits - `type(scope): summary`
- [ ] Per-environment HU branch + PR to that environment (hu-xxx-dev -> develop, ...)
- [x] Testable acceptance criteria
- [ ] Tests added/updated (unit / integration)
- [x] DDD / hexagonal boundaries respected (domain has no I/O)
- [x] No secrets; config via environment variables

## 6. Evidence links
- Story map, estimates and MVP 2 commitment: https://github.com/code-corhuila/ftx-docs/blob/docs/mvp2-planning/03-product/product-backlog.md
- Split user stories with acceptance criteria: https://github.com/code-corhuila/ftx-docs/blob/docs/mvp2-planning/04-requirements/user-stories.md
- Cross-service dependencies and sequence: https://github.com/code-corhuila/ftx-docs/blob/docs/mvp2-planning/15-project-control/dependencies.md
- Risk register: https://github.com/code-corhuila/ftx-docs/blob/docs/mvp2-planning/15-project-control/risks.md
- Open questions and documentation inconsistencies: https://github.com/code-corhuila/ftx-docs/blob/docs/mvp2-planning/15-project-control/open-questions.md
- Proposed payment-service contract: https://github.com/code-corhuila/ftx-docs/blob/docs/payment-contract/07-api/contracts/openapi/payment-service.yaml
- Payment sequence diagram (SEQ-04): https://github.com/code-corhuila/ftx-docs/blob/docs/payment-contract/08-uml/diagrams/source/seq-payment.puml
- Session material: https://code-corhuila.github.io/ova-web/2026-B/distribuidos/08-week/02-session/
