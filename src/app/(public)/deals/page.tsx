"use client";

import { useState } from "react";
import { useProducts } from "@/hooks/useProducts";
import { useWishlist } from "@/hooks/useWishlist";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { ArrowDownRight, Heart, Sparkles, AlertTriangle, Eye } from "lucide-react";
import { formatCurrency } from "@/lib/jwt";
import Link from "next/link";

type DealTab = "biggest" | "daily" | "weekly" | "trending";

export default function DealsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<DealTab>("biggest");
  const { wishlistItems, toggleWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();

  // Load products sorted differently depending on the active tab
  const { data: biggestDiscounts, isLoading: loadingBiggest } = useProducts({ sortBy: "discount" });
  const { data: trendingDeals, isLoading: loadingTrending } = useProducts({ sortBy: "rating" });

  // Simulated drops
  const dailyDrops = biggestDiscounts?.slice(0, 3) || [];
  const weeklyDrops = biggestDiscounts?.slice(2, 6) || [];

  const isLoading = loadingBiggest || loadingTrending;

  const getActiveProducts = () => {
    switch (activeTab) {
      case "biggest":
        return biggestDiscounts || [];
      case "daily":
        return dailyDrops;
      case "weekly":
        return weeklyDrops;
      case "trending":
        return trendingDeals || [];
      default:
        return [];
    }
  };

  const activeProducts = getActiveProducts();

  const tabLabels = [
    { id: "biggest", label: "Biggest Discounts", description: "Highest discount margins online" },
    { id: "daily", label: "Daily Drops", description: "Price drops detected in the last 24h" },
    { id: "weekly", label: "Weekly Drops", description: "Items trending downwards this week" },
    { id: "trending", label: "Trending Deals", description: "Top customer-rated deals right now" },
  ];

  return (
    <div className="container mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary fill-primary" />
            <span>Hot Deals & Pricing Drops</span>
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm mt-1">
            Aggregated bargains categorized by size of discount and time of drop.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-muted/40 p-2 rounded-2xl border border-border/60">
        {tabLabels.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as DealTab)}
            className={`px-4 py-3 rounded-xl transition-all text-center flex flex-col items-center justify-center space-y-0.5 cursor-pointer ${activeTab === tab.id
                ? "bg-card text-foreground shadow font-bold border border-border"
                : "text-muted-foreground hover:text-foreground hover:bg-card/40"
              }`}
          >
            <span className="text-xs font-semibold">{tab.label}</span>
            <span className="text-[9px] text-muted-foreground/80 font-medium hidden sm:inline-block">
              {tab.description}
            </span>
          </button>
        ))}
      </div>

      {/* Deal Products Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, idx) => (
            <div key={idx} className="rounded-xl border border-border p-4 space-y-4 animate-pulse">
              <div className="aspect-video bg-muted rounded-lg" />
              <div className="h-4 bg-muted w-2/3 rounded" />
              <div className="h-3 bg-muted w-full rounded" />
              <div className="h-5 bg-muted w-1/2 rounded" />
            </div>
          ))}
        </div>
      ) : activeProducts.length === 0 ? (
        <div className="text-center p-16 bg-card border border-border rounded-2xl space-y-2">
          <AlertTriangle className="h-10 w-10 text-muted-foreground mx-auto" />
          <p className="font-semibold text-foreground">No recent drops detected</p>
          <p className="text-xs text-muted-foreground">Please check back in a few minutes as our crawlers update.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {activeProducts.map((product) => {
            const wish = wishlistItems.includes(product.id);
            return (
              <div
                key={product.id}
                className="rounded-xl border border-border bg-card shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col justify-between overflow-hidden relative group"
              >
                {/* Sale tag */}
                <div className="absolute top-3 left-3 z-10 bg-destructive text-destructive-foreground text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-0.5">
                  <ArrowDownRight className="h-3 w-3" />
                  <span>{product.discountPercentage}% OFF</span>
                </div>

                <div className="aspect-video relative overflow-hidden bg-muted">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      if (!isAuthenticated) {
                        router.push(`/login?redirect=/deals`);
                      } else {
                        toggleWishlist(product.id);
                      }
                    }}
                    className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-colors cursor-pointer border ${wish
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background/80 text-muted-foreground border-border hover:text-foreground"
                      }`}
                  >
                    <Heart className="h-4 w-4" />
                  </button>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider block">
                      {product.category}
                    </span>
                    <Link
                      href={`/products/${product.id}`}
                      className="block font-bold text-foreground text-sm hover:text-primary transition-colors line-clamp-1"
                    >
                      {product.name}
                    </Link>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <div className="flex items-end justify-between pt-2 border-t border-border/50">
                    <div>
                      <span className="text-[10px] text-muted-foreground line-through block">
                        {formatCurrency(product.originalPrice)}
                      </span>
                      <span className="text-base font-extrabold text-foreground">
                        {formatCurrency(product.currentPrice)}
                      </span>
                    </div>
                    <Link
                      href={`/products/${product.id}`}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold px-3.5 py-2 rounded-lg flex items-center gap-1 transition-all"
                    >
                      <span>Track</span>
                      <Eye className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
