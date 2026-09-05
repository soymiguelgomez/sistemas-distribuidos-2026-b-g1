# Technical Security Rules

> Mandatory technical controls that apply to all project code.
> These rules complement the security policy (`security-policy.md`) with
> concrete implementation practices.

> **Stack:** Java 21 + Spring Boot 3.x + Spring Security + Spring Data JPA on the backend,
> React + Vite on the frontend. All backend examples below are Java.

---

## OWASP Top 10 — Controls per category

### A01 — Broken Access Control

```java
// ❌ BAD — trusting an identifier sent by the client
public ReservationResponse cancel(CancelRequest request) {
    return service.cancel(request.reservationId(), request.userId());
}

// ✅ GOOD — the administrator identity comes from the verified JWT
public ReservationResponse cancel(CancelRequest request,
                                  @AuthenticationPrincipal AdminPrincipal principal) {
    return service.cancel(request.reservationId(), principal.getId());
}
```

**Rules:**
- Every administrative endpoint MUST be behind Spring Security; the public customer endpoints are the explicit exception and must be listed one by one in the security configuration
- Permissions are verified in the use case (application layer), not in the REST controller
- A resource is only returned if the administrator holds the matching `[resource]:read` permission
- Write actions require `[resource]:write`
- There is no `courts:create` or `courts:delete`. The four courts are seeded by migration

**Futbolix-specific:** the reservation lookup endpoint is public. It must return a reservation
only when the correct reservation code is supplied, and it must never allow listing or
enumerating reservations.

### A02 — Cryptographic Failures

**Rules:**
- Administrator passwords: `BCryptPasswordEncoder` with strength ≥ 12. Never MD5 or SHA-1
- JWTs: sign with RS256 (asymmetric). Never HS256 with a weak secret
- Sensitive data in transit: HTTPS mandatory in all environments except local
- Never log passwords, tokens, Wompi keys, or customer contact data
- The reservation code must be generated with `SecureRandom`, never with `Math.random()`, a sequential counter or a timestamp

```java
// ✅ Reservation code — unguessable
private static final SecureRandom RANDOM = new SecureRandom();

public static String generate() {
    byte[] bytes = new byte[8];
    RANDOM.nextBytes(bytes);
    return HexFormat.of().formatHex(bytes).toUpperCase();
}
```

### A03 — Injection

**SQL:**
```java
// ❌ BAD — direct concatenation
String sql = "SELECT * FROM reservations WHERE court_id = '" + courtId + "'";
entityManager.createNativeQuery(sql).getResultList();

// ✅ GOOD — Spring Data JPA derived query
List<ReservationEntity> findByCourtIdAndReservationDateAndStatusIn(
        UUID courtId, LocalDate date, Collection<ReservationStatus> statuses);

// ✅ GOOD — explicit named parameters
@Query("SELECT r FROM ReservationEntity r WHERE r.courtId = :courtId AND r.reservationDate = :date")
List<ReservationEntity> findForDate(@Param("courtId") UUID courtId, @Param("date") LocalDate date);
```

**Rules:**
- Bound parameters ALWAYS. Zero concatenated strings in JPQL or native SQL
- Validate all inputs with Jakarta Bean Validation before they reach the domain
- Enable `spring.jpa.open-in-view=false` so lazy loading cannot happen in the view layer

### A04 — Insecure Design

- Every HU that exposes customer data must undergo a privacy review
- Bulk query endpoints have mandatory pagination (maximum 100 records per page)
- Do not expose sequential internal IDs; use UUIDs
- The reservation amount is always computed server-side as `hourly price x number of hours`. An amount supplied by the client is discarded
- The no-double-booking rule is enforced by a database unique constraint, not only by application code. Application-level checks lose races

### A05 — Security Misconfiguration

```
# Verification checklist per environment
□ Stack traces NOT visible outside local (server.error.include-stacktrace=never)
□ Spring Boot Actuator: only /health and /info exposed publicly
□ Security headers configured through Spring Security:
  - X-Content-Type-Options: nosniff
  - X-Frame-Options: DENY
  - Content-Security-Policy defined
  - Strict-Transport-Security outside local
□ CORS restricted to the Futbolix frontend origin, not "*"
□ spring.jpa.hibernate.ddl-auto=validate — schema changes only through Flyway
□ Unnecessary ports closed in docker-compose
□ Development credentials NOT used outside local
```

### A06 — Vulnerable Components

**Rules:**
- Run OWASP Dependency-Check (`mvn dependency-check:check`) in CI before each release
- **Critical/High** vulnerabilities block the deploy
- Renew dependencies each sprint (at least once)
- Pin exact versions in `pom.xml`; rely on the Spring Boot BOM rather than floating versions
- Pin Docker base images by digest, not by `latest`

### A07 — Identification and Authentication Failures

- JWT with maximum expiration of **1 hour** for access tokens
- Refresh tokens with expiration of **7 days** and rotation on each use
- Rate limiting on the administrator login endpoint: maximum 10 attempts per IP in 5 minutes
- Account lockout after 5 consecutive failed attempts
- Rate limiting on the public reservation creation and reservation lookup endpoints, to prevent
  reservation-code brute forcing and availability scraping

> There is no customer login, so there is no customer credential to leak. The trade-off is that
> the public endpoints are the abuse surface and need rate limiting instead.

### A08 — Software and Data Integrity Failures

- **Wompi webhooks must have their signature verified before the payload is trusted.** An
  unverified webhook is discarded and logged as `PAYMENT_WEBHOOK_SIGNATURE_INVALID`
- The webhook handler must be idempotent: the same Wompi transaction result received twice
  confirms the reservation once
- Verify Docker image digests before use
- Validate that messages consumed from RabbitMQ match the expected schema before processing

```java
// ✅ Verify first, act second
@PostMapping("/api/payments/wompi/webhook")
public ResponseEntity<Void> handle(@RequestBody String rawBody,
                                   @RequestHeader("X-Event-Checksum") String signature) {
    if (!wompiSignatureVerifier.isValid(rawBody, signature)) {
        securityLog.record(SecurityEvent.PAYMENT_WEBHOOK_SIGNATURE_INVALID);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
    webhookHandler.handle(rawBody);
    return ResponseEntity.ok().build();
}
```

### A09 — Security Logging and Monitoring Failures

- Every failed authentication must be logged with IP, timestamp, and user-agent
- Log administrative write operations with who, when, and what changed
- Security logs are retained for a minimum of **90 days**
- Customer name, phone and email must never appear in application logs
- Automatic alerts configured for:
  - More than 50 401/403 responses in 5 minutes
  - Any invalid Wompi webhook signature
  - Dead Letter Queue depth greater than 0

### A10 — Server-Side Request Forgery (SSRF)

- The backend makes outbound calls to exactly one external host: Wompi. Its base URL comes from configuration and is validated against an allowlist
- Do not build outbound URLs from user input
- Do not fetch from private IP ranges (192.168.x.x, 10.x.x.x, 127.x.x.x) from the server

---

## User input handling

```java
// Request record with Bean Validation — validated at the adapter layer
public record CreateReservationRequest(
    @NotNull UUID courtId,
    @NotNull @FutureOrPresent LocalDate reservationDate,
    @NotNull LocalTime startTime,
    @NotNull LocalTime endTime,
    @NotBlank @Size(max = 120) String customerName,
    @NotBlank @Pattern(regexp = "^\\+?[0-9]{7,15}$") String customerPhone,
    @NotBlank @Email @Size(max = 255) String customerEmail
) { }
```

**Rule:** All external inputs (HTTP body, query params, path params, RabbitMQ messages, Wompi
webhooks) pass through validation before reaching the domain. The domain assumes its inputs are
already well formed and enforces business invariants, not syntax.

---

## Secure error handling

```java
// ❌ BAD — exposes internal details
@ExceptionHandler(Exception.class)
public ResponseEntity<Map<String, Object>> handle(Exception ex) {
    return ResponseEntity.status(500).body(Map.of(
        "error", ex.getMessage(),
        "stack", Arrays.toString(ex.getStackTrace())));
}

// ✅ GOOD — generic message + traceId for internal correlation
@ExceptionHandler(Exception.class)
public ResponseEntity<ErrorResponse> handle(Exception ex, HttpServletRequest request) {
    String traceId = request.getHeader("X-Trace-Id");
    log.error("Unhandled exception, traceId={}", traceId, ex);
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
        .body(new ErrorResponse("INTERNAL_SERVER_ERROR", "Internal server error", traceId));
}
```

**Rule:** an error returned to the customer must never reveal whether a reservation code exists,
which court is booked by whom, or any internal identifier.

---

## Correlations

- Security policy (management, access, secrets) → `00-governance/security-policy.md`
- System threat model → `05-architecture/security-threat-model.md`
- Authentication and JWT → `07-api/authentication.md`
- Observability and security logs → `13-operations/observability.md`
- Domain invariants these rules protect → `02-domain/entities-and-rules.md`
