package com.compoundinglife.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "wisdom_items")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WisdomEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String master; // "Charlie Munger", "Warren Buffett", etc.

    @Column(nullable = false)
    private String category; // "INVERSION", "BORING_COMPOUNDING", etc.

    @Column(length = 2000, nullable = false)
    private String quote;

    @Column(length = 2000)
    private String practicalApplication;

    private String referenceWork;
}
