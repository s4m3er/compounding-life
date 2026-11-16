package com.compoundinglife.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

public class WisdomModels {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WisdomQuote {
        private String id;
        private String master; // "Warren Buffett", "Charlie Munger", "Benjamin Graham", "Parag Parikh", "InvestYadnya", "Stoic & Health"
        private String category; // "INVERSION", "BORING_COMPOUNDING", "FRUGALITY", "BEHAVIORAL_BIAS", "HEALTH_LONGEVITY"
        private String quote;
        private String practicalApplication;
        private String referenceWork;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DailyHabitItem {
        private String id;
        private String pillar; // "HEALTH" or "WEALTH"
        private String title;
        private String description;
        private boolean completed;
        private int impactScore; // 1-10
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LongevityScoreResponse {
        private int totalScore; // out of 100
        private String status; // "Bulletproof", "Compounding Steadily", "Vulnerable to Shocks"
        private List<String> primaryRecommendations;
        private String dailyMantra;
    }
}
