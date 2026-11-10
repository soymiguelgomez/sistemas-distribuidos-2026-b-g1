# CP4 - How to run the security gates

## What the negative test proves

Threat: **S (risk 9)** in `05-architecture/security/stride-soymiguelgomez.md` (ftx-docs PR #55).
A component that is not `payment-service` publishes a forged `PaymentApproved` on
`futbolix.events` and `PaymentApprovedConsumer` confirms an unpaid reservation.

Mitigation under test: one RabbitMQ user per service with topic permissions, plus the
validated AMQP `user_id` property.

`BrokerAuthorizationNegativeTest` (in `broker-authz-test/`) starts RabbitMQ 3.13 with
Testcontainers, creates the users `reservation-service` and `payment-service` with
least-privilege permissions, and checks:

| Test | Expected |
|---|---|
| `reservationServiceCannotPublishPaymentApproved` | Broker closes the channel with **403 ACCESS_REFUSED** |
| `reservationServiceCannotImpersonatePaymentService` | Publishing with `user_id = payment-service` is refused with **406 PRECONDITION_FAILED** |
| `paymentServiceCanPublishPaymentApproved` | Publish confirmed (control case, so the 403 is not a broken setup) |

It covers the acceptance criterion "an automated test shows that `reservation-service`
gets 403 when it publishes `payment.approved`" of the [security] story for threat S.

## Run it locally

Requires Docker running.

With JDK 21 and Maven:

```bash
cd 13-week/workshop/04-security-ci/broker-authz-test
mvn test -Dtest='*NegativeTest'
```

Without Java on the machine (Windows, Docker Desktop):

```bash
docker run --rm -v //var/run/docker.sock:/var/run/docker.sock -v "${PWD}:/w" -w /w -e TESTCONTAINERS_HOST_OVERRIDE=host.docker.internal maven:3.9.9-eclipse-temurin-21 mvn -B test -Dtest='*NegativeTest'
```

## Workflow

`security.yml` runs on every pull request to `develop`, `qa` and `main`:

1. `secret-scan`: gitleaks over the commits of the pull request.
2. `dependency-audit`: OWASP dependency-check, fails on CVSS >= 7 (needs the `NVD_API_KEY` secret).
3. `authorization-tests`: the negative tests above.

## Console output (CP8)

Where it ran: GitHub Actions, `ubuntu-latest`, workflow `.github/workflows/w13-negative-test.yml`
in this fork, run https://github.com/soymiguelgomez/sistemas-distribuidos-2026-b-g1/actions/runs/42843284626
on 2026-11-10. My laptop cannot run Docker today: WSL and Virtual Machine Platform are disabled in
Windows, and turning them on needs an administrator and a restart.

Negative test (`mvn -B test -Dtest='*NegativeTest'`):

```text
[INFO]  T E S T S
[INFO] -------------------------------------------------------
[INFO] Running com.futbolix.reservation.messaging.BrokerAuthorizationNegativeTest
SLF4J: Failed to load class "org.slf4j.impl.StaticLoggerBinder".
SLF4J: Defaulting to no-operation (NOP) logger implementation
SLF4J: See http://www.slf4j.org/codes.html#StaticLoggerBinder for further details.
[INFO] Tests run: 3, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 15.35 s -- in com.futbolix.reservation.messaging.BrokerAuthorizationNegativeTest
[INFO]
[INFO] Results:
[INFO]
[INFO] Tests run: 3, Failures: 0, Errors: 0, Skipped: 0
[INFO]
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  25.243 s
[INFO] Finished at: 2026-11-10T15:21:03Z
```

All three cases pass, so the broker answered 403 `ACCESS_REFUSED` to `reservation-service`
publishing `payment.approved`, 406 `PRECONDITION_FAILED` to the forged `user_id`, and confirmed
the publish of `payment-service`. The SLF4J lines are only a logging warning (no logger binding
for Testcontainers); they do not affect the result.

## Workflow validation (CP8)

`actionlint` 1.7.7 over `security.yml`, same run:

```text
Status: Downloaded newer image for rhysd/actionlint:1.7.7
actionlint finished with no errors
```

actionlint printed no findings and exited with code 0, so `security.yml` is valid.
