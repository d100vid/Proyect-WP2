package com.projectapp.repository;

import com.projectapp.model.Recipe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecipeRepository extends JpaRepository<Recipe, Long> {
    // Obtener recetas validadas
    List<Recipe> findByValidatedTrue();

    // Obtener recetas pendientes de validación
    List<Recipe> findByValidatedFalse();

    // Obtener recetas por usuario
    List<Recipe> findByUserId(Long userId);

    // Obtener recetas validadas por usuario
    List<Recipe> findByUserIdAndValidatedTrue(Long userId);
}

