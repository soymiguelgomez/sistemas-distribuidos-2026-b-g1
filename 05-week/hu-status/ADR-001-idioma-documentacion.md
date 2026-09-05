# ADR-001 — Documentation Language

- **ID:** ADR-001
- **Date:** 2026-08-16 <!-- confirm the real decision date with the team -->
- **Status:** Accepted
- **Authors:** Hernando Antonio Martin Herrera — Tech Lead
- **Reviewers:** Danna Michelle Morales Losada, Edwin Melendez Palomino, Miguel Andres Gomez Gutierrez

> **Pending correction:** this file is named `ADR-001-idioma-documentacion.md`, in Spanish,
> which contradicts the decision recorded below (Markdown documentation and file names in
> English). It must be renamed to `ADR-001-documentation-language.md`. The rename is deferred
> because the current review does not allow changing the repository structure.

---

## Context

The software industry standard — Stack Overflow, library documentation, technical articles,
frameworks, and open-source tooling — operates in English. Mixing languages across artifacts
(Spanish docs, English code, Spanish API descriptions) creates a cognitive translation
boundary that slows onboarding, increases errors in naming, and makes it harder to search
for help online.

A single, clear rule established from day one prevents inconsistencies: mismatched variable
names, Spanish comments in English code, and conflicting terminology between documentation
and implementation.

The decision is needed now because the team is about to write its first Java code and its first
Flyway migrations. Naming choices made in a migration are expensive to reverse once data exists.

**Known constraints:**
- The team is Spanish-speaking and the course is taught in Spanish.
- Futbolix end users are Colombian customers and a Colombian facility administrator. The web
  interface is in Spanish, as shown in the approved mockup.
- The academic deliverables for the course include weekly status reports that the course
  template explicitly requires in English.

---

## Decision

**We decided:** English is the language of every technical artifact — code, database schema,
commits, branches, documentation, API contracts and logs. Spanish is used only for text a
Futbolix end user reads on screen.

**Justification:** the technical artifacts have one audience, the development team, and one
ecosystem, the Java and Spring toolchain, which is entirely English. The user interface has a
different audience with a different language. Separating on that boundary — not on an artifact
type boundary — gives one rule that is easy to apply and never ambiguous: *if a customer or
administrator reads it in the browser, it is Spanish; everything else is English.*

| Artifact | Language | Reason |
|----------|----------|--------|
| Variables, functions, classes in code | English | Consistency with libraries and frameworks |
| Table and column names in the database | English | Coherence with the domain model that maps to them |
| Domain event names and payload fields | English | They are contracts between services, not user-facing |
| Commits (Conventional Commits) | English | Established standard, readable on GitHub |
| Git branch names | English | Consistent with commits |
| Markdown documentation and file names | English | Eliminates the translation boundary; searchable |
| ADRs | English | Single source of truth, no translation boundary |
| OpenAPI contracts (descriptions) | English | Readable by any future contributor |
| Internal system logs | English | Facilitates search in library documentation and alerts |
| API error **codes** | English | e.g. `RESERVATION_SLOT_UNAVAILABLE` — consumed by code |
| API error **messages** shown to the user | Spanish | Rendered directly in the Futbolix web interface |
| Web interface copy, labels, buttons | Spanish | Futbolix users are Colombian customers and administrators |

---

## Evaluated alternatives

| Alternative | Pros | Cons | Reason for discarding |
|------------|------|------|-----------------------|
| **A — English for technical artifacts, Spanish for user-facing copy** (chosen) | Industry standard for code; one unambiguous boundary; libraries, GitHub and tooling all work in English; the product still speaks the user's language | Requires slightly more effort from team members less confident in English | — (chosen) |
| B — Everything in English, including the interface | Absolute consistency; no boundary at all | Futbolix customers are Colombian and would face an English booking form; the product becomes worse to use in exchange for internal tidiness | Rejected: it optimises for the team at the user's expense |
| C — Everything in Spanish | Natural communication with the client; domain names preserved exactly | Uncomfortable mix with language keywords (`if`, `for`, `return`); inconsistent with the library ecosystem; external contributors cannot participate; the course template requires English deliverables | Rejected |
| D — Split freely by artifact, decided case by case | Each artifact uses the most natural language for its audience | Requires constant judgement calls; domain terms accumulate two canonical names; produced exactly the mixed-language documents this ADR exists to prevent | Rejected: this is the status quo that caused the problem |

---

## Consequences

**Positive:**
- One rule with a boundary anyone can apply without asking: browser text is Spanish, everything else is English.
- Domain terms have one canonical form — the English one in the code and the glossary.
- New team members and external tooling work without friction.
- The weekly course deliverables satisfy the "English" requirement of the template by default.

**Negative / Trade-offs:**
- Team members less confident in English need to invest more initially.
- Some business terms require a deliberate translation decision (`cancha` → `court`, `horario` → `schedule`, `reserva` → `reservation`).
- The frontend needs its Spanish strings kept somewhere consistent, which is a small amount of extra structure.

**Mitigation:**
- Maintain the canonical English translation of every business term in `01-context/glossary.md`. When a term has a debatable translation, record it there before it appears in code.
- Keep Spanish interface strings in one place in the frontend rather than inline, so the boundary stays visible.

**Impact on the system:**
- **Affected services:** all four backend services and the web frontend.
- **Documents that must be updated:**
  - `00-governance/documentation-rules.md` — its language table currently says user-facing error messages are "English (or localized)". Replace with the split above.
  - `01-context/glossary.md` — is already English and is the canonical translation reference.
  - The Week 02 requirements specification (SRS v1.0) uses Spanish column names (`id_cancha`, `nombre_cliente`, `precio_hora`) while `02-domain/entities-and-rules.md` uses English (`courtId`, `hourlyPrice`). **The English names win.** The SRS must be reissued as v2.0 or explicitly marked superseded before the first Flyway migration is written.

---

## Risks

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|-----------|
| A migration is written with Spanish column names before the SRS is corrected, and data exists by the time anyone notices | Medium | High | Correct the SRS before the first migration. Review the first migration of each service specifically for naming |
| The boundary erodes — Spanish comments appear in Java, English labels appear in the UI | Medium | Medium | PR review checks it; `documentation-rules.md` makes mixed language grounds for rejection |
| A business term is translated inconsistently across services (`slot` vs `timeSlot` vs `schedule`) | Medium | Medium | The glossary is the single source of truth and must be updated before the term reaches code |
| Team members avoid writing documentation because of the English requirement | Low | Medium | Prefer imperfect English over no documentation. The rule is about consistency, not fluency |

---

## References

- Team documentation conventions → `00-governance/documentation-rules.md`
- Domain term glossary → `01-context/glossary.md`
- Weekly status template language requirement → `NN-week/hu-status/README.md`
- Related to: ADR-003 (Database per Service — schema and column naming follows this decision)
