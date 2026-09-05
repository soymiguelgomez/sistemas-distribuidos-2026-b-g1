# ADRs — Architecture Decision Records

ADRs document important architectural decisions. Each file = one decision.

## When an ADR is required

Write one when the decision is expensive to reverse and someone will ask "why?" in six months:

- Choosing or replacing a technology (broker, database, gateway)
- Drawing a service or data boundary
- Choosing a consistency strategy for something that crosses services
- Adopting or rejecting a pattern with real cost (Saga, Outbox, CQRS)
- Any decision the team argued about for more than fifteen minutes

Do **not** write one for a library choice with no architectural consequence, a naming
preference, or anything you would happily change next sprint.

## How to create an ADR

1. Copy `_template-adr.md`
2. Name it `records/ADR-NNN-short-title.md` with the number zero-padded to three digits
3. **The file name is in English and kebab-case** — see ADR-001 and `00-governance/documentation-rules.md`
4. Fill it in completely, especially the evaluated alternatives. An ADR with one alternative is a note, not a decision record
5. Add a row to the register below in the same PR
6. Once accepted, the status is **permanent**. An ADR is never deleted or edited to say something else — it is superseded by a new one

## Possible statuses

- `Proposed` — under discussion
- `Accepted` — approved by the team
- `Rejected` — evaluated and discarded (document why)
- `Superseded` — superseded by ADR-NNN (indicate which one)

## ADR register

| # | Title | Status | Date |
|---|-------|--------|------|
| [ADR-001](records/ADR-001-documentation-language.md) | Documentation language | Accepted | 2026-08-16 |
| ADR-002 | Authentication strategy (stateless JWT) | Drafted — **not yet a file** | — |
| ADR-003 | Database per service | Drafted — **not yet a file** | — |
| ADR-004 | API Gateway pattern | Drafted — **not yet a file** | — |
| ADR-005 | Consistency strategy for the reservation and payment flow | **Pending decision** | — |
| ADR-006 | Outbox pattern: adopted or not | **Pending decision** | — |
| ADR-007 | Reservation lookup mechanism | **Pending decision** | — |
| [ADR-008](records/ADR-008-technology-stack.md) | Technology stack | Accepted | 2026-09-04 |

### ADR-002 to ADR-004 — drafted but not filed

The text of these three decisions currently lives inside `05-architecture/README.md`. They must
be moved into `records/`, one file each, using the template. Corrections needed before moving:

| ADR | Correction |
|-----|-----------|
| ADR-002 | Add that customers are **not** authenticated, and that the public endpoints are protected by input validation and gateway rate limiting instead |
| ADR-003 | Lists five services including Notification. There are four. Also record the accepted deviation: all schemas share one PostgreSQL container in the academic MVP |
| ADR-004 | Says "5 microservicios". Should be four. Also note that the gateway is a deployable, not a bounded context, and that `01-context/scope.md` does not mention it yet |

### ADR-005 to ADR-007 — decisions the project still owes

| ADR | Question it must answer | Why it cannot wait |
|-----|------------------------|--------------------|
| ADR-005 | Is the reservation-to-payment flow a choreographed saga, and what happens when a customer cancels a PENDING reservation while Wompi is still processing? | A `PaymentApproved` arriving after a `ReservationCancelled` currently has no defined outcome. The customer would be charged for a reservation that no longer exists |
| ADR-006 | Is the Outbox pattern adopted? | Without it, a crash between the database commit and the event publish leaves a reservation PENDING forever and no payment is ever started. Registered as technical debt AT-004, priority P1 |
| ADR-007 | How is the reservation code generated, and how is it protected? | Customers have no account, so the code is the only key to their reservation. If it is guessable, anyone can enumerate every reservation in the facility |

> These three must be resolved **before** the payment flow is implemented, not after.

## Folder layout

```
05-architecture/decisions/
├── README.md            ← this file, holds the register
├── _template-adr.md     ← copy this to start a new ADR
└── records/
    └── ADR-001-documentation-language.md
```
