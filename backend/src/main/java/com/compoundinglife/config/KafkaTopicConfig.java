package com.compoundinglife.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaTopicConfig {

    public static final String PORTFOLIO_TOPIC = "compounding-portfolio-events";
    public static final String HABIT_TOPIC = "compounding-habit-events";

    @Bean
    public NewTopic portfolioTopic() {
        return TopicBuilder.name(PORTFOLIO_TOPIC)
                .partitions(3)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic habitTopic() {
        return TopicBuilder.name(HABIT_TOPIC)
                .partitions(3)
                .replicas(1)
                .build();
    }
}
