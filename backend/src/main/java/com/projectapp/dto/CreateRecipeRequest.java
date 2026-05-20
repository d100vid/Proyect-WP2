package com.projectapp.dto;

public class CreateRecipeRequest {
    private String title;
    private String time;
    private String difficulty;
    private String category;
    private String ingredients;
    private String instructions;
    private boolean isQuick;
    private boolean isHealthy;
    private boolean hasFewIngredients;

    public CreateRecipeRequest() {
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
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

