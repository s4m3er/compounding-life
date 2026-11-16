package com.compoundinglife.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_portfolios")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserPortfolio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id", unique = true, nullable = false)
    private User user;

    private double monthlySip;
    private double returnRate;
    private int tenureYears;
    private double annualStepUp;
    private double emergencyFundTarget;
    private int emergencyFundMonths;
    private double termInsuranceCover;
    private double healthInsuranceCover;

    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();
}
