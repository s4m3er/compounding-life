package com.compoundinglife.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

public class DomainEvents {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PortfolioCalculatedEvent {
        private String eventType; // e.g. "PORTFOLIO_CALCULATED" or "PORTFOLIO_SAVED"
        private Long userId;
        private String userEmail;
        private double monthlySip;
        private double returnRate;
        private int tenureYears;
        private double projectedWealth;
        @Builder.Default
        private LocalDateTime timestamp = LocalDateTime.now();
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class HabitLoggedEvent {
        private String eventType; // "HABIT_LOGGED"
        private Long userId;
        private String userEmail;
        private int scorePercentage;
        private String completedHabitIds;
        @Builder.Default
        private LocalDateTime timestamp = LocalDateTime.now();
    }
}
