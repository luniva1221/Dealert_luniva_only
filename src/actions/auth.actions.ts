"use server";

import { authService } from "@/services/auth.service";
import { registerSchema, loginSchema, RegisterInput, LoginInput } from "@/validations/auth.schema";

export async function registerAction(data: RegisterInput) {
  try {
    const validated = registerSchema.parse(data);
    const result = await authService.register(validated);

    return { success: true, user: result.user };
  } catch (err: any) {
    return { success: false, error: err.message || "Registration failed" };
  }
}

export async function loginAction(data: LoginInput) {
  try {
    const validated = loginSchema.parse(data);
    const result = await authService.login(validated);

    return { success: true, user: result.user, accessToken: result.accessToken };
  } catch (err: any) {
    return { success: false, error: err.message || "Login failed" };
  }
}

export async function logoutAction() {
  await authService.logout();
  return { success: true };
}
