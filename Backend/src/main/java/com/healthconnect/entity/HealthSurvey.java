package com.healthconnect.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "health_surveys")
public class HealthSurvey {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    private Integer age;

    private String gender;

    private String height;

    private String weight;

    private String symptoms;

    private String allergies;

    private String existingConditions;

    private String smoking;

    private String exercise;

    private String surveyDate;

    public HealthSurvey() {
    }

    public HealthSurvey(Long id, Long userId, Integer age,
                        String gender, String height,
                        String weight, String symptoms,
                        String allergies,
                        String existingConditions,
                        String smoking,
                        String exercise,
                        String surveyDate) {

        this.id = id;
        this.userId = userId;
        this.age = age;
        this.gender = gender;
        this.height = height;
        this.weight = weight;
        this.symptoms = symptoms;
        this.allergies = allergies;
        this.existingConditions = existingConditions;
        this.smoking = smoking;
        this.exercise = exercise;
        this.surveyDate = surveyDate;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getHeight() {
        return height;
    }

    public void setHeight(String height) {
        this.height = height;
    }

    public String getWeight() {
        return weight;
    }

    public void setWeight(String weight) {
        this.weight = weight;
    }

    public String getSymptoms() {
        return symptoms;
    }

    public void setSymptoms(String symptoms) {
        this.symptoms = symptoms;
    }

    public String getAllergies() {
        return allergies;
    }

    public void setAllergies(String allergies) {
        this.allergies = allergies;
    }

    public String getExistingConditions() {
        return existingConditions;
    }

    public void setExistingConditions(String existingConditions) {
        this.existingConditions = existingConditions;
    }

    public String getSmoking() {
        return smoking;
    }

    public void setSmoking(String smoking) {
        this.smoking = smoking;
    }

    public String getExercise() {
        return exercise;
    }

    public void setExercise(String exercise) {
        this.exercise = exercise;
    }

    public String getSurveyDate() {
        return surveyDate;
    }

    public void setSurveyDate(String surveyDate) {
        this.surveyDate = surveyDate;
    }
}