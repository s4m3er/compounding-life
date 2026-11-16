package com.compoundinglife.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

public class SipModels {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SipCalculationRequest {
        private double monthlyInvestment;
        private double expectedAnnualReturnRate; // e.g. 12.0 for 12%
        private int tenureYears;
        private double annualStepUpPercentage; // e.g. 10.0 for 10% annual increase, or 0
        private double inflationRate; // e.g. 6.0 for 6% inflation
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class YearlyBreakdown {
        private int year;
        private double monthlyAmount;
        private double totalInvestedTillDate;
        private double totalNominalWealth;
        private double inflationAdjustedRealWealth;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SipCalculationResponse {
        private double totalInvestedAmount;
        private double totalWealthNominal;
        private double totalWealthRealAdjusted;
        private double estimatedReturns;
        private double wealthGainMultiplier; // e.g. 3.4x
        private List<YearlyBreakdown> trajectory;
        private String boringWisdomInsight;
    }
}
