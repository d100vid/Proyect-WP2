package com.projectapp.dto;

public class ValidateRecipeRequest {
    private Long recipeId;
    private boolean approved;

    public ValidateRecipeRequest() {
    }

    public ValidateRecipeRequest(Long recipeId, boolean approved) {
        this.recipeId = recipeId;
        this.approved = approved;
    }

    public Long getRecipeId() {
        return recipeId;
    }

    public void setRecipeId(Long recipeId) {
        this.recipeId = recipeId;
    }

    public boolean isApproved() {
        return approved;
    }

    public void setApproved(boolean approved) {
        this.approved = approved;
    }
}

