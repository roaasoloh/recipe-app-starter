import { supabase } from "../lib/supabaseClient";

const BUCKET = "recipeimages";

// Upload an image file and return the public URL
export async function uploadRecipeImage(userId: string, file: File): Promise<string> {
  const fileExt = file.name.split(".").pop();
  const filePath = `${userId}/${Date.now()}.${fileExt}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, file);

  if (error) throw error;

  const { data } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(filePath);

  return data.publicUrl;
}

// Get the public URL for an image path
export function getRecipeImageUrl(imagePath: string): string {
  const { data } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(imagePath);

  return data.publicUrl;
}

// Replace an existing image: removes the old one, uploads the new one
export async function replaceRecipeImage(
  userId: string,
  oldImageUrl: string,
  newFile: File
): Promise<string> {
  // Remove the old image (best-effort)
  await removeRecipeImage(oldImageUrl);
  // Upload the new one
  return uploadRecipeImage(userId, newFile);
}

// Remove an image from storage by its public URL
export async function removeRecipeImage(imageUrl: string): Promise<void> {
  const filePath = extractPathFromUrl(imageUrl);
  if (!filePath) return;

  const { error } = await supabase.storage
    .from(BUCKET)
    .remove([filePath]);

  if (error) throw error;
}

// Extract the storage path from a full public URL
function extractPathFromUrl(url: string): string | null {
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return url.substring(idx + marker.length);
}
