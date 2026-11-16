package com.compoundinglife.repository;

import com.compoundinglife.entity.User;
import com.compoundinglife.entity.UserPortfolio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserPortfolioRepository extends JpaRepository<UserPortfolio, Long> {
    Optional<UserPortfolio> findByUser(User user);
    Optional<UserPortfolio> findByUserId(Long userId);
}
