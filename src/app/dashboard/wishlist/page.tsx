"use client";

import { useWishlist } from "@/hooks/useWishlist";
import { useProducts } from "@/hooks/useProducts";
import { formatCurrency } from "@/lib/jwt";
import { Heart, Trash2, Eye, ShoppingBag, ArrowDownRight } from "lucide-react";
import Link from "next/link";

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist } = useWishlist();

  // Load products to find details of wishlisted items
  const { data: products, isLoading } = useProducts();

  const wishlistedProducts = products?.filter((p) => wishlistItems.includes(p.id)) || [];

  return (
    <div className="space-y-8 animate-fade-in text-foreground">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">My Wishlist</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Review saved products and track current price indices.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, idx) => (
            <div key={idx} className="h-24 bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
      ) : wishlistedProducts.length === 0 ? (
        <div className="text-center p-16 bg-card border border-border rounded-2xl space-y-4">
          <Heart className="h-10 w-10 text-muted-foreground mx-auto" />
          <p className="font-semibold text-foreground">Your wishlist is empty</p>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Browse our comparison list and tap the heart icon to save products here.
          </p>
          <Link
            href="/products"
            className="bg-primary hover:bg-primary/95 text-primary-foreground text-xs font-semibold px-5 py-2.5 rounded-xl inline-block"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {wishlistedProducts.map((product) => (
            <div
              key={product.id}
              className="bg-card border border-border rounded-xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
            >
              {/* Product Image */}
              <div className="h-20 w-20 rounded-lg overflow-hidden bg-muted shrink-0 relative">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.discountPercentage > 0 && (
                  <span className="absolute bottom-1 right-1 bg-destructive text-destructive-foreground text-[8px] font-bold px-1 rounded flex items-center">
                    <ArrowDownRight className="h-2 w-2" />
                    <span>{product.discountPercentage}%</span>
                  </span>
                )}
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex justify-between items-start gap-2">
                  <span className="text-[8px] bg-muted px-2 py-0.5 rounded text-foreground font-semibold uppercase">
                    {product.sellerName}
                  </span>
                </div>
                <h3 className="font-bold text-xs sm:text-sm text-foreground truncate max-w-xs">
                  {product.name}
                </h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-extrabold text-foreground">
                    {formatCurrency(product.currentPrice)}
                  </span>
                  {product.discountPercentage > 0 && (
                    <span className="text-[10px] text-muted-foreground line-through">
                      {formatCurrency(product.originalPrice)}
                    </span>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col gap-2">
                <Link
                  href={`/products/${product.id}`}
                  className="p-2 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground rounded-lg transition-colors flex items-center justify-center"
                  title="Track Product"
                >
                  <Eye className="h-4 w-4" />
                </Link>

                <button
                  onClick={() => removeFromWishlist(product.id)}
                  className="p-2 bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground rounded-lg transition-colors flex items-center justify-center cursor-pointer"
                  title="Remove from Wishlist"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
