package com.healthconnect.repository;

import com.healthconnect.entity.HealthSurvey;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HealthSurveyRepository
        extends JpaRepository<HealthSurvey, Long> {

    List<HealthSurvey> findByUserId(Long userId);
}