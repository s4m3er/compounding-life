package com.compoundinglife.service;

import com.compoundinglife.config.KafkaTopicConfig;
import com.compoundinglife.event.DomainEvents.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;

@Service
public class EventProducerService {

    private static final Logger log = LoggerFactory.getLogger(EventProducerService.class);

    private final KafkaTemplate<String, Object> kafkaTemplate;

    @Value("${spring.kafka.enabled:false}")
    private boolean kafkaEnabled;

    @Autowired(required = false)
    public EventProducerService(KafkaTemplate<String, Object> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void publishPortfolioEvent(PortfolioCalculatedEvent event) {
        log.info("[EventProducer] Emitting Portfolio Event: {}", event);
        if (kafkaTemplate != null && kafkaEnabled) {
            CompletableFuture.runAsync(() -> {
                try {
                    kafkaTemplate.send(KafkaTopicConfig.PORTFOLIO_TOPIC,
                            event.getUserEmail() != null ? event.getUserEmail() : "anonymous",
                            event);
                } catch (Exception e) {
                    log.warn("[EventProducer] Kafka broker unavailable, processed in fallback mode: {}", e.getMessage());
                }
            });
        }
    }

    public void publishHabitEvent(HabitLoggedEvent event) {
        log.info("[EventProducer] Emitting Habit Event: {}", event);
        if (kafkaTemplate != null && kafkaEnabled) {
            CompletableFuture.runAsync(() -> {
                try {
                    kafkaTemplate.send(KafkaTopicConfig.HABIT_TOPIC,
                            event.getUserEmail() != null ? event.getUserEmail() : "anonymous",
                            event);
                } catch (Exception e) {
                    log.warn("[EventProducer] Kafka broker unavailable, processed in fallback mode: {}", e.getMessage());
                }
            });
        }
    }
}
