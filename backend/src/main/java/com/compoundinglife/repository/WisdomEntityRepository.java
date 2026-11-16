package com.compoundinglife.repository;

import com.compoundinglife.entity.WisdomEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WisdomEntityRepository extends JpaRepository<WisdomEntity, Long> {
    List<WisdomEntity> findByMasterIgnoreCase(String master);
    List<WisdomEntity> findByCategoryIgnoreCase(String category);
}
