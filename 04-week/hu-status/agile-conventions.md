# Agile Team Conventions

> Defines how the team works through its development cycles. Agreed with the whole team
> before the first sprint. Update when the team decides to change something.

---

## Sprint structure

| Field | Value |
|-------|-------|
| Duration | 1 week — **Propuesta para FUTBOLIX**, aligned with the weekly HU status deliverable required by the course |
| Sprint start | Monday |
| Sprint end | Sunday |
| Current sprint | See the most recent `NN-week/hu-status/README.md` in the repository |
| Estimated capacity | 10 story points per sprint — **Propuesta para FUTBOLIX**, to be recalibrated after 3 sprints of real velocity data |

> The sprint boundary matches the weekly status report boundary on purpose: what is closed
> during the sprint is exactly what is reported that week, so there is no reconciliation work.

---

## Ceremonies

### Sprint Planning
- **When:** Monday, at the start of the sprint
- **Duration:** Maximum 1 hour
- **Who:** Entire team
- **Goal:** Select and commit to the sprint user stories, break them down into technical tasks
- **Output artifact:** Sprint Backlog updated in GitHub Projects

### Daily Stand-up
- **When:** Every day — **Propuesta para FUTBOLIX:** asynchronous, written in the team channel before 9:00 AM
- **Duration:** Maximum 15 minutes when held synchronously
- **Format:**
  1. What did I do yesterday?
  2. What will I do today?
  3. Is anything blocking me?
- **Rule:** Technical discussions happen after the daily, not during it

> The team reported in Week 03 and Week 04 that finding a shared meeting slot is difficult
> because of work commitments. The asynchronous written format is the response to that blocker.

### Sprint Review
- **When:** Last day of the sprint
- **Duration:** Maximum 30 minutes
- **Who:** Entire team
- **Goal:** Show what was built and collect feedback
- **Output artifact:** Weekly HU status report for that week

### Sprint Retrospective
- **When:** Last day of the sprint — after the review
- **Duration:** Maximum 45 minutes
- **Format:** What went well / What to improve / Action commitments
- **Rule:** Each retro produces at least 1 improvement action with an owner and due date

### Backlog Refinement
- **When:** Mid-sprint — **Propuesta para FUTBOLIX:** Thursday
- **Duration:** Maximum 1 hour
- **Goal:** Detail and estimate user stories for the next sprint
- **Exit criterion:** The user story meets the Definition of Ready

---

## Estimation

### Scale
| Points | Meaning |
|--------|---------|
| 1 | Trivial — done in hours |
| 2 | Small — done in one day |
| 3 | Medium — takes 2–3 days |
| 5 | Large — takes almost a full sprint |
| 8 | Very large — should be split |
| 13 | Epic — MUST be split before the sprint |

**Technique:** Planning Poker — **Propuesta para FUTBOLIX**
**Tool:** GitHub Projects (story points recorded as a custom field on each item)

### Estimation rule
- If there is disagreement of 2+ levels (e.g. someone says 3 and another says 8), discuss before voting again.
- If a story is estimated at 8 or 13, it must be split into smaller sub-tasks.
- With a 1-week sprint, no single story may be estimated above 5. A 5 already consumes most of the sprint.

---

## Backlog tool

**Tool:** GitHub Projects
**Board URL:** https://github.com/users/soymiguelgomez/projects/2/views/1
**Repository:** https://github.com/soymiguelgomez/sistemas-distribuidos-2026-b-g1

### Board columns
| Column | Meaning |
|--------|---------|
| Backlog | Pending refinement |
| Ready | Ready to enter the sprint (meets DoR) |
| In Progress | Someone is actively working on it |
| In Review | In Pull Request / code review |
| Done | Meets DoD and is closed |

**Rule:** every card must map to an HU ID, and that same HU ID must appear in the weekly
status report and in the branch name (`hu-XXX-dev`). A card with no HU ID cannot enter the
sprint.

---

## Team roles

Taken from `01-context/overview.md`. The team has no sub-teams; every member contributes
across services.

| Role | Member |
|------|--------|
| Tech Lead | Hernando Antonio Martin Herrera |
| Product Owner | Danna Michelle Morales Losada |
| DevOps | Edwin Melendez Palomino |
| Developer | Miguel Andres Gomez Gutierrez |

---

## Team velocity

| Sprint | Story points completed | Notes |
|--------|----------------------|-------|
| Sprint 1 | — | Scope definition and backlog — no code |
| Sprint 2 | — | Requirements specification — no code |
| Sprint 3 | — | Strategic DDD: glossary, scope, domain map, events — no code |
| Sprint 4 | — | Tactical DDD, domain decomposition, first mockup — no code |
| Average | — | Not measurable yet; implementation starts once the domain model is frozen |

> Velocity is only meaningful once stories produce code. The first sprints produced
> documentation and design, so no points were assigned.

---

## Related documents

- Definition of Ready → `00-governance/definition-of-ready.md`
- Definition of Done → `00-governance/definition-of-done.md`
- Git conventions → `00-governance/git-conventions.md`
- Risk management → `15-project-control/risks.md`
- Technical debt backlog → `15-project-control/tech-backlog.md`
