# 00-governance — Team Rules

> This section defines the agreements the team commits to follow throughout the project.
> Every team member must read all documents in this section before making their first commit.

---

## Documents in this section

| File | Purpose |
|------|---------|
| [git-conventions.md](./git-conventions.md) | Branch strategy, commit format, PR policy, merge rules |
| [agile-conventions.md](./agile-conventions.md) | Sprint structure, ceremonies, estimation, backlog tool |
| [definition-of-done.md](./definition-of-done.md) | Checklist that every completed user story must satisfy |
| [definition-of-ready.md](./definition-of-ready.md) | Checklist for a user story to enter a sprint |
| [documentation-rules.md](./documentation-rules.md) | How to write, update, and delete documentation |
| [microservices-documentation.md](./microservices-documentation.md) | Required documents per microservice |
| [security-policy.md](./security-policy.md) | Authentication, authorization, secrets, and how the team handles vulnerabilities |
| [security-rules.md](./security-rules.md) | Code-level security rules for the Java + Spring Boot stack |

---

## Binding project decisions

These decisions were agreed by the team and are assumed by every document in the repository.
Changing one requires updating every document that depends on it, in the same PR.

| Decision | Value |
|----------|-------|
| Customer accounts | **None.** Customers reserve anonymously; only administrators authenticate |
| Payments | **Real**, through Wompi in sandbox/test mode. Futbolix never handles card data |
| Notifications (WhatsApp / email) | **Out of MVP scope** |
| Number of courts | **Exactly four**, fixed and seeded by migration |
| Reservation duration | One or more whole hours; `amount = hourly price x hours` |
| Integration branch | **`dev`** (not `develop`) |
| Backend stack | Java 21 + Spring Boot 3.x + Maven + PostgreSQL + RabbitMQ |
| Frontend stack | React + Vite + JavaScript |
| Environments in the MVP | Local and `dev` only. Staging and production are out of scope |

---

## Quick reference before your first commit

1. Branch from `dev` as `hu-XXX-dev`
2. Commit with Conventional Commits and a Futbolix scope (`user`, `court`, `reservation`, `payment`, `web`, `infra`, `docs`)
3. Open a PR to `dev`, maximum 400 lines, minimum 1 approval
4. The story is not Done until it meets `definition-of-done.md` — including tests for any new domain invariant
5. Never commit a secret. Configuration goes through environment variables with a `.env.example` holding placeholders only

---

## How governance applies

Governance rules apply to **the entire project** — all sections, all services, all team members.
If a rule conflicts with a local convention, governance wins unless a new ADR overrides it.

> Change a governance rule only through team agreement.
> Document the change and the reason. Announce it before the next sprint.
