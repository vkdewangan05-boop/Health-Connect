package com.healthconnect.service;

import com.healthconnect.entity.Student;
import com.healthconnect.repository.StudentRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {

    private final StudentRepository repository;

    public StudentService(StudentRepository repository) {
        this.repository = repository;
    }

    public Student registerStudent(Student student) {

        if (repository.existsByUsername(student.getUsername())) {
            throw new RuntimeException(
                    "Username already exists."
            );
        }

        if (repository.existsByEmail(student.getEmail())) {
            throw new RuntimeException(
                    "Email already exists."
            );
        }

        if (student.getAvailable() == null) {
            student.setAvailable(true);
        }

        return repository.save(student);
    }

    public Student loginStudent(
            String username,
            String password) {

        Student student =
                repository
                        .findByUsername(username)
                        .orElse(null);

        if (student == null) {
            return null;
        }

        if (!student.getPassword().equals(password)) {
            return null;
        }

        return student;
    }

    public List<Student> getAllStudents() {
        return repository.findAll();
    }

    public List<Student> getAvailableStudents() {
        return repository.findByAvailableTrue();
    }

    public Student getStudentById(Long id) {
        return repository.findById(id).orElse(null);
    }

    public Student updateAvailability(
            Long id,
            Boolean available) {

        Student student =
                repository.findById(id).orElse(null);

        if (student == null) {
            return null;
        }

        student.setAvailable(available);

        return repository.save(student);
    }
}