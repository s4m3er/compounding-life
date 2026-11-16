package com.compoundinglife.controller;

import com.compoundinglife.entity.User;
import com.compoundinglife.entity.UserHabitEntry;
import com.compoundinglife.entity.UserPortfolio;
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
}
