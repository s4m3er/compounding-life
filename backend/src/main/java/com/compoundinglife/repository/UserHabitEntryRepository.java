package com.compoundinglife.repository;

import com.compoundinglife.entity.User;
import com.compoundinglife.entity.UserHabitEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserHabitEntryRepository extends JpaRepository<UserHabitEntry, Long> {
    Optional<UserHabitEntry> findByUserAndEntryDate(User user, LocalDate entryDate);
    List<UserHabitEntry> findByUserOrderByEntryDateDesc(User user);
}
