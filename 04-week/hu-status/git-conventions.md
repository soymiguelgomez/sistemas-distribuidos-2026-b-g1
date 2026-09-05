# Git Conventions

> **Read this document before making your first commit on the project.**

## Branch strategy

```
main        ← Production. Merge from dev only. Always stable.
  └── dev   ← Continuous integration. Merge from HU branches.
        └── hu-XXX-dev            ← One branch per user story
        └── fix/[description]     ← One branch per bugfix
        └── chore/[description]   ← Infrastructure, docs, dependency changes
        └── hotfix/[description]  ← Urgent fixes directly to main
```

**Rules:**
- Nobody commits directly to `main` or `dev`
- Every user story = one branch + one Pull Request
- One branch = one user story (do not mix different features)
- Branches are deleted after merge
- The environment suffix in the branch name must match the target branch of the PR:
  `hu-001-dev` → PR to `dev`

> The integration branch is named **`dev`**, not `develop`. Use exactly `dev` in branch names,
> PR targets and CI configuration.

---

## Branch naming format

### User story branches

```
hu-[number]-[environment]

Examples:
hu-001-dev
hu-004-dev
hu-012-dev
```

### Other branches

```
[type]/[description-in-kebab-case]

Examples:
fix/reservation-overlap-validation
chore/update-spring-boot-dependencies
hotfix/expired-jwt-not-rejected
```

---

## Commit format (Conventional Commits)

```
[type]([scope]): [lowercase description, imperative mood, no trailing period]

[optional body — explain WHY, not what]

[optional footer — issue/user story references]
```

**Types:**
| Type | When to use |
|------|-------------|
| `feat` | New functionality |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, whitespace (no logic change) |
| `refactor` | Code refactoring without behavior change |
| `test` | Add or modify tests |
| `chore` | Tooling, dependencies, CI |
| `perf` | Performance improvement |

**Scopes** — one per Futbolix service, taken from `01-context/overview.md`:

| Scope | Applies to |
|-------|-----------|
| `user` | user-service (administrator authentication) |
| `court` | court-service |
| `reservation` | reservation-service |
| `payment` | payment-service (Wompi integration) |
| `web` | React + Vite frontend |
| `infra` | Docker, Docker Compose, CI/CD |
| `docs` | Project documentation |

**Examples:**
```
feat(court): add availability query by date and time slot

fix(reservation): reject overlapping slots on the same court and date
Closes #42

feat(payment): verify wompi webhook signature before processing

docs(domain): update reservation invariants for multi-hour slots

chore(deps): upgrade Spring Boot to 3.2.0

test(reservation): add concurrency test for the no-double-booking invariant
```

---

## Pull Request policy

- **Size:** maximum 400 lines of code (excluding tests). If larger, split it.
- **Reviewers:** minimum 1 approval before merging
- **Review time:** reviewer has a maximum of 24 business hours
- **Template:** use the template at `.github/pull_request_template.md`
- **Green CI:** merge only proceeds if all pipeline checks pass
- **Target branch:** `dev` for user stories; `main` only for releases and hotfixes
- **Definition of Done:** the PR cannot be merged unless the story meets
  `00-governance/definition-of-done.md`

---

## Merge policy

- Use **Squash and Merge** for user stories (keeps `dev` history clean)
- Use **Merge Commit** for releases from `dev` to `main` (preserves full history)
- **Do not** use Rebase & Merge (creates confusion in shared history)

---

## Tags and versioning

Follow [SemVer](https://semver.org/): `MAJOR.MINOR.PATCH`

The current project version is `v0.1.0` as recorded in `01-context/overview.md`.

```bash
# When promoting dev to main
git tag -a v0.2.0 -m "Release v0.2.0: availability query and reservation creation"
git push origin v0.2.0
```

---

## Correlations

- Agile conventions → `00-governance/agile-conventions.md`
- Definition of Done → `00-governance/definition-of-done.md`
- Documentation rules → `00-governance/documentation-rules.md`
