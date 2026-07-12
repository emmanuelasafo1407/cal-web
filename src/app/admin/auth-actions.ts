"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAdmin(formData: FormData) {
  const usernameInput = formData.get("username") as string;
  const passwordInput = formData.get("password") as string;

  const systemUsername = process.env.ADMIN_USERNAME || "master_ofori";
  const systemPassword = process.env.ADMIN_PASSWORD || "LibertySecurePortal2026!";

  if (usernameInput === systemUsername && passwordInput === systemPassword) {
    const cookieStore = await cookies();
    
    // Assigns a secure, server-only session token to guard the layout route
    cookieStore.set("admin_session_token", "active_authenticated_state", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 4, // Clears automatically after 4 hours of session inactivity
      path: "/",
    });

    return { success: true };
  }

  return { success: false, error: "Invalid cryptographic terminal access credentials." };
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session_token");
  redirect("/");
}