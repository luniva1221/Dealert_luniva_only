"use client";

import { use, useState, useMemo } from "react";
import { useProductDetails } from "@/hooks/useProducts";
import { useWishlist } from "@/hooks/useWishlist";
import { useAlerts } from "@/hooks/useAlerts";
import { useAuth } from "@/hooks/useAuth";
import {
  Heart,
  Bell,
  ArrowDownRight,
  ExternalLink,
  ChevronLeft,
  AlertCircle,
  TrendingDown,
  TrendingUp,
  Activity,
  Check,
  Loader2,
  X,
  CalendarClock
} from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createAlertSchema, CreateAlertInput } from "@/validations/alert.schema";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { useRouter } from "next/navigation";
import {formatCurrency} from '@/lib/format';

export default function ProductDetailPage({ params }: { params: Promise<{ itemId: string }> }) {
  const resolvedParams = use(params);
  const itemId = resolvedParams.itemId;
  const router = useRouter();

  const { data: product, isLoading, error } = useProductDetails(itemId);
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { createAlert, alerts } = useAlerts();
  const { isAuthenticated } = useAuth();

  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [alertSuccess, setAlertSuccess] = useState(false);

  // Zod alert schema hook
 
const {
  register,
  handleSubmit,
  formState: { errors, isSubmitting },
  reset,
  setValue,
} = useForm<CreateAlertInput>({
  resolver: zodResolver(createAlertSchema),
  defaultValues: {
    targetPrice: product?.currentPrice
      ? Math.floor(product.currentPrice * 0.95)
      : undefined,
  },
});

const chartData = useMemo(() => {
    if (!product?.priceHistory?.length) return [];
    return product.priceHistory.map((entry) => ({
      date: new Date(entry.recordedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      price: entry.price,
    }));
  }, [product?.priceHistory]);

  const priceStats = useMemo(() => {
    const prices = product?.priceHistory?.map((entry) => entry.price) ?? [];
    if (prices.length === 0) {
      return { minPrice: undefined, maxPrice: undefined, avgPrice: undefined };
    }
    return {
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
      avgPrice: prices.reduce((sum, p) => sum + p, 0) / prices.length,
    };
  }, [product?.priceHistory]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Retrieving price history data...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center space-y-4">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
        <h3 className="text-lg font-bold text-foreground">Product Not Found</h3>
        <p className="text-sm text-muted-foreground">The product ID might be invalid or deleted.</p>
        <Link href="/products" className="text-xs text-primary font-bold hover:underline">
          Back to compare products
        </Link>
      </div>
    );
  }

  const wish = isWishlisted(product.id);
  const discountAmount = product.originalPrice - product.currentPrice;

  // Check if user already has an alert for this product
  const existingAlert = alerts.find((a) => a.productId === product.id);

  const onSubmitAlert = async (data: CreateAlertInput) => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/products/${product.id}`);
      return;
    }

    try {
      await createAlert(
        product.id,
        data.targetPrice,
        product.currentPrice,
        product.name,
        product.imageUrl
      );
      setAlertSuccess(true);
      setTimeout(() => {
        setAlertSuccess(false);
        setAlertModalOpen(false);
        reset();
      }, 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 space-y-10">
      {/* Back button */}
      <div>
        <Link
          href="/products"
          className="inline-flex items-center text-xs font-semibold text-muted-foreground hover:text-foreground gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Back to Products</span>
        </Link>
      </div>

      {/* Main product card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Product Image */}
        <div className="lg:col-span-5 bg-card border border-border rounded-2xl p-6 shadow-sm flex items-center justify-center">
          <div className="aspect-square w-full relative overflow-hidden rounded-xl bg-muted">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Right Side: Product Details & CTA */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase">
                {product.category}
              </span>
              <span className="text-xs text-muted-foreground font-semibold">
                Updated {new Date(product.lastCrawledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">{product.name}</h1>

           <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <CalendarClock className="h-3.5 w-3.5" />
              <span>
                Tracked since {new Date(product.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </span>
            </div>
          </div>
          <hr className="border-border/60" />

          {/* Pricing Details */}
          <div className="p-5 bg-muted/40 rounded-2xl border border-border/50 flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Current Price</span>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-extrabold text-foreground">
                  {formatCurrency(product.currentPrice)}
                </span>
                {product.discountPercentage > 0 && (
                  <span className="bg-destructive/10 text-destructive text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-0.5">
                    <ArrowDownRight className="h-3.5 w-3.5" />
                    <span>{product.discountPercentage}% OFF</span>
                  </span>
                )}
              </div>
              {product.discountPercentage > 0 && (
                <p className="text-xs text-success font-semibold">
                  Saved {formatCurrency(discountAmount)} from original price
                </p>
              )}
            </div>

            <div className="space-y-1 text-left sm:text-right">
              <span className="text-xs text-muted-foreground block uppercase font-bold tracking-wider">Original Price</span>
              <span className="text-base text-muted-foreground line-through block">
                {formatCurrency(product.originalPrice)}
              </span>
              <span className="text-xs bg-card border border-border px-2 py-0.5 rounded text-foreground font-semibold inline-block mt-1">
                Seller: {product.sellerName}
              </span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            {existingAlert ? (
              <div className="flex-1 p-3.5 bg-success/10 border border-success/30 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-success font-semibold">
                  <Check className="h-4 w-4" />
                  <span>Tracking Alert: Trigger target {formatCurrency(existingAlert.targetPrice)}</span>
                </div>
                <Link href="/dashboard/alerts" className="text-primary hover:underline font-bold">
                  Manage
                </Link>
              </div>
            ) : (
              <button
                onClick={() => {
                  if (!isAuthenticated) {
                    router.push(`/login?redirect=/products/${product.id}`);
                  } else {
                    setValue("targetPrice", Math.round(product.currentPrice * 0.9)); // suggest 10% drop
                    setAlertModalOpen(true);
                  }
                }}
                className="flex-1 bg-primary hover:bg-primary/95 text-primary-foreground font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-all cursor-pointer"
              >
                <Bell className="h-4 w-4" />
                <span>Create Price Alert</span>
              </button>
            )}

            <button
              onClick={() => {
                if (!isAuthenticated) {
                  router.push(`/login?redirect=/products/${product.id}`);
                } else {
                  toggleWishlist(product.id);
                }
              }}
              className={`py-3 px-6 rounded-xl font-semibold border flex items-center justify-center gap-2 cursor-pointer transition-colors ${wish
                  ? "bg-primary/10 text-primary border-primary/30"
                  : "bg-card hover:bg-muted text-foreground border-border"
                }`}
            >
              <Heart className={`h-4 w-4 ${wish ? "fill-primary" : ""}`} />
              <span>{wish ? "Saved to Wishlist" : "Add to Wishlist"}</span>
            </button>

            <a
              href={product.productUrl}
              onClick={(e) => {
                if (!isAuthenticated) {
                  e.preventDefault();
                  router.push(`/login?redirect=/products/${product.id}`);
                }
              }}
              target={isAuthenticated ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="py-3 px-6 rounded-xl font-semibold border border-border hover:bg-muted text-foreground bg-card flex items-center justify-center gap-2 transition-colors"
            >
              <span>Visit Shop</span>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>
          </div>
        </div>
      </div>

      {/* Historical price section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Recharts Chart */}
        <div className="lg:col-span-8 bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-foreground">Historical Price Trends</h2>
            <p className="text-xs text-muted-foreground">Price logs captured over the past 30 days</p>
          </div>

         <div className="h-72 w-full">
            {chartData.length === 0 ? (
              <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground">
                No price history recorded yet for this product.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
                  <XAxis dataKey="date" stroke="#9ca3af" fontSize={10} tickLine={false} />
                  <YAxis stroke="#9ca3af" fontSize={10} domain={["dataMin - 1000", "dataMax + 1000"]} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      borderColor: "var(--border)",
                      borderRadius: "12px",
                      fontSize: "12px",
                    }}
                    formatter={(value: any) => [formatCurrency(value), "Price"]}
                  />
                  <Area type="monotone" dataKey="price" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#chartGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Price statistics sidebar */}
        <div className="lg:col-span-4 bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-6">
          <div>
            <h3 className="font-bold text-foreground">Price Analysis Statistics</h3>
            <p className="text-xs text-muted-foreground">Insights based on crawled price points</p>
          </div>

          <div className="space-y-4 flex-1 flex flex-col justify-center">
            {/* Lowest */}
            <div className="flex items-center gap-3 p-3 bg-success/5 rounded-xl border border-success/20">
              <div className="p-2 rounded-lg bg-success/10 text-success">
                <TrendingDown className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-muted-foreground">Lowest Capture</p>
                <p className="text-base font-bold text-foreground">{formatCurrency(priceStats.minPrice)}</p>
              </div>
            </div>

            {/* Highest */}
            <div className="flex items-center gap-3 p-3 bg-destructive/5 rounded-xl border border-destructive/20">
              <div className="p-2 rounded-lg bg-destructive/10 text-destructive">
                <TrendingUp className="h-5 w-5" />
              </div>
             <div>
                <p className="text-[10px] uppercase font-bold text-muted-foreground">Highest Capture</p>
                <p className="text-base font-bold text-foreground">{formatCurrency(priceStats.maxPrice)}</p>
              </div>
            </div>

            {/* Average */}
            <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-xl border border-primary/20">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-muted-foreground">Average Capture</p>
                <p className="text-base font-bold text-foreground">{formatCurrency(priceStats.avgPrice)}</p>
              </div>
            </div>
          </div>

          <div className="p-3 bg-muted rounded-xl text-[10px] text-muted-foreground text-center leading-relaxed">
            Prices are crawled automatically from seller catalog every 15 minutes. Final purchase prices may vary on actual merchant page.
          </div>
        </div>
      </div>

      {/* Alert creation modal overlay */}
      {alertModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md p-6 shadow-2xl relative space-y-4 animate-scale-up text-foreground">
            <button
              onClick={() => setAlertModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div>
              <h3 className="font-bold text-base">Configure Price Alert</h3>
              <p className="text-xs text-muted-foreground">
                Set a target threshold. We will email you immediately when price matches or drops.
              </p>
            </div>

            {alertSuccess ? (
              <div className="p-8 text-center space-y-2">
                <div className="h-10 w-10 bg-success/15 text-success rounded-full flex items-center justify-center mx-auto animate-bounce">
                  <Check className="h-5 w-5" />
                </div>
                <h4 className="font-bold text-sm">Alert Configured Successfully!</h4>
                <p className="text-xs text-muted-foreground">You can manage all alerts inside your User Dashboard.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmitAlert)} className="space-y-4">
                <div className="p-3 bg-muted/50 rounded-xl space-y-1 text-xs">
                  <p className="font-medium truncate">{product.name}</p>
                  <p className="text-muted-foreground">Current Price: <span className="font-bold text-foreground">{formatCurrency(product.currentPrice)}</span></p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold">Target Alert Price (NPR)</label>
                  <input
                    type="number"
                    placeholder="Enter target price, e.g. 130000"
                    className="w-full px-3 py-2.5 text-xs rounded-xl bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-foreground"
                    {...register("targetPrice", { valueAsNumber: true })}
                  />
                  {errors.targetPrice && (
                    <p className="text-[10px] text-destructive font-semibold flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      <span>{errors.targetPrice.message}</span>
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-primary/20 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="h-4.5 w-4.5 animate-spin" /> : <Bell className="h-4 w-4" />}
                  <span>Start Tracking Alert</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
