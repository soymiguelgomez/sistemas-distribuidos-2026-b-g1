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

## Console output

Pending (CP8).
