package com.compoundinglife.service;

import com.compoundinglife.model.ProtectionModels.*;
import com.compoundinglife.model.SipModels.*;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class FinanceCalculationService {

    /**
     * Calculates SIP with optional annual step-up compounding and inflation adjustment.
     */
    public SipCalculationResponse calculateSip(SipCalculationRequest request) {
        double monthlyAmount = request.getMonthlyInvestment();
        double annualReturn = request.getExpectedAnnualReturnRate() / 100.0;
        double monthlyRate = annualReturn / 12.0;
        int totalYears = request.getTenureYears();
        double stepUpFraction = (request.getAnnualStepUpPercentage() > 0)
                ? request.getAnnualStepUpPercentage() / 100.0
                : 0.0;
        double annualInflation = (request.getInflationRate() > 0)
                ? request.getInflationRate() / 100.0
                : 0.06; // default 6% inflation

        double totalNominalWealth = 0.0;
        double totalInvested = 0.0;
        List<YearlyBreakdown> trajectory = new ArrayList<>();

        double currentMonthly = monthlyAmount;

        for (int year = 1; year <= totalYears; year++) {
            for (int month = 1; month <= 12; month++) {
                totalInvested += currentMonthly;
                totalNominalWealth = (totalNominalWealth + currentMonthly) * (1.0 + monthlyRate);
            }

            // Real inflation-adjusted wealth (purchasing power in today's money)
            double inflationDiscountFactor = Math.pow(1.0 + annualInflation, year);
            double realWealth = totalNominalWealth / inflationDiscountFactor;

            trajectory.add(YearlyBreakdown.builder()
                    .year(year)
                    .monthlyAmount(Math.round(currentMonthly))
                    .totalInvestedTillDate(Math.round(totalInvested))
                    .totalNominalWealth(Math.round(totalNominalWealth))
                    .inflationAdjustedRealWealth(Math.round(realWealth))
                    .build());

            // Apply annual step-up
            currentMonthly = currentMonthly * (1.0 + stepUpFraction);
        }

        double returns = totalNominalWealth - totalInvested;
        double multiplier = totalInvested > 0 ? (totalNominalWealth / totalInvested) : 1.0;
        double finalRealWealth = totalNominalWealth / Math.pow(1.0 + annualInflation, totalYears);

        String wisdom;
        if (totalYears >= 20) {
            wisdom = "Notice how the first 7 years feel slow, but years 15 to " + totalYears +
                    " generate wealth far exceeding your principal deposits. This is the pure mathematical magic of boring patience.";
        } else if (totalYears >= 10) {
            wisdom = "At 10+ years, compounding starts showing its power. Step-up contributions counter lifestyle inflation and dramatically shorten financial independence.";
        } else {
            wisdom = "For horizons under 7 years, capital protection matters more than aggressive equity returns. Maintain high margin of safety.";
        }

        return SipCalculationResponse.builder()
                .totalInvestedAmount(Math.round(totalInvested))
                .totalWealthNominal(Math.round(totalNominalWealth))
                .totalWealthRealAdjusted(Math.round(finalRealWealth))
                .estimatedReturns(Math.round(returns))
                .wealthGainMultiplier(Math.round(multiplier * 100.0) / 100.0)
                .trajectory(trajectory)
                .boringWisdomInsight(wisdom)
                .build();
    }

    /**
     * Calculates Emergency Fund using Charlie Munger's Inversion Principle (Survival First).
     */
    public EmergencyFundResponse calculateEmergencyFund(EmergencyFundRequest request) {
        int months = 6; // base

        String employment = request.getEmploymentType() != null ? request.getEmploymentType().toUpperCase() : "STABLE_SALARY";
        switch (employment) {
            case "FREELANCER":
            case "COMMISSION_BASED":
                months = 9;
                break;
            case "BUSINESS_OWNER":
                months = 12;
                break;
            default:
                months = 6;
                break;
        }

        if (request.getDependentCount() >= 2) {
            months += 2;
        }
        if (request.isHasDependentsMedicalConditions()) {
            months += 2;
        }

        // Cap reasonable maximum at 15 months
        months = Math.min(months, 15);
        double totalRequired = request.getMonthlyLivingExpenses() * months;

        // Allocation into 3 liquid layers (No equity, no lock-in)
        List<FundAllocationTier> tiers = new ArrayList<>();
        double tier1 = totalRequired * 0.25; // Instant Cash / Sweep
        double tier2 = totalRequired * 0.45; // High Quality Liquid Mutual Funds
        double tier3 = totalRequired * 0.30; // Short Term Bank FDs

        tiers.add(FundAllocationTier.builder()
                .bucketName("Tier 1: Instant Liquidity (0 to 24 hrs)")
                .amount(Math.round(tier1))
                .instrument("High-yield Savings Account / Auto-Sweep FD")
                .rationale("Immediate cash for unexpected home or vehicle repairs, or immediate medical admission deposit.")
                .build());

        tiers.add(FundAllocationTier.builder()
                .bucketName("Tier 2: Ultra-Safe Liquid Reserves (1 to 2 business days)")
                .amount(Math.round(tier2))
                .instrument("Overnight / Liquid Debt Mutual Funds (Top AMC Sovereign/AAA rated)")
                .rationale("Earns near-repo yield without taking credit risk or duration risk. Redemption in 24-48 hours.")
                .build());

        tiers.add(FundAllocationTier.builder()
                .bucketName("Tier 3: Short-Term Contingency (Callable instantly)")
                .amount(Math.round(tier3))
                .instrument("6 to 12 Month Bank Fixed Deposits with premature withdrawal option")
                .rationale("Guaranteed principal backing. Acts as a psychological shock absorber so you never sell your equity SIPs in panic.")
                .build());

        return EmergencyFundResponse.builder()
                .recommendedMonths(months)
                .totalFundRequired(Math.round(totalRequired))
                .allocationPlan(tiers)
                .inversionRule("Never look for high returns on your emergency fund. The return of capital is 100x more important than the return on capital here.")
                .build();
    }

    /**
     * Calculates Pure Protection Insurance Needs (Term + Health).
     */
    public InsuranceResponse calculateInsuranceNeeds(InsuranceRequest request) {
        // Pure Term Life Calculation: Income Replacement (15x-20x) + Liabilities - Existing Assets
        int multiplier = request.getAge() <= 35 ? 20 : (request.getAge() <= 45 ? 15 : 10);
        double incomeReplacement = request.getAnnualIncome() * multiplier;
        double grossNeed = incomeReplacement + request.getTotalOutstandingDebts() - (request.getExistingLiquidAssets() * 0.5);
        double termCover = Math.max(grossNeed, request.getAnnualIncome() * 10);

        // Round to nearest 25 Lakhs / Millions
        termCover = Math.ceil(termCover / 2500000.0) * 2500000.0;

        // Health Insurance Base + Super Top-up
        double baseCover = 1000000.0; // 10 Lakhs base
        double superTopUp = 2500000.0; // 25 Lakhs super top-up with 10L deductible

        if ("METRO".equalsIgnoreCase(request.getCityTier())) {
            baseCover = 1500000.0; // 15 Lakhs
            superTopUp = 5000000.0; // 50 Lakhs super top-up
        }

        List<String> rules = List.of(
                "Rule 1: NEVER mix investment with insurance. Avoid ULIPs, Endowment policies, and Money-back plans like the plague. They offer pathetic 5% returns and negligible life cover.",
                "Rule 2: Buy Pure Term Insurance till retirement age (60-65). You don't need life insurance when your children are independent and your corpus is built.",
                "Rule 3: Always buy an independent Family Floater Health Insurance even if your employer covers you. Corporate health covers vanish the day you switch jobs or retire.",
                "Rule 4: Pair a modest Base Health Cover (10-15 Lakhs) with a heavy Super Top-up (25-50 Lakhs). This gives 50L+ total protection at a fraction of the cost."
        );

        return InsuranceResponse.builder()
                .recommendedTermInsuranceCover(termCover)
                .termInsuranceRationale("Covers " + multiplier + "x of your annual income plus all liabilities, ensuring your dependents maintain their standard of living without debt.")
                .recommendedHealthBaseCover(baseCover)
                .recommendedHealthSuperTopupCover(superTopUp)
                .healthInsuranceRationale("Base floater handles routine hospitalizations; the Super Top-up shields your family from catastrophic medical inflation.")
                .cardinalRulesToAvoidTraps(rules)
                .build();
    }
}
