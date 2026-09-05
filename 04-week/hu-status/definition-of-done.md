# Definition of Done (DoD)

> A User Story is **DONE** when it meets ALL criteria on this checklist.
> If even one is missing, the story is NOT done — it goes back to In Progress.

## Mandatory checklist

### Code
- [ ] Code implements all acceptance criteria of the user story
- [ ] Code was reviewed and approved by at least 1 team member (PR review)
- [ ] Code follows project standards (linting and formatting pass in CI)
- [ ] Hexagonal boundaries respected: the domain layer has no I/O — no REST controllers, no SQL, no broker clients, no Wompi calls
- [ ] No secrets in the code or in committed configuration; everything through environment variables
- [ ] No technical debt introduced without registering it in `15-project-control/tech-backlog.md`

### Tests
- [ ] Unit tests written for new business logic and for every new or modified domain invariant
- [ ] Test coverage meets the minimum threshold established by the project CI configuration, when a coverage threshold is defined
- [ ] All tests pass locally and in CI
- [ ] Acceptance criteria verified (manual or automated)

### Integration
- [ ] Changes do not break other services (integration tests pass, using Testcontainers where infrastructure is involved)
- [ ] If API changes: OpenAPI contract updated in `07-api/contracts/`
- [ ] If data model changes: service `data-model.md` updated and a Flyway migration added
- [ ] If new/modified events: `02-domain/domain-events.md` and the service `events.md` are updated
- [ ] If the story consumes an event: the consumer is idempotent and the test proves it

### Deployment
- [ ] Code is mergeable to `dev` (no conflicts)
- [ ] CI checks are green on the branch, when CI is configured for the affected service
- [ ] The service starts correctly with `docker compose up` from a clean checkout
- [ ] Basic smoke test passes in the dev environment when the story introduces or modifies executable service functionality

> **Note:** staging and production environments are **not part of the MVP** (see
> `01-context/scope.md`). Until they exist, the deployment bar is the `dev` environment
> running through Docker Compose. Reinstate the staging criteria when that environment is
> created.

### Documentation
- [ ] Service `README.md` updated if the public interface changed
- [ ] If a significant technical decision was made: ADR created or updated in `05-architecture/decisions/`
- [ ] If a business rule or invariant changed: `02-domain/entities-and-rules.md` updated
- [ ] If a term changed meaning: `01-context/glossary.md` updated

---

## Additional criteria for specific story types

| Story type | Extra criterion |
|------------|-----------------|
| Touches reservation creation or confirmation | A concurrency test proves that two simultaneous requests for the same court, date and overlapping time slot cannot both succeed |
| Touches pricing or the reservation amount | A test proves `amount = court hourly price x number of hours` for a multi-hour reservation |
| Touches the Wompi integration | Success, rejection and timeout scenarios are covered against the Wompi sandbox; the webhook signature is verified |
| Exposes a public endpoint | Input validation is applied at the adapter layer and invalid input returns 400 without reaching the domain |

---

## Allowed exceptions

The following exceptions must be explicitly agreed to by the Tech Lead:
- E2E tests omitted due to environment limitations (document the risk)
- Documentation deferred for urgent delivery (create a tech-debt ticket)

---

## What is NOT a Done criterion

- "The code is on my machine" — it must be in the repository
- "It works on my local environment" — it must work from a clean checkout with Docker Compose
- "The PM/PO approved it" — that is the product Definition of Done, not the code's
- "The rule is written in the documentation" — an invariant with no test is not enforced

---

## Correlations

- Definition of Ready → `00-governance/definition-of-ready.md`
- Git conventions → `00-governance/git-conventions.md`
- Documentation rules → `00-governance/documentation-rules.md`
- Technical debt backlog → `15-project-control/tech-backlog.md`
