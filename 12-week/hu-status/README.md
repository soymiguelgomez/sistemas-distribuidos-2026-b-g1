<!-- HU-STATUS TEMPLATE - do NOT remove the <!-- ... --> markers or the table headers.
     Your weekly grade is read AUTOMATICALLY from this file:
       12-week/hu-status/README.md  (inside YOUR fork). English. -->

# Weekly Status - Week 12

<!-- CONFIG-START - must match your profile repo (username/username) CONFIG -->
- FULL_NAME: Miguel Andres Gomez Gutierrez
- GITHUB_USER: soymiguelgomez
- TEAM: Futbolix
- SPRINT_GOAL: Observability of the "customer creates a reservation" journey - structured logs with trace propagation, golden-signal metrics, SLOs with an error budget, burn-rate alerts, a runbook and an incident drill (the observability workshop the instructor assigned in class on 2026-10-20)
<!-- CONFIG-END -->

## 1. User stories worked this week
| HU ID | Title | Status (todo/doing/done) | Evidence (PR or commit URL) |
|---|---|---|---|
| N/A (instructor workshop) | Observability workshop, delivery 1 (CP0 to CP4): journey map, structured log contract, trace-context middleware and metrics in a reservation-service prototype, with a test that proves `trace_id` reaches court-service | done | https://github.com/soymiguelgomez/sistemas-distribuidos-2026-b-g1/commit/272a6b8f20142999ac5d350bd07dffc27979fac1 |
| N/A (instructor workshop) | Observability workshop, delivery 2 (CP6 to CP9): SLOs and error budget, burn-rate alerting rules, runbook for the fast-burn alert, simulated slow court-service incident and postmortem | done | https://github.com/soymiguelgomez/sistemas-distribuidos-2026-b-g1/commit/77f00a1511fdfe619b2d99c8fbd6c6ff8782cd58 |

### Acceptance criteria met
- The journey "customer creates a reservation" (api-gateway -> reservation-service -> court-service -> RabbitMQ -> payment-service) is mapped with its critical hops (CP1, `01-journey.md`).
- Every log line follows one contract with `trace_id`, service and outcome (CP2, `02-log-contract.md`).
- The prototype propagates the trace context downstream, and `test/trace-propagation.test.js` proves that the `trace_id` received by court-service is the one the request started with (CP3).
- Golden signals and a metric catalog are defined (CP4); SLOs with an error budget (CP6); burn-rate alerting rules in `06-alerts.yml` (CP7); a runbook for the fast-burn alert (CP8); an incident drill with a postmortem (CP9).

## 2. My individual contribution
- Delivery 1, in class on 2026-10-20 (18:57 to 20:04), one push per checkpoint: merged `upstream/main` into my fork first (`f4ff09a`), then CP0 (`ee1dbef`), CP1 journey (`af73cd9`), CP2 log contract (`f9c4eb1`), CP3 trace-context middleware, structured logger, court-service client, metrics and the propagation test (`b005df2`, `6d4cf5a`, `b705c23`, `272a6b8`, `88bdbfd`), CP4 golden signals (`8f9206a`).
- Delivery 2, on 2026-10-21 in two work blocks: SLOs and error budget (`f6fd484`), burn-rate alerting rules (`6423005`), runbook (`41d3e21`), simulated slow court-service incident (`a17f32f`) and incident drill with postmortem (`77f00a1`).
- Note: the instructor named this workshop "Week 11", so the same work is also listed in `11-week/hu-status/README.md`; it is reported here because it was assigned and done in this calendar week (2026-10-19 to 2026-10-25). No other work of mine was pushed this week.

## 3. Blockers and risks
- Four of my Futbolix pull requests from the previous week (`ftx-front#8`, `#10`; `ftx-docs#43`, `#44`) were still waiting to be merged, so nothing new could be built on them.
- The workshop prototype is not part of a Futbolix repository: it shows the technique, the real services still had no code.
- Docker cannot run on my laptop (WSL disabled), so the prototype was run with Node.js directly.

## 4. Plan for next week
- Week 13 security workshop: threat model of the reservation-service, RabbitMQ and payment-service trust boundary, and its security backlog.
- Follow up the review of my open pull requests in `ftx-front` and `ftx-docs`.

## 5. Compliance self-check
- [x] Conventional Commits - `type(scope): summary`
- [ ] Per-environment HU branch + PR to that environment (hu-xxx-dev -> develop, ...)
- [x] Testable acceptance criteria
- [x] Tests added/updated (unit / integration)
- [ ] DDD / hexagonal boundaries respected (domain has no I/O)
- [x] No secrets; config via environment variables

## 6. Evidence links
- Workshop folder: https://github.com/soymiguelgomez/sistemas-distribuidos-2026-b-g1/tree/main/11-week/workshop
- Delivery 1: https://github.com/soymiguelgomez/sistemas-distribuidos-2026-b-g1/commit/ee1dbef8ed4673a239cce8351ad739d343def328, https://github.com/soymiguelgomez/sistemas-distribuidos-2026-b-g1/commit/272a6b8f20142999ac5d350bd07dffc27979fac1, https://github.com/soymiguelgomez/sistemas-distribuidos-2026-b-g1/commit/8f9206a0417a4439c3ad77436a3493230df2f413
- Delivery 2: https://github.com/soymiguelgomez/sistemas-distribuidos-2026-b-g1/commit/f6fd484f603c0a2b4fa1c678d1b1b37f15e28202, https://github.com/soymiguelgomez/sistemas-distribuidos-2026-b-g1/commit/642300521bc507e9a3c77903f461b8bad2e78f3a, https://github.com/soymiguelgomez/sistemas-distribuidos-2026-b-g1/commit/41d3e21b254b5dc134b78a207e3b1e9620bd3937, https://github.com/soymiguelgomez/sistemas-distribuidos-2026-b-g1/commit/77f00a1511fdfe619b2d99c8fbd6c6ff8782cd58
- Self-check notes: the workshop lives in my fork on `main`, as the course asks for workshops, so there is no HU branch or Futbolix pull request this week; the prototype is a small Node.js service, not a hexagonal Futbolix service; it reads its settings from environment variables and holds no secrets.
