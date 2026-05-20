package com.projectapp.dto;

import java.time.LocalDateTime;

public class RecipeResponse {
    private Long id;
    private String title;
    private String image;
    private String time;
    private String difficulty;
    private String category;
    private Long userId;
    private boolean validated;
    private Long validatedBy;
    private LocalDateTime createdAt;
    private LocalDateTime validatedAt;
    private String ingredients;
    private String instructions;
    private boolean isQuick;
    private boolean isHealthy;
    private boolean hasFewIngredients;

    public RecipeResponse() {
    }

    public RecipeResponse(Long id, String title, String image, String time, String difficulty, 
                        Long userId, boolean validated, LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.image = image;
        this.time = time;
        this.difficulty = difficulty;
        this.userId = userId;
        this.validated = validated;
        this.createdAt = createdAt;
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

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
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

