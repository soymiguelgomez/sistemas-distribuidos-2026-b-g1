# Documentation Rules

> These rules determine how documentation is written, organized, and maintained in this project.
> Documentation that does not follow these rules may be rejected in code review.

---

## Core principle

> **"Documentation is code. If it's not up to date, it's broken."**

Every HU that modifies system behavior MUST include updating the affected documents.
The DoD requires it.

---

## Language

| Artifact | Language |
|----------|----------|
| Source code (variables, functions, classes) | English |
| Code comments | English |
| Commits | English (Conventional Commits) |
| Branch names | English |
| Markdown documentation | English |
| OpenAPI contracts (descriptions) | English |
| Error messages returned to frontend | English |
| Internal system logs | English |

> **Rule:** Once the language for each category is chosen, it is binding for the entire project.
> Mixing languages in the same category is grounds for PR rejection.

---

## Programming language in documentation

Futbolix backend code is **Java 21 + Spring Boot 3.x**; the frontend is **React + Vite +
JavaScript**. Documentation examples must use the language of the layer being documented.

> **Rule:** do not illustrate backend rules with Node.js, TypeScript or npm examples. A backend
> example written in TypeScript is misleading, because none of those libraries exist in this
> project. If pseudo-code is used to explain a language-independent concept (for example a DDD
> building block), say so explicitly in the document.

---

## File structure

```
Each section has its README.md that explains the folder's purpose.
Content documents use kebab-case.md (e.g.: domain-map.md, risk-register.md).
Templates are prefixed with _ to appear first (e.g.: _template-hu.md, _template-adr.md).
ADRs are numbered sequentially: ADR-001-short-title.md.
```

---

## What to document and what NOT to

### DO document

| What | Where |
|------|-------|
| Non-obvious architectural decisions | `05-architecture/decisions/records/ADR-NNN.md` |
| Business rules and domain invariants | `02-domain/entities-and-rules.md` |
| Domain events and their consumers | `02-domain/domain-events.md` |
| API contracts for each service | `07-api/contracts/openapi/[service].yaml` |
| Data model changes | `06-data/models.md` |
| Operational procedures | `13-operations/` |
| Identified risks | `15-project-control/risks.md` |
| Terms whose meaning is not obvious | `01-context/glossary.md` |

### DO NOT document

- What the code already says clearly (do not repeat in comments what can be read in the code)
- Temporary decisions or experiments that will be reverted
- Implementation details of external libraries (those have their own documentation)
- Change history (that's what git log is for)
- Secrets, credentials, API keys or Wompi tokens — under any circumstance

---

## Owners per section

| Section | Owner | Review frequency |
|---------|-------|-----------------|
| `00-governance/` | Tech Lead | Start of each sprint |
| `01-context/` | Tech Lead + PO | When the scope changes |
| `02-domain/` | Tech Lead + PO | When the domain changes |
| `03-product/` | Product Owner | Each sprint |
| `04-requirements/` | Product Owner | Each sprint |
| `05-architecture/` | Tech Lead | Each design decision |
| `07-api/contracts/` | Service-owning developer | Each API change |
| `09-microservices/` | Service-owning developer | Each release |
| `13-operations/` | DevOps | After each incident |
| `15-project-control/` | Tech Lead | Weekly review |

---

## Document format

### Headings
- `# H1` — only one per file; it is the title
- `## H2` — main sections
- `### H3` — subsections
- Do not use H4 or deeper; if you need it, the document has too much hierarchy

### Tables
Use tables for comparisons, registers, and matrices. Do not use tables for simple lists.

### Code
Always use code blocks with the language specified:
````
```java
public record TimeSlot(LocalTime startTime, LocalTime endTime) { }
```
````

### Template instructions
Blocks marked `> [!NOTE] INSTRUCTIONS`, and any workshop or "how to fill this in" guidance
inside a content document, indicate the document is an unfilled template.
Remove them when the document is complete. Guidance belongs in the section `README.md`, not in
the content document.

---

## Consistency rules

These facts appear in many documents. When one changes, all of them change in the same PR:

| Fact | Value |
|------|-------|
| Number of courts | Exactly four, fixed |
| Customer accounts | None. Customers do not register or log in |
| Payments | Real, through Wompi in sandbox/test mode |
| Notifications | Out of MVP scope |
| Reservation duration | One or more whole hours |
| Integration branch | `dev` |

> Before merging, grep the repository for the fact you changed. A number that appears in five
> documents and is updated in one is worse than not documenting it at all.

---

## Update process

1. The developer identifies which documents their change affects
2. Updates the documents together with the code (same PR)
3. The reviewer verifies the documentation is up to date
4. If the PR closes a HU that had API impact → the OpenAPI contract must be updated

---

## Correlations

- Git conventions → `00-governance/git-conventions.md`
- Per-microservice documentation standard → `00-governance/microservices-documentation.md`
- Definition of Done (docs as part of DoD) → `00-governance/definition-of-done.md`
