import { useState, useEffect, useRef } from "react";
import type { Category } from "../types/category";
import type { NewRecipe, Recipe, RecipeFormValues } from "../types/recipe";

type RecipeFormProps = {
  categories: Category[];
  userId: string;
  userEmail: string;
  editingRecipe: Recipe | null;
  onAddRecipe: (recipe: NewRecipe, imageFile?: File) => Promise<boolean>;
  onEditRecipe: (recipeId: number, recipe: Partial<NewRecipe>, imageFile?: File) => Promise<boolean>;
  onCancelEdit: () => void;
  error: string;
  successMessage: string;
};

const initialForm: RecipeFormValues = {
  title: "",
  description: "",
  prep_time: 0,
  categoryId: "",
};

export default function RecipeForm({
  categories,
  userId,
  editingRecipe,
  onAddRecipe,
  onEditRecipe,
  onCancelEdit,
  error,
  successMessage,
}: RecipeFormProps) {
  const [form, setForm] = useState<RecipeFormValues>(initialForm);
  const [localError, setLocalError] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function setFormData() {
      if (editingRecipe) {
        setForm({
          title: editingRecipe.title,
          description: editingRecipe.description,
          prep_time: editingRecipe.prep_time,
          categoryId: editingRecipe.category_id.toString(),
        });
        setImageFile(null);
        setImagePreview(editingRecipe.image_path || null);
        setLocalError("");
      } else {
        setForm(initialForm);
        setImageFile(null);
        setImagePreview(null);
      }
    }
    setFormData();
  }, [editingRecipe]);

  function updateField<K extends keyof RecipeFormValues>(key: K, value: RecipeFormValues[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validate() {
    if (!form.title.trim() || !form.description.trim() || !form.prep_time || !String(form.categoryId).trim()) {
      setLocalError("All fields are required.");
      return false;
    }
    if (Number(form.prep_time) <= 0) {
      setLocalError("Prep time must be greater than zero.");
      return false;
    }
    setLocalError("");
    return true;
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(editingRecipe?.image_path || null);
    }
  }

  function clearImage() {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    if (editingRecipe) {
      const ok = await onEditRecipe(editingRecipe.id, {
        title: form.title.trim(),
        description: form.description.trim(),
        prep_time: Number(form.prep_time),
        category_id: Number(form.categoryId),
      }, imageFile || undefined);
      if (ok) onCancelEdit();
    } else {
      const recipe: NewRecipe = {
        title: form.title.trim(),
        description: form.description.trim(),
        prep_time: Number(form.prep_time),
        category_id: Number(form.categoryId),
        user_id: userId,
      };
      const ok = await onAddRecipe(recipe, imageFile || undefined);
      if (ok) {
        setForm(initialForm);
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    }
  }

  return (
    <div className="form-card">
      <form onSubmit={handleSubmit}>
        <h2 style={{ marginBottom: "1.5rem" }}>{editingRecipe ? "Edit Recipe" : "Share a New Recipe"}</h2>

        <div className="form-group">
          <label>Recipe Title</label>
          <input
            type="text"
            placeholder="e.g. Grandma's Apple Pie"
            value={form.title}
            onChange={(e) => updateField("title", e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Description & Instructions</label>
          <textarea
            placeholder="Share the steps and magic behind this recipe..."
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
          />
        </div>

        <div style={{ display: "flex", gap: "1.5rem" }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Prep Time (minutes)</label>
            <input
              type="number"
              min="1"
              value={form.prep_time}
              onChange={(e) => updateField("prep_time", Number(e.target.value))}
            />
          </div>

          <div className="form-group" style={{ flex: 2 }}>
            <label>Category</label>
            <select
              value={form.categoryId}
              onChange={(e) => updateField("categoryId", e.target.value)}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id.toString()}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>{editingRecipe ? "Replace Image (optional)" : "Recipe Image (optional)"}</label>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
          />
          {imagePreview && (
            <div style={{ marginTop: "0.75rem" }}>
              <img
                src={imagePreview}
                alt="Preview"
                style={{ maxWidth: "200px", maxHeight: "150px", borderRadius: "8px", objectFit: "cover" }}
              />
              <div style={{ marginTop: "0.5rem" }}>
                <button type="button" className="btn-outline" onClick={clearImage} style={{ fontSize: "0.85rem", padding: "0.3rem 0.8rem" }}>
                  Remove Image
                </button>
              </div>
            </div>
          )}
        </div>

        {localError && <p className="error-msg">{localError}</p>}
        {error && <p className="error-msg">{error}</p>}
        {successMessage && <p className="success-msg">{successMessage}</p>}

        <div style={{ display: "flex", gap: "10px", marginTop: "1rem" }}>
          <button type="submit">{editingRecipe ? "Save Changes" : "Post Recipe"}</button>
          {editingRecipe && (
            <button type="button" className="btn-outline" onClick={onCancelEdit}>Cancel Edit</button>
          )}
        </div>
      </form>
    </div>
  );
}

