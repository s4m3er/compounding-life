package com.compoundinglife.controller;

import com.compoundinglife.entity.User;
import com.compoundinglife.entity.WisdomEntity;
import com.compoundinglife.repository.UserHabitEntryRepository;
import com.compoundinglife.repository.UserPortfolioRepository;
import com.compoundinglife.repository.UserRepository;
import com.compoundinglife.repository.WisdomEntityRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class AdminController {

    private final UserRepository userRepository;
    private final UserPortfolioRepository portfolioRepository;
    private final UserHabitEntryRepository habitEntryRepository;
    private final WisdomEntityRepository wisdomRepository;

    public AdminController(UserRepository userRepository,
                           UserPortfolioRepository portfolioRepository,
                           UserHabitEntryRepository habitEntryRepository,
                           WisdomEntityRepository wisdomRepository) {
        this.userRepository = userRepository;
        this.portfolioRepository = portfolioRepository;
        this.habitEntryRepository = habitEntryRepository;
        this.wisdomRepository = wisdomRepository;
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getPlatformStats() {
        long totalUsers = userRepository.count();
        long totalPortfolios = portfolioRepository.count();
        long totalHabitLogs = habitEntryRepository.count();
        long totalWisdom = wisdomRepository.count();

        return ResponseEntity.ok(Map.of(
                "totalUsers", totalUsers,
                "totalPortfolios", totalPortfolios,
                "totalHabitLogs", totalHabitLogs,
                "totalWisdomQuotes", totalWisdom
        ));
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @PostMapping("/wisdom")
    public ResponseEntity<WisdomEntity> addWisdom(@RequestBody WisdomEntity wisdom) {
        return ResponseEntity.ok(wisdomRepository.save(wisdom));
    }

    @DeleteMapping("/wisdom/{id}")
    public ResponseEntity<?> deleteWisdom(@PathVariable Long id) {
        wisdomRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Wisdom quote deleted successfully"));
    }
}
