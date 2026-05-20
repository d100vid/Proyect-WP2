package com.projectapp.controller;

import com.projectapp.model.Recipe;
import com.projectapp.model.User;
import com.projectapp.repository.UserRepository;
import com.projectapp.service.RecipeService;
import com.projectapp.dto.CreateRecipeRequest;
import com.projectapp.dto.RecipeResponse;
import com.projectapp.dto.ValidateRecipeRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.io.IOException;
import java.util.Optional;

@RestController
@RequestMapping("/api/recipes")
@CrossOrigin(origins = "http://localhost:5173")
public class RecipeController {
    private final RecipeService recipeService;
    private final UserRepository userRepository;

    public RecipeController(RecipeService recipeService, UserRepository userRepository) {
        this.recipeService = recipeService;
        this.userRepository = userRepository;
    }

    // Crear receta con upload de imagen
    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> createRecipe(
            @RequestParam("title") String title,
            @RequestParam("time") String time,
            @RequestParam("difficulty") String difficulty,
            @RequestParam("ingredients") String ingredients,
            @RequestParam("instructions") String instructions,
            @RequestParam("isQuick") boolean isQuick,
            @RequestParam("isHealthy") boolean isHealthy,
            @RequestParam("hasFewIngredients") boolean hasFewIngredients,
            @RequestParam("userId") Long userId,
            @RequestParam(value = "image", required = false) MultipartFile imageFile) {
        try {
            // Verificar que el usuario existe
            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "User not found");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

            // Procesar imagen
            String imageBase64 = null;
            if (imageFile != null && !imageFile.isEmpty()) {
                byte[] imageBytes = imageFile.getBytes();
                imageBase64 = "data:image/png;base64," + Base64.getEncoder().encodeToString(imageBytes);
            }

            // Crear request
            CreateRecipeRequest request = new CreateRecipeRequest();
            request.setTitle(title);
            request.setTime(time);
            request.setDifficulty(difficulty);
            request.setIngredients(ingredients);
            request.setInstructions(instructions);
            request.setQuick(isQuick);
            request.setHealthy(isHealthy);
            request.setHasFewIngredients(hasFewIngredients);

            // Crear receta
            Recipe recipe = recipeService.createRecipe(request, userId, imageBase64);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Recipe created successfully! Waiting for admin validation.");
            response.put("recipe", recipeService.toDTO(recipe));

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IOException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error processing image: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    // Obtener recetas validadas (para usuarios normales)
    @GetMapping("/validated")
    public ResponseEntity<List<RecipeResponse>> getValidatedRecipes() {
        List<Recipe> recipes = recipeService.getValidatedRecipes();
        return ResponseEntity.ok(recipeService.toDTOList(recipes));
    }

    // Obtener todas las recetas (solo para admins)
    @GetMapping("/all")
    public ResponseEntity<List<RecipeResponse>> getAllRecipes(
            @RequestParam(value = "userId", required = false) Long userId) {
        try {
            // Verificar que es admin
            if (userId != null) {
                Optional<User> userOpt = userRepository.findById(userId);
                if (userOpt.isEmpty() || !userOpt.get().getRole().equals("Admin")) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
                }
            }

            List<Recipe> recipes = recipeService.getAllRecipes();
            return ResponseEntity.ok(recipeService.toDTOList(recipes));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // Obtener recetas pendientes de validación (solo para admins)
    @GetMapping("/pending")
    public ResponseEntity<List<RecipeResponse>> getPendingRecipes(
            @RequestParam(value = "userId", required = false) Long userId) {
        try {
            // Verificar que es admin
            if (userId != null) {
                Optional<User> userOpt = userRepository.findById(userId);
                if (userOpt.isEmpty() || !userOpt.get().getRole().equals("Admin")) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
                }
            }

            List<Recipe> recipes = recipeService.getPendingRecipes();
            return ResponseEntity.ok(recipeService.toDTOList(recipes));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // Obtener recetas de un usuario concreto (incluye pendientes y validadas)
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<RecipeResponse>> getRecipesByUser(@PathVariable Long userId) {
        try {
            List<Recipe> recipes = recipeService.getRecipesByUser(userId);
            return ResponseEntity.ok(recipeService.toDTOList(recipes));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // Validar receta (solo para admins)
    @PostMapping("/validate")
    public ResponseEntity<Map<String, Object>> validateRecipe(
            @RequestBody ValidateRecipeRequest request,
            @RequestParam(value = "adminId") Long adminId) {
        try {
            // Verificar que es admin
            Optional<User> adminOpt = userRepository.findById(adminId);
            if (adminOpt.isEmpty() || !adminOpt.get().getRole().equals("Admin")) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Only admins can validate recipes");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
            }

            Recipe recipe = recipeService.validateRecipe(
                request.getRecipeId(),
                adminId,
                request.isApproved()
            );

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", request.isApproved() ? 
                "Recipe approved and published!" : "Recipe rejected");
            response.put("recipe", recipeService.toDTO(recipe));

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    // Obtener receta por ID
    @GetMapping("/{id}")
    public ResponseEntity<RecipeResponse> getRecipeById(@PathVariable Long id) {
        try {
            Recipe recipe = recipeService.getRecipeById(id);
            return ResponseEntity.ok(recipeService.toDTO(recipe));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }
}

