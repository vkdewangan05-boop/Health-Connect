package com.healthconnect.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "student_advice")
public class StudentAdvice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long studentId;

    private Long userId;

    private String studentName;

    private String problem;

    @Column(length = 3000)
    private String advice;

    private String adviceType;

    private String status;

    private String createdDate;

    public StudentAdvice() {
    }

    public StudentAdvice(
            Long id,
            Long studentId,
            Long userId,
            String studentName,
            String problem,
            String advice,
            String adviceType,
            String status,
            String createdDate) {

        this.id = id;
        this.studentId = studentId;
        this.userId = userId;
        this.studentName = studentName;
        this.problem = problem;
        this.advice = advice;
        this.adviceType = adviceType;
        this.status = status;
        this.createdDate = createdDate;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getProblem() {
        return problem;
    }

    public void setProblem(String problem) {
        this.problem = problem;
    }

    public String getAdvice() {
        return advice;
    }

    public void setAdvice(String advice) {
        this.advice = advice;
    }

    public String getAdviceType() {
        return adviceType;
    }

    public void setAdviceType(String adviceType) {
        this.adviceType = adviceType;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(String createdDate) {
        this.createdDate = createdDate;
    }
}