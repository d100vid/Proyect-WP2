package com.projectapp.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "recipes")
public class Recipe {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    // Use Postgres 'text' type for potentially large base64 image strings
    @Column(columnDefinition = "text")
    private String image; // Base64 encoded image

    private String time;

    private String difficulty; // Easy, Medium, Hard

    private Long userId; // Usuario que creó la receta

    private boolean validated; // Si fue validada por admin

    private Long validatedBy; // Admin que validó (si aplica)

    // LocalDateTime doesn't use @Temporal (that's for java.util.Date / Calendar)
    private LocalDateTime createdAt;

    private LocalDateTime validatedAt;

    private String ingredients; // JSON o texto

    private String instructions; // JSON o texto

    private boolean isQuick;
    private boolean isHealthy;
    private boolean hasFewIngredients;

    // Constructor vacío
    public Recipe() {
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public boolean isValidated() {
        return validated;
    }

    public void setValidated(boolean validated) {
        this.validated = validated;
    }

    public Long getValidatedBy() {
        return validatedBy;
    }

    public void setValidatedBy(Long validatedBy) {
        this.validatedBy = validatedBy;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getValidatedAt() {
        return validatedAt;
    }

    public void setValidatedAt(LocalDateTime validatedAt) {
        this.validatedAt = validatedAt;
    }

    public String getIngredients() {
        return ingredients;
    }

    public void setIngredients(String ingredients) {
        this.ingredients = ingredients;
    }

    public String getInstructions() {
        return instructions;
    }

    public void setInstructions(String instructions) {
        this.instructions = instructions;
    }

    public boolean isQuick() {
        return isQuick;
    }

    public void setQuick(boolean quick) {
        isQuick = quick;
    }

    public boolean isHealthy() {
        return isHealthy;
    }

    public void setHealthy(boolean healthy) {
        isHealthy = healthy;
    }

    public boolean isHasFewIngredients() {
        return hasFewIngredients;
    }

    public void setHasFewIngredients(boolean hasFewIngredients) {
        this.hasFewIngredients = hasFewIngredients;
    }
}

