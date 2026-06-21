"use server";

import { productService } from "@/services/product.service";
import { getMongoDb } from "@/lib/mongodb";
import { verifyAccessToken } from "@/lib/jwt";
import { cookies } from "next/headers";

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  if (!token) throw new Error("Unauthorized");
  try {
    const payload = await verifyAccessToken(token);
    if (payload.role !== "ADMIN" && payload.role !== "SUPER_ADMIN") {
      throw new Error("Forbidden");
    }
    return payload;
  } catch {
    throw new Error("Unauthorized");
  }
}

export async function getProductsAction() {
  await requireAdmin();
  const res = await productService.getProducts({ limit: 100 });
  return res.products.map((p: any) => ({
    ...p,
    id: p._id?.toString() || p.id,
  }));
}

export async function updateProductPriceAction(id: string, newPrice: number) {
  await requireAdmin();
  const db = await getMongoDb();
  
  // Find product to calculate new discount percentages
  const product = await db.collection("products").findOne({ _id: id as any });
  if (!product) throw new Error("Product not found");

  const originalPrice = product.originalPrice || product.currentPrice || newPrice;
  const discountPercentage = originalPrice > newPrice 
    ? Math.round(((originalPrice - newPrice) / originalPrice) * 100) 
    : 0;

  // Update product current price
  await db.collection("products").updateOne(
    { _id: id as any },
    {
      $set: {
        currentPrice: newPrice,
        discountPercentage,
        updatedAt: new Date(),
      },
    }
  );

  // Push new history point
  await db.collection("price_history").insertOne({
    productId: id,
    price: newPrice,
    recordedAt: new Date(),
  });

  return { success: true };
}

export const ProductService = {
  getProducts: getProductsAction,
  updateProductPrice: updateProductPriceAction,
};
