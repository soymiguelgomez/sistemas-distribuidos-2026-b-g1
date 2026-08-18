<!-- HU-STATUS TEMPLATE - do NOT remove the <!-- ... --> markers or the table headers.
     Your weekly grade is read AUTOMATICALLY from this file:
       02-week/hu-status/README.md  (inside YOUR fork). English. -->

# Weekly Status - Week 02

<!-- CONFIG-START - must match your profile repo (username/username) CONFIG -->
- FULL_NAME: Miguel Andrés Gómez Gutiérrez
- GITHUB_USER: soymiguelgomez
- TEAM:  Sistemas Distribuidos
- SPRINT_GOAL:Definir y estructurar los requerimientos funcionales y no funcionales del sistema web de administración y reserva de cuatro canchas de fútbol.
<!-- CONFIG-END -->

## 1. User stories worked this week
| HU ID | Title | Status (todo/doing/done) | Evidence (PR or commit URL) |
HU-XXX-001
Documentación y especificación de requerimientos del sistema
done
https://github.com/users/soymiguelgomez/projects/2/views/

## 2. My individual contribution
-Participación en la elaboración de la especificación de requerimientos del sistema web de administración y reserva de cuatro canchas de fútbol.
-Definición y documentación de los requerimientos funcionales relacionados con consulta de canchas, tarifas, disponibilidad, selección de fecha y horario, registro de clientes, creación de reservas, cálculo del valor, pagos y confirmación de reservas.
-Apoyo en la definición de los requerimientos no funcionales relacionados con usabilidad, rendimiento, seguridad, consistencia, disponibilidad, compatibilidad, escalabilidad, API, persistencia y mantenibilidad.
-Participación en la definición de reglas de negocio, casos de uso, criterios de aceptación y trazabilidad.
-El documento establece que el sistema estará compuesto por frontend, API/backend, módulo de reservas y pagos y base de datos, con comunicación mediante API REST.

## 3. Blockers and risks
-Los endpoints definitivos de la API todavía deben establecerse durante el diseño técnico.
-La pasarela de pago y el proveedor de pagos aún no están definidos.
-Las políticas de cancelación y reembolso están pendientes de definición.
-Los horarios concretos de operación y los precios definitivos de las canchas aún no están determinados.
-La infraestructura de despliegue, configuración del servidor, cantidad máxima de usuarios concurrentes y disponibilidad porcentual del servicio están pendientes de definición.
-Se debe garantizar que no sea posible registrar dos reservas para la misma cancha, fecha y horario.

## 4. Plan for next week
-Refinar las User Stories a partir de los 17 requerimientos funcionales definidos.
-Definir los criterios de aceptación específicos para cada User Story.
-Establecer la estructura técnica del frontend, backend/API, módulo de reservas y pagos y base de datos.
-Definir los endpoints definitivos de la API REST.
-Diseñar y/o implementar el modelo de base de datos para CANCHA, HORARIO, RESERVA y PAGO.
-Crear las ramas correspondientes a las User Stories y realizar los Pull Requests hacia el ambiente definido por el equipo.

## 5. Compliance self-check
- [ ] Conventional Commits - `type(scope): summary`
- [ ] Per-environment HU branch + PR to that environment (hu-xxx-dev -> develop, ...)
- [ ] Testable acceptance criteria
- [ ] Tests added/updated (unit / integration)
- [ ] DDD / hexagonal boundaries respected (domain has no I/O)
- [ ] No secrets; config via environment variables

## 6. Evidence links
-GitHub Project: https://github.com/users/soymiguelgomez/projects/2/views/1
-Documento de requerimientos: Sistema Web de Administración y Reserva de Canchas de Fútbol, versión 1.0.
