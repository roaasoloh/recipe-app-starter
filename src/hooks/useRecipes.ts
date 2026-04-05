import { useEffect, useState } from "react";
import type { NewRecipe, Recipe } from "../types/recipe";
import { createRecipe, getAllRecipes, updateRecipe, deleteRecipe } from "../services/recipeService";

// Custom hook for loading and managing all recipes
export function useRecipes(userId?: string | null) {
  // Stores all recipes
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Loads all recipes
  async function loadRecipes() {
    setLoading(true);
    setError("");

    const { data, error } = await getAllRecipes();

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setRecipes(data ?? []);
    setLoading(false);
  }

  // Reload recipes on mount
  useEffect(() => {
    async function fetchRecipes() {
      await loadRecipes();
    }
    fetchRecipes();
  }, []);

  // Adds a new recipe
  async function addRecipe(recipe: NewRecipe) {
    if (!userId) {
      setError("You must be signed in to add recipes.");
      return false;
    }
    clearMessages();
    const { error } = await createRecipe(recipe);

    if (error) {
      setError(error.message);
      return false;
    }

    setSuccessMessage("Recipe added successfully.");
    await loadRecipes();
    return true;
  }

  // Updates an existing recipe
  async function editRecipe(recipeId: number, updatedData: Partial<NewRecipe>) {
    if (!userId) {
      setError("You must be signed in to update recipes.");
      return false;
    }
    clearMessages();
    const { error } = await updateRecipe(recipeId, updatedData, userId);

    if (error) {
      setError(error.message);
      return false;
    }

    setSuccessMessage("Recipe updated successfully.");
    await loadRecipes();
    return true;
  }

  // Deletes a recipe
  async function removeRecipe(recipeId: number) {
    if (!userId) {
      setError("You must be signed in to delete recipes.");
      return false;
    }
    clearMessages();
    const { error } = await deleteRecipe(recipeId, userId);

    if (error) {
      setError(error.message);
      return false;
    }

    setSuccessMessage("Recipe deleted successfully.");
    await loadRecipes();
    return true;
  }

  // Helper to clear messages
  function clearMessages() {
    setError("");
    setSuccessMessage("");
  }

  return {
    recipes,
    loading,
    error,
    successMessage,
    addRecipe,
    editRecipe,
    removeRecipe,
    refreshRecipes: loadRecipes,
    clearMessages,
  };
}

