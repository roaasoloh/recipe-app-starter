export type Recipe = {
    id:number;
    title:string;
    description: string;
    prep_time:number;
    category_id: number;
    user_id:string;
    created_at?:string;
    owner_email?: string | null;
    profiles?: {
        email: string | null;
    } | null;
    image_path?: string | null;
}

export type NewRecipe = {
    title:string;
    description: string;
    prep_time:number;
    category_id: number;
    user_id:string;
    image_path?: string | null;
}

export type RecipeFormValues = {
    title:string;
    description: string;
    prep_time:number;
    categoryId: string;
    imageFile?: File | null;
}