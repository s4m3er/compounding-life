package com.compoundinglife.service;

import com.compoundinglife.model.ProtectionModels.*;
import com.compoundinglife.model.SipModels.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class FinanceCalculationServiceTest {

    private FinanceCalculationService service;

    @BeforeEach
    void setUp() {
        service = new FinanceCalculationService();
    }

    @Test
    void testSipCalculationNominalAndStepUp() {
        SipCalculationRequest request = SipCalculationRequest.builder()
                .monthlyInvestment(10000)
                .expectedAnnualReturnRate(12.0)
                .tenureYears(10)
                .annualStepUpPercentage(10.0)
                .inflationRate(6.0)
                .build();

        SipCalculationResponse response = service.calculateSip(request);

        assertNotNull(response);
        assertTrue(response.getTotalInvestedAmount() > 10000 * 12 * 10, "With 10% step-up, total invested must be greater than flat 10k/month");
        assertTrue(response.getTotalWealthNominal() > response.getTotalInvestedAmount(), "Nominal wealth must exceed invested amount");
        assertTrue(response.getEstimatedReturns() > 0);
        assertEquals(10, response.getTrajectory().size());
    }

    @Test
    void testEmergencyFundFreelancerRequiresMoreBuffer() {
        EmergencyFundRequest stableReq = EmergencyFundRequest.builder()
                .monthlyLivingExpenses(50000)
                .dependentCount(1)
                .employmentType("STABLE_SALARY")
                .hasDependentsMedicalConditions(false)
                .build();

        EmergencyFundRequest freelancerReq = EmergencyFundRequest.builder()
                .monthlyLivingExpenses(50000)
                .dependentCount(1)
                .employmentType("FREELANCER")
                .hasDependentsMedicalConditions(false)
                .build();

        EmergencyFundResponse stableRes = service.calculateEmergencyFund(stableReq);
        EmergencyFundResponse freeRes = service.calculateEmergencyFund(freelancerReq);

        assertTrue(freeRes.getRecommendedMonths() > stableRes.getRecommendedMonths(),
                "Freelancers should be recommended more months of emergency reserve");
        assertEquals(3, freeRes.getAllocationPlan().size(), "Must allocate into 3 liquid tiers");
    }

    @Test
    void testInsuranceNeedsRule() {
        InsuranceRequest req = InsuranceRequest.builder()
                .annualIncome(1500000) // 15 Lakhs
                .totalOutstandingDebts(2000000) // 20 Lakhs home loan
                .existingLiquidAssets(500000)
                .age(30)
                .dependentsCount(2)
                .cityTier("METRO")
                .build();

        InsuranceResponse res = service.calculateInsuranceNeeds(req);

        assertNotNull(res);
        assertTrue(res.getRecommendedTermInsuranceCover() >= 1500000 * 15, "Term cover should replace at least 15-20x income");
        assertTrue(res.getRecommendedHealthSuperTopupCover() >= 2500000, "Super top-up must provide catastrophic buffer");
        assertFalse(res.getCardinalRulesToAvoidTraps().isEmpty());
    }
}
