package com.healthconnect.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "medicines")
public class Medicine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String genericName;

    private String category;

    @Column(columnDefinition = "TEXT")
    private String basicInformation;


    // ==========================================
    // DEFAULT CONSTRUCTOR
    // ==========================================

    public Medicine() {
    }


    // ==========================================
    // PARAMETERIZED CONSTRUCTOR
    // ==========================================

    public Medicine(
            Long id,
            String name,
            String genericName,
            String category,
            String basicInformation) {

        this.id = id;
        this.name = name;
        this.genericName = genericName;
        this.category = category;
        this.basicInformation = basicInformation;
    }


    // ==========================================
    // GETTERS AND SETTERS
    // ==========================================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }


    public String getGenericName() {
        return genericName;
    }

    public void setGenericName(String genericName) {
        this.genericName = genericName;
    }


    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }


    public String getBasicInformation() {
        return basicInformation;
    }

    public void setBasicInformation(String basicInformation) {
        this.basicInformation = basicInformation;
    }
}