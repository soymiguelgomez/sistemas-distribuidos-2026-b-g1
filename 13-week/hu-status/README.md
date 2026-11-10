<!-- HU-STATUS TEMPLATE - do NOT remove the <!-- ... --> markers or the table headers.
     Your weekly grade is read AUTOMATICALLY from this file:
       13-week/hu-status/README.md  (inside YOUR fork). English. -->

# Weekly Status - Week 13

<!-- CONFIG-START - must match your profile repo (username/username) CONFIG -->
- FULL_NAME: Miguel Andres Gomez Gutierrez
- GITHUB_USER: soymiguelgomez
- TEAM: Futbolix
- SPRINT_GOAL: Threat model of TB4 (reservation-service <-> RabbitMQ <-> payment-service) and its security backlog for the next sprint
<!-- CONFIG-END -->

## 1. User stories worked this week
| HU ID | Title | Status (todo/doing/done) | Evidence (PR or commit URL) |
|---|---|---|---|
| N/A (no HU ID) | Threat model TB4: STRIDE, risk ranking, residual risk, related threat models and references (ftx-docs) | done (open for review, not merged) | https://github.com/code-corhuila/ftx-docs/pull/55 |
| N/A (no HU ID) | [security] Only payment-service can publish payment events on futbolix.events (S, risk 9, P0) | todo | https://github.com/code-corhuila/ftx-docs/issues/56 |
| N/A (no HU ID) | [security] Service broker users cannot administer RabbitMQ (E, risk 6, P1) | todo | https://github.com/code-corhuila/ftx-docs/issues/57 |
| N/A (no HU ID) | [security] A flood or a poison message cannot block futbolix.events (D, risk 6, P1) | todo | https://github.com/code-corhuila/ftx-docs/issues/58 |
| N/A (no HU ID) | Security gates workflow and negative broker authorization test (course fork), 3 tests passing | done | https://github.com/soymiguelgomez/sistemas-distribuidos-2026-b-g1/commit/82e078e |

## 2. My individual contribution
- Claimed TB4 in https://github.com/code-corhuila/ftx-docs/issues/54 and mapped the attack surface: https://github.com/soymiguelgomez/sistemas-distribuidos-2026-b-g1/commit/054ebc3
- STRIDE for TB4 in two pushes on PR #55: https://github.com/code-corhuila/ftx-docs/commit/9e7e218 and https://github.com/code-corhuila/ftx-docs/commit/0639d4a
- Three security stories (#56, #57, #58) with labels `security` and P0/P1; #56 has an acceptance criterion from the library book (005.8 C838s).
- `security.yml` (gitleaks, OWASP dependency-check, negative tests) and `BrokerAuthorizationNegativeTest`: https://github.com/soymiguelgomez/sistemas-distribuidos-2026-b-g1/commit/bdf978c
- Peer review of TB1 (PR #49): https://github.com/code-corhuila/ftx-docs/pull/49#pullrequestreview-5691958878
- CP6: related threat models (TB1 #49, TB5 #59, TB6 #50) added to the STRIDE and review requested: https://github.com/code-corhuila/ftx-docs/commit/8cc312f
- CP7: #56, #57, #58 on the "Futbolix — Backlog" board in Backlog, linked to #60, #64 and #51: https://github.com/soymiguelgomez/sistemas-distribuidos-2026-b-g1/commit/f45b02a
- CP8: negative test run (3 passed) and `security.yml` valid with actionlint: https://github.com/soymiguelgomez/sistemas-distribuidos-2026-b-g1/actions/runs/42843284626 and https://github.com/soymiguelgomez/sistemas-distribuidos-2026-b-g1/commit/82e078e

## 3. Blockers and risks
- The in-class work was pushed after 20:10, outside the class window, and CP6 to CP9 after the 2026-10-30 deadline.
- No teammate has reviewed PR #55 yet, so there is no review comment to answer.
- The negative test ran on GitHub Actions, not on my laptop: WSL and Virtual Machine Platform are disabled in Windows.
- The page numbers of the book are still to be added from the physical copy (chapter and section are cited).
- The "Board sync" workflow of ftx-docs fails at startup on every issue event since 2026-10-28, so issues are added to the board by hand.

## 4. Plan for next week
- Add the page numbers of the library book to the STRIDE references and to #56.
- Answer any review comment on PR #55.
- Start #56 (P0) in the next sprint, then #57 and #58.

## 5. Compliance self-check
- [x] Conventional Commits - `type(scope): summary`
- [ ] Per-environment HU branch + PR to that environment (hu-xxx-dev -> develop, ...)
- [x] Testable acceptance criteria
- [x] Tests added/updated (unit / integration)
- [ ] DDD / hexagonal boundaries respected (domain has no I/O)
- [x] No secrets; config via environment variables

## 6. Evidence links
- Workshop folder: https://github.com/soymiguelgomez/sistemas-distribuidos-2026-b-g1/tree/main/13-week/workshop
- Claim issue: https://github.com/code-corhuila/ftx-docs/issues/54
- STRIDE PR: https://github.com/code-corhuila/ftx-docs/pull/55
- Security stories: https://github.com/code-corhuila/ftx-docs/issues/56, https://github.com/code-corhuila/ftx-docs/issues/57, https://github.com/code-corhuila/ftx-docs/issues/58
- Review comment: https://github.com/code-corhuila/ftx-docs/pull/49#pullrequestreview-5691958878
- CP8 run: https://github.com/soymiguelgomez/sistemas-distribuidos-2026-b-g1/actions/runs/42843284626
