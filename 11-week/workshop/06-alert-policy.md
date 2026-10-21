# CP7 - Alert policy for the reservation availability SLO

Rules: `06-alerts.yml`. SLO: 99.5 % of `POST /api/v1/reservations` without `5xx` in 30 days,
measured at api-gateway (`05-slo.md`, SLO 1). Budget: **3.6 failed requests** or **216
minutes** in 30 days (720 hours).

## How much budget each alert has spent before it fires

Budget spent = burn rate x long window / SLO window.

| Alert | Burn rate | Long / short window | Error ratio that fires it | Budget spent when it fires | In minutes of 216 | Severity |
|---|---|---|---|---|---|---|
| `ReservationCreateFastBurn` | 14.4 | 1 h / 5 m | > 7.2 % | 14.4 x 1 / 720 = **2 %** | 0.02 x 216 = **4.3 min** | `page`: someone acts now |
| `ReservationCreateSlowBurn` | 6 | 6 h / 30 m | > 3 % | 6 x 6 / 720 = **5 %** | 0.05 x 216 = **10.8 min** | `ticket`: fixed in working hours |

If nobody reacted, the fast burn would empty the whole budget in 720 / 14.4 = **50 hours**,
and the slow burn in 720 / 6 = **5 days**.

The short window (5 m, 30 m) stops the alert once the problem is gone: the 1 h and 6 h ratios
keep the failures for hours, the short ones forget them in minutes.

## What these numbers mean with Futbolix traffic

The table assumes steady traffic. Futbolix has 24 reservations a day, about **one request per
hour**, so the real behaviour is different and I want the team to know it:

- **One failed request fires the fast alert.** If the only request of the last hour fails,
  the 1 h ratio is 100 %, far above 7.2 %. That single failure is already 1 / 3.6 = **28 %**
  of the monthly budget, not 2 %. So the alert is not too sensitive: at this volume every
  failure deserves a look.
- **The 5 m window is often empty.** With no request in the last 5 minutes the ratio is
  `0 / 0` (no value), the `and` fails and the alert stops. The fast alert therefore fires for
  at most about 5 minutes after a failure; the slow alert (30 m) stays longer and is the one
  that keeps a ticket open.
- **What I would add when there is code:** a synthetic `POST` every 5 minutes to a test court
  in `qa`, so the windows always have traffic. It is not in the rules because it would change
  the SLO denominator in production.

## Labels and annotations

- `severity`: `page` (fast) or `ticket` (slow).
- `team: futbolix`, `service: reservation-service`, `slo: reservation-create-availability`, so
  the alert can be routed and grouped by SLO.
- `summary` and `description` say what the customer feels (reservations failing), not which
  machine is sick.
- `runbook_url` points to `07-runbook.md` (CP8).

## Cause-based alerts I will NOT create

| Alert | Where it comes from | Why not |
|---|---|---|
| CPU of reservation-service above 80 % for 5 m | usual container alert | High CPU with all reservations answered in time is not a problem for the customer, and a reservation can fail with low CPU (court-service down, RabbitMQ unreachable). The burn-rate alert already catches what the customer feels. With 24 requests a day, CPU says almost nothing about the journey. |
| `PodCrashLooping` (restarts > 3 in 10 m) | `ftx-docs/13-operations/observability.md` | Futbolix runs every environment on Docker Compose (`10-devops/environments.md`, `restart: unless-stopped` in `qa` and `prod`), not Kubernetes: there are no pods. A container that restarts and recovers between two requests costs no budget; one that stays down shows up as `5xx` at api-gateway and fires the burn-rate alert. |

The team's `HighErrorRate` rule (error rate > 5 % for 5 m, `observability.md`) is replaced by
these two alerts for the reservation journey: a fixed 5 % threshold ignores how much budget is
left and, at one request per hour, would fire and clear on every single failure.

## Validation

- `06-alerts.yml` parses as valid YAML (checked with PyYAML).
- `promtool check rules` was not run: Prometheus is not installed on this machine.
