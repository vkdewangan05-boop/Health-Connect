package com.healthconnect.service;

import com.healthconnect.entity.HealthSurvey;
import com.healthconnect.repository.HealthSurveyRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HealthSurveyService {

    private final HealthSurveyRepository repository;

    public HealthSurveyService(HealthSurveyRepository repository) {
        this.repository = repository;
    }

    public HealthSurvey saveSurvey(HealthSurvey survey) {
        return repository.save(survey);
    }

    public List<HealthSurvey> getUserSurveys(Long userId) {
        return repository.findByUserId(userId);
    }

    public List<HealthSurvey> getAllSurveys() {
        return repository.findAll();
    }

    public void deleteSurvey(Long id) {
        repository.deleteById(id);
    }
}