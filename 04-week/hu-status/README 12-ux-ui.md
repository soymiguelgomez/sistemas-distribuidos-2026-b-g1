# 12 — UX/UI

> **What is this?** The user experience design: how the system looks, how it is navigated,
> and how it behaves from the end user's perspective.

## Why design comes before code

Changing a wireframe takes 5 minutes. Changing the code takes hours.
Changing the code in production with real users can cost days and reputation.

**Design first → implement later.**

---

## Two constraints that govern every screen

1. **Customers have no account.** No registration, no login, no session, no profile. The
   reservation code replaces all of it.
2. **There are no notifications.** Nothing is emailed or messaged. If the customer does not
   see it on screen, they never see it.

Together these mean the confirmation screen carries more weight in Futbolix than in a normal
booking product: it is the only moment the customer receives the key to their own reservation.

---

## Status of this section

| File | Status | Notes |
|------|--------|-------|
| `navigation-map.md` | Complete | Routes, access matrix, flows, MVP 1 / MVP 2 split |
| `design-system.md` | Complete | Tokens derived from the approved mockup; domain status colours defined |
| `wireframes.md` | **Not created** | The six customer-flow screens are not designed yet |
| `mockups/` | **Not created** | The Figma link must be exported here as images |

---

## The mockup does not yet match the documentation

The approved interactive mockup covers the **administration panel**, which is MVP 2. The
MVP 1 walking skeleton is the **customer reservation flow**, and those screens do not exist
in the mockup yet.

**Corrections needed in the existing mockup:**

| Issue | Where | Fix |
|-------|-------|-----|
| It shows three courts | "Administración eficiente de 03 canchas", "03 canchas disponibles", three cards | The facility has **four**. Add the fourth card and correct both texts |
| "Clientes registrados: 125" | Daily summary panel | There are no registered customers. Replace with a metric that exists, e.g. "Reservas del mes" |
| "Reportes" in the sidebar | Navigation | Advanced reporting is out of MVP scope. Remove it or mark it H2 |
| "Configuración" in the sidebar | Navigation | Not in the MVP scope either. Confirm what it would contain or remove it |

**Screens still missing, all of them MVP 1:**

1. Landing with the four courts
2. Availability grid: court + date, free and taken slots
3. Booking details: duration, live amount, contact form
4. Confirmation with the reservation code
5. **Booking failed on slot conflict (409)** — the screen shown during the live demo
6. Reservation lookup by code

> Screen 5 is the one to design carefully. It is the visible proof of the no-double-booking
> invariant and the most technically interesting moment of the sustentación. A generic error
> toast wastes it.

**Sharing:** set the Figma link to public. Anyone opening it without a Figma account currently
hits a login wall. Export PNGs into `12-ux-ui/mockups/` as well — a Figma link can expire or
change; the repository is the evidence that survives.

---

## What is here and how to fill it in

### `navigation-map.md` ⭐ (Start here)
The map of all screens and how they connect: navigation tree, access matrix, user flows and
navigation rules.

### `wireframes.md`
Low-fidelity designs of the main screens. Structure, not colours. ASCII, Figma or Balsamiq.

### `design-system.md`
Tokens, components and patterns: colour palette, typography, spacing, base components, domain
status colours, error handling and accessibility minimums.

---

## Language of the interface

Per ADR-001: **route names and code are English, visible text is Spanish.**

`/booking/availability` is the route; "Disponibilidad" is the heading. Futbolix users are
Colombian and the booking form must be in their language; the code stays consistent with the
Java and React ecosystem.

---

## Correlations with other sections

| This section is fed by... | And feeds into... |
|---------------------------|-------------------|
| `04-requirements/user-stories.md` → what flows exist | Screens implementing each HU |
| `02-domain/entities-and-rules.md` → what data to display and what to validate | Fields and form rules in the wireframes |
| `01-context/scope.md` → what is out of scope | Routes that deliberately do not exist |
| `09-microservices/` → what APIs the frontend consumes | What data arrives at each screen |
| `00-governance/security-rules.md` → input validation and the code as a secret | Form rules and the lookup screen |

---

## Questions this section must answer

**How many screens does the system have?**
Sixteen routes, of which eight belong to MVP 1. See the screen map.

**How does each type of user navigate?**
The customer never authenticates and moves linearly through the reservation flow. The
administrator authenticates once and works from a dashboard.

**What visual components are repeated?**
Status badges (reservation, payment and court), the availability slot grid, the reservation
code block, and the admin data table.

**What is the system's visual language?**
Pitch green for actions, navy for surfaces, amber for emphasis only. Status is never
communicated by colour alone.
