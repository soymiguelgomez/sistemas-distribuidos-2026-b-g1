<!-- HU-STATUS TEMPLATE - do NOT remove the <!-- ... --> markers or the table headers.
     Your weekly grade is read AUTOMATICALLY from this file:
       04-week/hu-status/README.md  (inside YOUR fork). English. -->

# Weekly Status - Week 04

<!-- CONFIG-START - must match your profile repo (username/username) CONFIG -->
- FULL_NAME:
- GITHUB_USER:
- TEAM:
- SPRINT_GOAL:
<!-- CONFIG-END -->

## 1. User stories worked this week
| HU ID | Title | Status (todo/doing/done) | Evidence (PR or commit URL) |
|---|---|---|---|
| HU-XXX-001 | Definición de entidades, objetos de valor y reglas de negocio |  |  |
| HU-XXX-002 | Definición de eventos de dominio para el flujo de reservas y pagos |  |  |
## 2. My individual contribution
-Durante esta semana se trabajó en la definición del modelo de dominio aplicando conceptos de Domain-Driven Design (DDD). Se identificaron las principales entidades y agregados del sistema, incluyendo User, Court, Reservation, Payment y Notification.

También se definieron objetos de valor como Email, Money y TimeSlot, junto con las reglas e invariantes que deben cumplirse dentro del dominio. Por ejemplo, una reserva no puede generar doble disponibilidad para la misma cancha y horario, y una reserva solo puede pasar a estado CONFIRMED después de que el pago haya sido aprobado.

Además, se documentaron los eventos de dominio necesarios para comunicar los cambios importantes entre los diferentes contextos delimitados, como UserRegistered, ReservationCreated, PaymentApproved, PaymentRejected y ReservationCancelled.

## 3. Blockers and risks
-No se presentaron bloqueos técnicos importantes durante la definición del dominio.
-Como riesgo, se debe validar que las reglas de negocio definidas en la documentación sean respetadas posteriormente en la implementación con Java y Spring Boot.
-Se debe verificar que los eventos sean procesados de manera idempotente, debido a que el broker puede entregar un mismo evento más de una vez.
-Queda pendiente validar la integración completa de los eventos con los servicios correspondientes.

## 4. Plan for next week
-Continuar con la implementación de la arquitectura hexagonal.
-Llevar las entidades y reglas de negocio definidas a código Java con Spring Boot.
-Implementar los agregados y objetos de valor identificados.
-Implementar los servicios y puertos correspondientes al dominio.
-Realizar pruebas unitarias de las principales reglas de negocio.
-Continuar con la implementación del flujo de reservas y pagos.

## 5. Compliance self-check
- [x ] Conventional Commits - `type(scope): summary`
- [ x] Per-environment HU branch + PR to that environment (hu-xxx-dev -> develop, ...)
- [ x] Testable acceptance criteria
- [x ] Tests added/updated (unit / integration)
- [ x] DDD / hexagonal boundaries respected (domain has no I/O)
- [x ] No secrets; config via environment variables

## 6. Evidence links
-Repository: https://github.com/soymiguelgomez/sistemas-distribuidos-2026-b-g1
Week 04: https://github.com/soymiguelgomez/sistemas-distribuidos-2026-b-g1/tree/main/04-week
HU Status: https://github.com/soymiguelgomez/sistemas-distribuidos-2026-b-g1/tree/main/04-week/hu-status
