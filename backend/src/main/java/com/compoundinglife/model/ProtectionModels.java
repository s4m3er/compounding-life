package com.compoundinglife.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

public class ProtectionModels {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EmergencyFundRequest {
        private double monthlyLivingExpenses;
        private int dependentCount;
        private String employmentType; // "STABLE_SALARY", "COMMISSION_BASED", "FREELANCER", "BUSINESS_OWNER"
        private boolean hasDependentsMedicalConditions;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FundAllocationTier {
        private String bucketName;
        private double amount;
        private String instrument; // "High-Yield Savings / Sweep", "Liquid Mutual Fund", "Short-term Fixed Deposit"
        private String rationale;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EmergencyFundResponse {
        private int recommendedMonths;
        private double totalFundRequired;
        private List<FundAllocationTier> allocationPlan;
        private String inversionRule;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class InsuranceRequest {
        private double annualIncome;
        private double totalOutstandingDebts; // Home loan, car loan, etc.
        private double existingLiquidAssets; // Mutual funds, FDs, PPF
        private int age;
        private int dependentsCount;
        private String cityTier; // "METRO", "TIER_1", "TIER_2_OR_3"
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class InsuranceResponse {
        private double recommendedTermInsuranceCover;
        private String termInsuranceRationale;
        private double recommendedHealthBaseCover;
        private double recommendedHealthSuperTopupCover;
        private String healthInsuranceRationale;
        private List<String> cardinalRulesToAvoidTraps;
    }
}
