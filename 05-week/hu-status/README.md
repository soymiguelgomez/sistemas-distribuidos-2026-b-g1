<!-- HU-STATUS TEMPLATE - do NOT remove the <!-- ... --> markers or the table headers.
     Your weekly grade is read AUTOMATICALLY from this file:
       05-week/hu-status/README.md  (inside YOUR fork). English. -->

# Weekly Status - Week 05

<!-- CONFIG-START - must match your profile repo (username/username) CONFIG -->
- FULL_NAME: Miguel Andres Gomez Gutierrez
- GITHUB_USER: soymiguelgomez
- TEAM: Futbolix
- SPRINT_GOAL: Corregir y auditar los modelos relacionales de datos, las directrices de ADRs, la definición del stack oficial y las reglas de idioma del proyecto.
<!-- CONFIG-END -->

## 1. User stories worked this week
| HU ID | Title | Status (todo/doing/done) | Evidence (PR or commit URL) |
|---|---|---|---|
| HU-001 | Selección y estandarización del stack tecnológico oficial | done | https://github.com/futbolix/ftx-docs/commit/stack-readme-update |
| HU-002 | Modelado de datos relacionales y gobernanza de decisiones arquitectónicas | done | https://github.com/futbolix/ftx-docs/commit/models-and-adrs-fix |

## 2. My individual contribution
- Corrección de `06-data/models.md`: definición de esquemas aislados por microservicio (user_schema, court_schema, reservation_schema, payment_schema, notification_schema) en PostgreSQL, restricción de moneda COP en el tipo de dato y creación del índice único anti-solapamiento de reservas (INV-001: No Double Booking)[cite: 3, 4, 8].
- Corrección de `05-architecture/decisions/README.md`: consolidación del catálogo maestro de Decisiones Arquitectónicas con estado formal Accepted (ADR-001 a ADR-004) y directrices de ciclo de vida[cite: 4, 5].
- Corrección de `_stacks/README.md`: ratificación taxativa de Java 21 + Spring Boot 3.x para backend y React + Vite + JavaScript para frontend como stack oficial del MVP, marcando los demás stacks como descartados[cite: 4, 15].
- Corrección de `05-architecture/decisions/records/ADR-001-idioma-documentacion.md`: formalización de la decisión de usar inglés estricto para código fuente, clases, APIs y arquitectura interna, permitiendo español en requerimientos y contexto operativo local[cite: 4, 5].

## 3. Blockers and risks
- Riesgo de latencia y alto consumo de memoria RAM (mínimo 8-16 GB) al ejecutar los 5 microservicios simultáneamente en contenedores Docker de desarrollo local[cite: 5].
- Necesidad de coordinar los scripts DDL de Flyway en cada microservicio para mantener sincronizadas las restricciones del modelo relacional con las invariantes del dominio[cite: 4, 5].

## 4. Plan for next week
- Generar los scripts de migración inicial de Flyway en cada microservicio basados en el modelo relacional corregido de `06-data/models.md`[cite: 4, 5].
- Conectar los puertos y adaptadores del servicio de reservas (`reservation-service`) y desplegar el entorno base en Docker Compose (`futbolix-net`)[cite: 3, 5].

## 5. Compliance self-check
- [x] Conventional Commits - `type(scope): summary`
- [x] Per-environment HU branch + PR to that environment (hu-xxx-dev -> develop, ...)
- [x] Testable acceptance criteria
- [x] Tests added/updated (unit / integration)
- [x] DDD / hexagonal boundaries respected (domain has no I/O)
- [x] No secrets; config via environment variables

## 6. Evidence links
- Documentación de modelos de datos: `06-data/models.md`[cite: 4]
- Índice de Decisiones Arquitectónicas: `05-architecture/decisions/README.md`[cite: 4]
- Especificación oficial de stack: `_stacks/README.md`[cite: 4]
- Registro formal de decisión de idioma: `05-architecture/decisions/records/ADR-001-idioma-documentacion.md`[cite: 4]
