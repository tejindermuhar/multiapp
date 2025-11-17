"use server";

import { createClient } from "@/lib/supabase/server";

// Keep your existing auth functions, just add these:

export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createClient();
  
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) return null;

  return {
    id: user.id,
    name: user.user_metadata?.name || user.user_metadata?.full_name || "",
    email: user.email || "",
  } as User;
}

export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return !!user;
}
