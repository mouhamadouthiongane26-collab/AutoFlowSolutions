import type { User } from "@supabase/supabase-js";

export function isInvalidRefreshTokenError(error: unknown) {
  if (!error || typeof error !== "object") {
    return false;
  }

  const message = "message" in error && typeof error.message === "string" ? error.message : "";
  const code = "code" in error && typeof error.code === "string" ? error.code : "";

  return code === "refresh_token_not_found" || message.toLowerCase().includes("invalid refresh token");
}

export async function getCurrentUser(supabase: { auth: { getUser: () => Promise<{ data?: { user: User | null }; error?: unknown }> } }) {
  try {
    const { data, error } = await supabase.auth.getUser();

    if (isInvalidRefreshTokenError(error)) {
      return { user: null, invalidRefreshToken: true };
    }

    return { user: data?.user ?? null, invalidRefreshToken: false };
  } catch (error) {
    if (isInvalidRefreshTokenError(error)) {
      return { user: null, invalidRefreshToken: true };
    }

    throw error;
  }
}
