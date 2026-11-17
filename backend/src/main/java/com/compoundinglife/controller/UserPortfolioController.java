package com.compoundinglife.controller;

import com.compoundinglife.entity.User;
import com.compoundinglife.entity.UserHabitEntry;
import com.compoundinglife.entity.UserPortfolio;
import com.compoundinglife.model.AuthModels.*;
import com.compoundinglife.repository.UserHabitEntryRepository;
import com.compoundinglife.repository.UserPortfolioRepository;
import com.compoundinglife.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserPortfolioController {

    private final UserRepository userRepository;
    private final UserPortfolioRepository portfolioRepository;
    private final UserHabitEntryRepository habitEntryRepository;

    public UserPortfolioController(UserRepository userRepository,
                                   UserPortfolioRepository portfolioRepository,
                                   UserHabitEntryRepository habitEntryRepository) {
        this.userRepository = userRepository;
        this.portfolioRepository = portfolioRepository;
        this.habitEntryRepository = habitEntryRepository;
    }

    private User getAuthenticatedUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
    }

    @GetMapping("/profile")
    public ResponseEntity<UserProfileResponse> getUserProfile() {
        User user = getAuthenticatedUser();
        return ResponseEntity.ok(buildUserProfileResponse(user));
    }

    @PutMapping("/profile")
    public ResponseEntity<UserProfileResponse> updateUserProfile(@RequestBody ProfileUpdateRequest request) {
        User user = getAuthenticatedUser();

        if (request.getFullName() != null && !request.getFullName().isBlank()) {
            user.setFullName(request.getFullName().trim());
        }
        if (request.getAge() != null) {
            user.setAge(request.getAge());
        }
        if (request.getGender() != null) {
            user.setGender(request.getGender());
        }
        if (request.getMonthlyIncome() != null) {
            user.setMonthlyIncome(request.getMonthlyIncome());
        }
        if (request.getCurrentInvestments() != null) {
            user.setCurrentInvestments(request.getCurrentInvestments());
        }
        if (request.getEmergencyFundMonths() != null) {
            user.setEmergencyFundMonths(request.getEmergencyFundMonths());
        }
        if (request.getPrimaryGoal() != null) {
            user.setPrimaryGoal(request.getPrimaryGoal());
        }

        user.setOnboardingCompleted(true);
        user.setUpdatedAt(LocalDateTime.now());

        User saved = userRepository.save(user);
        return ResponseEntity.ok(buildUserProfileResponse(saved));
    }

    @GetMapping("/portfolio")
    public ResponseEntity<?> getPortfolio() {
        User user = getAuthenticatedUser();
        return ResponseEntity.ok(portfolioRepository.findByUser(user)
                .orElse(UserPortfolio.builder().user(user).build()));
    }

    @PostMapping("/portfolio")
    public ResponseEntity<?> savePortfolio(@RequestBody UserPortfolio updated) {
        User user = getAuthenticatedUser();
        UserPortfolio existing = portfolioRepository.findByUser(user)
                .orElse(UserPortfolio.builder().user(user).build());

        existing.setMonthlySip(updated.getMonthlySip());
        existing.setReturnRate(updated.getReturnRate());
        existing.setTenureYears(updated.getTenureYears());
        existing.setAnnualStepUp(updated.getAnnualStepUp());
        existing.setEmergencyFundTarget(updated.getEmergencyFundTarget());
        existing.setEmergencyFundMonths(updated.getEmergencyFundMonths());
        existing.setTermInsuranceCover(updated.getTermInsuranceCover());
        existing.setHealthInsuranceCover(updated.getHealthInsuranceCover());
        existing.setUpdatedAt(LocalDateTime.now());

        return ResponseEntity.ok(portfolioRepository.save(existing));
    }

    @GetMapping("/habits")
    public ResponseEntity<List<UserHabitEntry>> getHabitHistory() {
        User user = getAuthenticatedUser();
        return ResponseEntity.ok(habitEntryRepository.findByUserOrderByEntryDateDesc(user));
    }

    @PostMapping("/habits")
    public ResponseEntity<?> recordTodayHabits(@RequestBody Map<String, Object> payload) {
        User user = getAuthenticatedUser();
        LocalDate today = LocalDate.now();

        String completedIds = (String) payload.getOrDefault("completedHabitIds", "");
        int score = ((Number) payload.getOrDefault("scorePercentage", 0)).intValue();

        UserHabitEntry entry = habitEntryRepository.findByUserAndEntryDate(user, today)
                .orElse(UserHabitEntry.builder().user(user).entryDate(today).build());

        entry.setCompletedHabitIds(completedIds);
        entry.setScorePercentage(score);

        return ResponseEntity.ok(habitEntryRepository.save(entry));
    }

    private UserProfileResponse buildUserProfileResponse(User user) {
        FinancialHealthAssessment assessment = assessFinancialHealth(user);

        return UserProfileResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .provider(user.getProvider())
                .picture(user.getPicture())
                .age(user.getAge())
                .gender(user.getGender())
                .monthlyIncome(user.getMonthlyIncome())
                .currentInvestments(user.getCurrentInvestments())
                .emergencyFundMonths(user.getEmergencyFundMonths())
                .primaryGoal(user.getPrimaryGoal())
                .onboardingCompleted(user.getOnboardingCompleted())
                .createdAt(user.getCreatedAt())
                .assessment(assessment)
                .build();
    }

    private FinancialHealthAssessment assessFinancialHealth(User user) {
        int age = user.getAge() != null ? user.getAge() : 30;
        double income = user.getMonthlyIncome() != null ? user.getMonthlyIncome() : 50000.0;
        double currentInvested = user.getCurrentInvestments() != null ? user.getCurrentInvestments() : 0.0;
        int emergencyMonths = user.getEmergencyFundMonths() != null ? user.getEmergencyFundMonths() : 0;
        double annualIncome = income * 12.0;

        // 1. Target Net Worth based on Charlie Munger & Stanley/Danko wealth-for-age benchmarks
        double ageMultiplier;
        if (age < 25) ageMultiplier = 0.5;
        else if (age <= 30) ageMultiplier = 1.5;
        else if (age <= 35) ageMultiplier = 3.0;
        else if (age <= 40) ageMultiplier = 5.0;
        else if (age <= 50) ageMultiplier = 8.0;
        else ageMultiplier = 12.0;

        double targetNetWorth = Math.round(annualIncome * ageMultiplier);

        // 2. Asset Allocation: Equity % = Math.max(40, 110 - age)
        int equityPercent = Math.max(40, Math.min(85, 110 - age));
        int debtPercent = 100 - equityPercent;

        // 3. Recommended monthly SIP: 30% to 40% of income
        double recommendedSip = Math.round(income * 0.35);

        // 4. Recommended Pure Term Insurance: 15x annual income
        double recommendedInsurance = Math.round(annualIncome * 15.0);

        // 5. Score calculation (0 - 100)
        int score = 0;
        // Emergency fund (max 30 pts)
        if (emergencyMonths >= 6) score += 30;
        else score += (emergencyMonths * 5);

        // Net worth vs age benchmark (max 40 pts)
        if (targetNetWorth > 0) {
            double ratio = currentInvested / targetNetWorth;
            if (ratio >= 1.0) score += 40;
            else score += (int) (ratio * 40);
        }

        // Monthly savings capacity (max 30 pts)
        if (income > 0) {
            score += 30;
        }

        score = Math.min(100, Math.max(25, score));

        String rating;
        String insight;
        if (score >= 85) {
            rating = "Outstanding Compounding Pace";
            insight = "You are significantly ahead of the curve for age " + age + ". Maintain your emergency moat and let your equity snowball roll untouched.";
        } else if (score >= 65) {
            rating = "Strong Foundation";
            insight = "You have established healthy discipline. Focus on annual 10% step-up contributions to counter lifestyle inflation as salary grows.";
        } else if (score >= 45) {
            rating = "Building Momentum";
            insight = "Top priority: Complete your 6-month liquid emergency shield first. Survival precedes growth in volatile economic cycles.";
        } else {
            rating = "Starting Phase";
            insight = "Every big fortune started as a humble first deposit. Begin with even a small automated monthly SIP—time in the market beats timing every time.";
        }

        return FinancialHealthAssessment.builder()
                .overallScore(score)
                .rating(rating)
                .targetNetWorthForAge(targetNetWorth)
                .recommendedEquityPercent(equityPercent)
                .recommendedDebtPercent(debtPercent)
                .recommendedMonthlySip(recommendedSip)
                .recommendedTermInsurance(recommendedInsurance)
                .mungerInsight(insight)
                .build();
    }
}
