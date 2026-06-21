"use server";

import { alertService } from "@/services/alert.service";
import { createAlertSchema } from "@/validations/alert.schema";
import { cookies } from "next/headers";
import { verifyRefreshToken } from "@/lib/jwt";

async function getUserIdFromSession(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("refresh_token")?.value;
  if (!token) return null;
  try {
    const payload = await verifyRefreshToken(token);
    return payload.userId;
  } catch {
    return null;
  }
}

export async function createAlertAction(productId: string, targetPrice: number) {
  try {
    const userId = await getUserIdFromSession();
    if (!userId) throw new Error("Unauthorized");

    createAlertSchema.parse({ productId, targetPrice });

    const alert = await alertService.createAlert(userId, {
      productId,
      targetPrice,
    });

    return { success: true, alert };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to create alert" };
  }
}

export async function deleteAlertAction(id: string) {
  try {
    const userId = await getUserIdFromSession();
    if (!userId) throw new Error("Unauthorized");

    await alertService.deleteAlert(id, userId);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete alert" };
  }
}
export default createAlertAction;
