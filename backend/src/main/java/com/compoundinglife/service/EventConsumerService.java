package com.compoundinglife.service;

import com.compoundinglife.config.KafkaTopicConfig;
import com.compoundinglife.event.DomainEvents.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class EventConsumerService {

    private static final Logger log = LoggerFactory.getLogger(EventConsumerService.class);

    @KafkaListener(
            topics = KafkaTopicConfig.PORTFOLIO_TOPIC,
            groupId = "compounding-life-group",
            autoStartup = "${spring.kafka.consumer.auto-startup:true}"
    )
    public void consumePortfolioEvent(PortfolioCalculatedEvent event) {
        log.info("[EventConsumer] Received Portfolio Event from Kafka Topic [{}]: User={}, MonthlySIP=₹{}, Projected=₹{}",
                KafkaTopicConfig.PORTFOLIO_TOPIC,
                event.getUserEmail(),
                event.getMonthlySip(),
                event.getProjectedWealth());
        // In a microservices architecture, this event would trigger:
        // 1. Notification Service (sends email summary of compounding goals)
        // 2. Risk Profiler Service (evaluates asset allocation balance)
    }

    @KafkaListener(
            topics = KafkaTopicConfig.HABIT_TOPIC,
            groupId = "compounding-life-group",
            autoStartup = "${spring.kafka.consumer.auto-startup:true}"
    )
    public void consumeHabitEvent(HabitLoggedEvent event) {
        log.info("[EventConsumer] Received Habit Event from Kafka Topic [{}]: User={}, Score={}%",
                KafkaTopicConfig.HABIT_TOPIC,
                event.getUserEmail(),
                event.getScorePercentage());
        // In a microservices architecture, this event would trigger:
        // 1. Gamification / Streak Service (calculates longevity badges)
    }
}
