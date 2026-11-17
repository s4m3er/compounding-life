package com.compoundinglife.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

public class AuthModels {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RegisterRequest {
        private String email;
        private String password;
        private String fullName;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LoginRequest {
        private String email;
        private String password;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GoogleAuthRequest {
        private String credential; // Google ID Token (JWT)
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AuthResponse {
        private String token;
        private String email;
        private String fullName;
        private String role;
        private String picture;
        private boolean onboardingCompleted;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProfileUpdateRequest {
        private String fullName;
        private Integer age;
        private String gender;
        private Double monthlyIncome;
        private Double currentInvestments;
        private Integer emergencyFundMonths;
        private String primaryGoal;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FinancialHealthAssessment {
        private int overallScore; // 0 - 100
        private String rating; // e.g. "Outstanding Pace", "Strong Foundation"
        private double targetNetWorthForAge;
        private int recommendedEquityPercent;
        private int recommendedDebtPercent;
        private double recommendedMonthlySip;
        private double recommendedTermInsurance;
        private String mungerInsight;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserProfileResponse {
        private Long id;
        private String email;
        private String fullName;
        private String role;
        private String provider;
        private String picture;
        private Integer age;
        private String gender;
        private Double monthlyIncome;
        private Double currentInvestments;
        private Integer emergencyFundMonths;
        private String primaryGoal;
        private Boolean onboardingCompleted;
        private LocalDateTime createdAt;
        private FinancialHealthAssessment assessment;
    }
}
