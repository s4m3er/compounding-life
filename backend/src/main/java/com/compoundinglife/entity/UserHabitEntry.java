package com.compoundinglife.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "user_habit_entries")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserHabitEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private LocalDate entryDate;

    @Column(length = 1000)
    private String completedHabitIds; // e.g. "h-sleep,h-steps,w-sip"

    private int scorePercentage;
}
