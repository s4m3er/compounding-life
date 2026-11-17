package com.compoundinglife.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false)
    private String role; // "ROLE_USER" or "ROLE_ADMIN"

    @Builder.Default
    private String provider = "LOCAL"; // "LOCAL" or "GOOGLE"

    @Column(length = 1000)
    private String picture;

    // Personalized Onboarding & Financial Profile Fields
    private Integer age;

    private String gender; // "Male", "Female", "Prefer not to say"

    private Double monthlyIncome;

    private Double currentInvestments;

    private Integer emergencyFundMonths;

    private String primaryGoal;

    @Builder.Default
    private Boolean onboardingCompleted = false;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();
}
