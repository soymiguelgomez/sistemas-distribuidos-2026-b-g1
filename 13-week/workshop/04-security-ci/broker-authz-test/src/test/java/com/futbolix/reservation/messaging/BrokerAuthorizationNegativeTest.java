package com.futbolix.reservation.messaging;

import static java.nio.charset.StandardCharsets.UTF_8;
import static org.junit.jupiter.api.Assertions.assertEquals;

import com.rabbitmq.client.AMQP;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;
import com.rabbitmq.client.ShutdownSignalException;
import java.util.stream.Stream;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.testcontainers.containers.RabbitMQContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

/** TB4 threat S: only payment-service may publish PaymentApproved on futbolix.events. */
@Testcontainers
class BrokerAuthorizationNegativeTest {

    private static final String EXCHANGE = "futbolix.events";
    private static final String PAYMENT_APPROVED = """
        {"eventId":"7d1f0c1e-2b6a-4a51-9a0e-1f2d3c4b5a69","eventType":"PaymentApproved","version":1,
         "payload":{"reservationId":"0b8e8c52-4f7e-4d0a-9d55-2f7a1c3e9b10","amount":120000,"currency":"COP"}}""";

    @Container
    static final RabbitMQContainer BROKER = new RabbitMQContainer("rabbitmq:3.13-management");

    @BeforeAll
    static void createLeastPrivilegeUsers() throws Exception {
        ConnectionFactory admin = factory(BROKER.getAdminUsername(), BROKER.getAdminPassword());
        try (Connection connection = admin.newConnection()) {
            connection.createChannel().exchangeDeclare(EXCHANGE, "topic", true);
        }
        rabbitmqctl("add_user", "reservation-service", "reservation-secret");
        rabbitmqctl("set_permissions", "reservation-service", "^$", "^futbolix\\.events$", "^reservation\\..*");
        rabbitmqctl("set_topic_permissions", "reservation-service", EXCHANGE, "^reservation\\.", "^payment\\.");
        rabbitmqctl("add_user", "payment-service", "payment-secret");
        rabbitmqctl("set_permissions", "payment-service", "^$", "^futbolix\\.events$", "^payment\\..*");
        rabbitmqctl("set_topic_permissions", "payment-service", EXCHANGE, "^payment\\.", "^reservation\\.");
    }

    @Test
    void reservationServiceCannotPublishPaymentApproved() throws Exception {
        int replyCode = publish("reservation-service", "reservation-secret", "payment.approved", basic().build());
        assertEquals(AMQP.ACCESS_REFUSED, replyCode);
    }

    @Test
    void reservationServiceCannotImpersonatePaymentService() throws Exception {
        AMQP.BasicProperties forged = basic().userId("payment-service").build();
        int replyCode = publish("reservation-service", "reservation-secret", "reservation.created", forged);
        assertEquals(AMQP.PRECONDITION_FAILED, replyCode);
    }

    @Test
    void paymentServiceCanPublishPaymentApproved() throws Exception {
        AMQP.BasicProperties own = basic().userId("payment-service").build();
        assertEquals(AMQP.REPLY_SUCCESS, publish("payment-service", "payment-secret", "payment.approved", own));
    }

    /** Publishes with publisher confirms and returns 200, or the reply code the broker closed the channel with. */
    private static int publish(String user, String password, String routingKey, AMQP.BasicProperties props)
            throws Exception {
        try (Connection connection = factory(user, password).newConnection()) {
            Channel channel = connection.createChannel();
            channel.confirmSelect();
            channel.basicPublish(EXCHANGE, routingKey, props, PAYMENT_APPROVED.getBytes(UTF_8));
            channel.waitForConfirmsOrDie(5_000);
            return AMQP.REPLY_SUCCESS;
        } catch (ShutdownSignalException e) {
            return ((AMQP.Channel.Close) e.getReason()).getReplyCode();
        }
    }

    private static AMQP.BasicProperties.Builder basic() {
        return new AMQP.BasicProperties.Builder().contentType("application/json").deliveryMode(2);
    }

    private static ConnectionFactory factory(String user, String password) {
        ConnectionFactory factory = new ConnectionFactory();
        factory.setHost(BROKER.getHost());
        factory.setPort(BROKER.getAmqpPort());
        factory.setUsername(user);
        factory.setPassword(password);
        return factory;
    }

    private static void rabbitmqctl(String... args) throws Exception {
        var result = BROKER.execInContainer(Stream.concat(Stream.of("rabbitmqctl"), Stream.of(args)).toArray(String[]::new));
        assertEquals(0, result.getExitCode(), result.getStderr());
    }
}
