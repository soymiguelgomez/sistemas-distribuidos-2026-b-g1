<!-- HU-STATUS TEMPLATE - do NOT remove the <!-- ... --> markers or the table headers.
     Your weekly grade is read AUTOMATICALLY from this file:
       01-week/hu-status/README.md  (inside YOUR fork). English. -->

# Weekly Status - Week 01

<!-- CONFIG-START - must match your profile repo (username/username) CONFIG -->
- FULL_NAME:Miguel Andres Gomez Gutierrez
- GITHUB_USER:soymiguelgomez
- TEAM: Futbol_mania
- SPRINT_GOAL:Define the initial product scope, organize the user story backlog, establish the project architecture, and prepare the development workflow for the Soccer Field Management SaaS.
<!-- CONFIG-END -->

## 1. User stories worked this week
HU ID	Title	Status (todo/doing/done)	Evidence (PR or commit URL)
HU-001	Register a Business	todo	
HU-002	Configure a Soccer Field	todo	
HU-003	Configure Pricing	todo	
HU-004	View Booking Calendar	todo	
HU-005	Create a Booking	todo	
HU-006	Prevent Double Bookings	todo	
HU-007	Register a Customer	todo	
HU-008	View Customer History	todo	
HU-009	Record a Deposit	todo	
HU-010	Record Full Payment	todo	
HU-011	Record Payment Methods	todo	
HU-012	View Daily Cash Flow	todo	
HU-013	Record an Expense	todo	
HU-014	Close the Cash Register	todo	
HU-015	View Business Dashboard	todo	
HU-016	View Field Occupancy	todo	
HU-017	Identify Most Profitable Time Slots	todo	
HU-018	View Public Availability	todo	
HU-019	Book a Soccer Field Online	todo	
HU-020	Receive Booking Confirmation	todo	
HU-021	Create an Employee Account	todo	
HU-022	Manage User Permissions	todo	
HU-023	Select a Subscription Plan	todo	
HU-024	Manage Subscription Status	todo	

## 2. My individual contribution
-Defined the initial scope of the Soccer Field Management SaaS.
Identified the main system roles: owner, administrator/receptionist, employee, customer, and super administrator.
Defined the initial user story backlog for the platform.
Organized the backlog into functional areas such as business management, field management, booking management, customer management, payments, financial management, reporting, user management, and SaaS subscriptions.
Prioritized the initial MVP functionality.
Defined the initial multi-tenant SaaS approach so multiple soccer field businesses can use the same platform.
Prepared the weekly status structure and development tracking process.
Reviewed the main business rules, especially booking availability and prevention of double bookings.

## 3. Blockers and risks
-No major technical blockers identified during Week 01.
The final technology stack and project architecture still need to be confirmed.
Payment gateway and WhatsApp integration requirements need further analysis.
Business rules for pricing, cancellation policies, deposits, refunds, and booking duration need to be finalized.
Multi-tenant data isolation must be carefully designed to prevent one business from accessing another business's data.
The subscription model and limitations for each SaaS plan still need to be defined.

## 4. Plan for next week
-Set up the initial project structure and development environment.
Define the technical architecture and module boundaries.
Configure the database and initial domain entities.
Implement the authentication and authorization foundation.
Create the business/tenant management module.
Start implementation of HU-001 — Register a Business.
Start implementation of HU-002 — Configure a Soccer Field.
Define and implement testable acceptance criteria for the first user stories.
Add initial unit and integration tests.
Create the required Git branches and pull requests following the team's branching strategy.
Configure environment variables and project configuration without exposing secrets.

## 5. Compliance self-check
- [ ] Conventional Commits - `type(scope): summary`
- [ ] Per-environment HU branch + PR to that environment (hu-xxx-dev -> develop, ...)
- [ ] Testable acceptance criteria
- [ ] Tests added/updated (unit / integration)
- [ ] DDD / hexagonal boundaries respected (domain has no I/O)
- [ ] No secrets; config via environment variables

## 6. Evidence links
-
