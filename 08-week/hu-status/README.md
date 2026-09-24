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
| HU-ARC-001 | Record ADR-005, ADR-006 and ADR-007 | todo | https://github.com/code-corhuila/ftx-docs/blob/docs/mvp2-planning/03-product/product-backlog.md |
| HU-ARC-002 | Publish the payment-service OpenAPI contract | todo | https://github.com/code-corhuila/ftx-docs/blob/docs/mvp2-planning/15-project-control/dependencies.md |
| HU-PAY-003 | Start the Wompi Sandbox Checkout | todo | https://github.com/code-corhuila/ftx-docs/blob/docs/mvp2-planning/04-requirements/user-stories.md |
| HU-PAY-004 | Apply the Wompi Payment Result | todo | https://github.com/code-corhuila/ftx-docs/blob/docs/mvp2-planning/04-requirements/user-stories.md |
| HU-RES-005 | Confirm or Reject the Reservation from the Payment Result | todo | https://github.com/code-corhuila/ftx-docs/blob/docs/mvp2-planning/04-requirements/user-stories.md |

## 2. My individual contribution
- Built the Futbolix story map (6 backbone activities: find a court, reserve, pay, follow up, cancel, administer) with release rows MVP 1 / MVP 2 committed / pull list / MVP 3 / later, in `03-product/product-backlog.md`.
- Split the three stories too large for a 1-week sprint: HU-PAY-001 (13+) into HU-PAY-002..006 and HU-RES-005; HU-RES-003 (8) into HU-RES-007 and HU-PAY-005; HU-ADM-001 (8+) into HU-ADM-002..004. Wrote Given/When/Then acceptance criteria for all 11 split stories in `04-requirements/user-stories.md`.
- Proposed relative estimates on the Fibonacci scale with HU-RES-005 (3 SP) as the anchor story, and flagged where planning poker is expected to disagree (Wompi stories, refund, ADR work).
- Committed 18 of 20 SP for the MVP 2 window (W09 + W10) against the proposed 10 SP/sprint capacity, because velocity has never been measured; the remaining 24 SP stay in an ordered pull list.
- Mapped cross-service dependencies and broke the reservation-service / payment-service mutual wait with contract-first development (event contracts v1 already exist) and fixture messages / stub adapters, in `15-project-control/dependencies.md`, including the critical path and a dated sequence.
- Recorded 10 open questions and 12 documentation inconsistencies found while planning, each with an owner and deadline, in `15-project-control/open-questions.md`.

## 3. Blockers and risks
- The MVP 1 walking skeleton (HU-RES-002 + HU-PAY-002) is not shown as Done in the documentation (overview reports v0.1.0, no release). Its status must be confirmed at W09 planning (2026-09-28) before the MVP 2 commitment holds.
- ADR-005, ADR-006 and ADR-007 are still pending and must exist before the payment flow is implemented; due 2026-09-29 (Tech Lead).
- Wompi Sandbox credentials must be available before W09 starts (DevOps, 2026-09-28); without them no payment story meets the DoR.
- No documented way for the Wompi Sandbox webhook to reach a local Docker Compose environment (Q-001), and the webhook path is inconsistent between documents (Q-002).
- Velocity is unmeasured; 10 SP/sprint is a proposal. W09 is the first real measurement.
- The integration branch is `develop` in the course policy but `dev` in `git-conventions.md` and the DoD (Q-004).

## 4. Plan for next week
- W09 planning (2026-09-28): confirm the MVP 1 skeleton status and Wompi credentials; run planning poker on the proposed estimates and record the agreed values in GitHub Projects.
- W09 commitment (10 SP): HU-ARC-001 (3) by 2026-09-29, HU-ARC-002 (2) by 2026-09-30, HU-PAY-003 (5) by 2026-10-04.
- W09 review (2026-10-04): record the first measured velocity in `agile-conventions.md` and decide whether any pull-list story enters W10.

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
- Open questions and documentation inconsistencies: https://github.com/code-corhuila/ftx-docs/blob/docs/mvp2-planning/15-project-control/open-questions.md
- Session material: https://code-corhuila.github.io/ova-web/2026-B/distribuidos/08-week/02-session/
