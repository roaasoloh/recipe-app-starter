import { supabase } from "../lib/supabaseClient";

export async function getCategories(){
    return await supabase.from("category").select("*").order("id")
}