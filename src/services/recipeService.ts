import { supabase } from "../lib/supabaseClient";
import type { NewRecipe, Recipe } from "../types/recipe";

export async function createRecipe(recipe: NewRecipe) {
  return await supabase.from("recipes").insert([recipe]);
}

export async function getAllRecipes(): Promise<{
  data: Recipe[] | null;
  error: { message: string } | null;
}> {
  const { data, error } = await supabase
    .from("recipes")
    .select(`
      *,
      profiles (
        email
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    return { data: null, error: { message: error.message } };
  }

  const mappedRecipes: Recipe[] = (data ?? []).map((row: Recipe) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    prep_time: row.prep_time,
    category_id: row.category_id,
    user_id: row.user_id,
    created_at: row.created_at,
    image_path: row.image_path ?? null,
    owner_email: row.profiles?.email ?? null,
    profiles: row.profiles ?? null,
  }));

  return { data: mappedRecipes, error: null };
}

export async function updateRecipe(recipeId: number, updatedRecipe: Partial<NewRecipe>, userId: string) {
  return await supabase
    .from("recipes")
    .update(updatedRecipe)
    .eq("id", recipeId)
    .eq("user_id", userId);
}

export async function deleteRecipe(recipeId: number, userId: string) {
  return await supabase
    .from("recipes")
    .delete()
    .eq("id", recipeId)
    .eq("user_id", userId);
}