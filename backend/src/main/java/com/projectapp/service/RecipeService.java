package com.projectapp.service;

import com.projectapp.model.Recipe;
import com.projectapp.repository.RecipeRepository;
import com.projectapp.dto.CreateRecipeRequest;
import com.projectapp.dto.RecipeResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RecipeService {
    private final RecipeRepository recipeRepository;

    public RecipeService(RecipeRepository recipeRepository) {
        this.recipeRepository = recipeRepository;
    }

    // Crear nueva receta (no validada por defecto)
    @Transactional
    public Recipe createRecipe(CreateRecipeRequest request, Long userId, String imageBase64) throws Exception {
        // Validar campos requeridos
        if (request.getTitle() == null || request.getTitle().trim().isEmpty()) {
            throw new Exception("Recipe title is required");
        }

        Recipe recipe = new Recipe();
        recipe.setTitle(request.getTitle());
        recipe.setTime(request.getTime());
        recipe.setDifficulty(request.getDifficulty());
        recipe.setImage(imageBase64);
        recipe.setIngredients(request.getIngredients());
        recipe.setInstructions(request.getInstructions());
        recipe.setUserId(userId);
        recipe.setValidated(false); // Por defecto, no validada
        recipe.setCreatedAt(LocalDateTime.now());
        recipe.setQuick(request.isQuick());
        recipe.setHealthy(request.isHealthy());
        recipe.setHasFewIngredients(request.isHasFewIngredients());

        return recipeRepository.save(recipe);
    }

    // Obtener todas las recetas validadas (para usuarios normales)
    public List<Recipe> getValidatedRecipes() {
        return recipeRepository.findByValidatedTrue();
    }

    // Obtener todas las recetas (solo para admins)
    public List<Recipe> getAllRecipes() {
        return recipeRepository.findAll();
    }

    // Obtener recetas pendientes de validación (solo para admins)
    public List<Recipe> getPendingRecipes() {
        return recipeRepository.findByValidatedFalse();
    }

    // Validar receta (solo para admins)
    @Transactional
    public Recipe validateRecipe(Long recipeId, Long adminId, boolean approved) throws Exception {
        Recipe recipe = recipeRepository.findById(recipeId)
            .orElseThrow(() -> new Exception("Recipe not found"));

        if (approved) {
            recipe.setValidated(true);
            recipe.setValidatedBy(adminId);
            recipe.setValidatedAt(LocalDateTime.now());
        } else {
            // Si es rechazada, se puede opcionalmente marcar o eliminar
            recipeRepository.deleteById(recipeId);
            throw new Exception("Recipe rejected and deleted");
        }

        return recipeRepository.save(recipe);
    }

    // Obtener receta por ID
    public Recipe getRecipeById(Long id) throws Exception {
        return recipeRepository.findById(id)
            .orElseThrow(() -> new Exception("Recipe not found"));
    }

    // Convertir a DTO
    public RecipeResponse toDTO(Recipe recipe) {
        RecipeResponse response = new RecipeResponse();
        response.setId(recipe.getId());
        response.setTitle(recipe.getTitle());
        response.setImage(recipe.getImage());
        response.setTime(recipe.getTime());
        response.setDifficulty(recipe.getDifficulty());
        response.setUserId(recipe.getUserId());
        response.setValidated(recipe.isValidated());
        response.setValidatedBy(recipe.getValidatedBy());
        response.setCreatedAt(recipe.getCreatedAt());
        response.setValidatedAt(recipe.getValidatedAt());
        response.setIngredients(recipe.getIngredients());
        response.setInstructions(recipe.getInstructions());
        response.setQuick(recipe.isQuick());
        response.setHealthy(recipe.isHealthy());
        response.setHasFewIngredients(recipe.isHasFewIngredients());
        return response;
    }

    public List<RecipeResponse> toDTOList(List<Recipe> recipes) {
        return recipes.stream().map(this::toDTO).collect(Collectors.toList());
    }

    // Obtener recetas por usuario (incluye pendientes y validadas)
    public List<Recipe> getRecipesByUser(Long userId) {
        return recipeRepository.findByUserId(userId);
    }
}

