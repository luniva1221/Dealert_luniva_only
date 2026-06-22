"use client";

import Link from "next/link";
import { useState } from "react";
import { useProducts } from "@/hooks/useProducts";
import {
  TrendingUp,
  Search,
  ArrowDownRight,
  Laptop,
  Smartphone,
  Tv,
  Headphones,
  BookOpen,
  Camera,
  Layers,
  Percent,
  Clock,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Heart,
  Eye,
  LineChart,
  UserCheck
} from "lucide-react";
import { CATEGORIES } from "@/lib/constants";
import { formatCurrency, formatPercentage } from "@/lib/jwt";
import { useWishlist } from "@/hooks/useWishlist";
import { useRouter } from "next/navigation";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";

// Mock index preview data
const INDEX_PREVIEW_DATA = [
  { month: "Jan", index: 100 },
  { month: "Feb", index: 102.5 },
  { month: "Mar", index: 104.2 },
  { month: "Apr", index: 103.8 },
  { month: "May", index: 105.1 },
  { month: "Jun", index: 103.9 },
];

export default function LandingPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const { toggleWishlist, isWishlisted } = useWishlist();

  // Get trending deals (most recently crawled — "rating" doesn't exist
  // in the real schema, the crawler never collects it from Daraz, so
  // sorting by it silently fell through to the default sort before).
  const { data: trendingDeals } = useProducts({ sortBy: "lastCrawledAt" });
  // Get biggest price drops (high discount)
  const { data: biggestDrops } = useProducts({ sortBy: "discount" });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Laptops": return Laptop;
      case "Smartphones": return Smartphone;
      case "Televisions": return Tv;
      case "Headphones": return Headphones;
      case "Books": return BookOpen;
      case "Cameras": return Camera;
      default: return Layers;
    }
  };

  return (
    <div className="space-y-20 pb-16">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-12 lg:pt-28">
        {/* Glow circles behind */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 -translate-y-1/2 w-[300px] h-[300px] bg-secondary/15 rounded-full blur-[90px] pointer-events-none" />

        <div className="container mx-auto px-4 text-center max-w-4xl space-y-8 relative z-10">
          <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary text-xs font-bold px-3 py-1.5 rounded-full border border-primary/20 animate-pulse-slow">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Smart Shopping Assistant in Nepal</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight text-foreground">
            Never Pay Full Price in Nepal Again
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Dealert monitors prices across Daraz, Oliz Store, Sastodeal, and other retail websites in Nepal. Set alert targets and get instant notifications when prices plunge.
          </p>

          {/* Centered Search Box */}
          <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto">
            <div className="flex flex-col sm:flex-row items-stretch gap-2.5 p-1.5 rounded-2xl bg-card border border-border shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="relative flex-1">
                <Search className="absolute left-4.5 top-3.5 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Paste Daraz link or search gadgets, shoes, books..."
                  className="w-full pl-12 pr-4 py-3 bg-transparent border-0 focus:ring-0 focus:outline-none text-foreground text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-primary/20"
              >
                <span>Search</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </form>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto pt-8">
            {[
              { num: "50,000+", label: "Products Monitored" },
              { num: "NPR 4.5M+", label: "User Savings" },
              { num: "12,000+", label: "Price Alerts Triggered" },
              { num: "15 min", label: "Crawler Check Interval" },
            ].map((stat, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-card/65 border border-border/50 backdrop-blur-sm">
                <p className="text-2xl font-bold text-primary">{stat.num}</p>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1 font-semibold">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Categories Section */}
      <section className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Explore Categories</h2>
            <p className="text-muted-foreground text-sm mt-1">Select a category to browse price histories and deals</p>
          </div>
          <Link href="/categories" className="text-xs text-primary font-semibold hover:underline flex items-center gap-1">
            <span>View All Categories</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {CATEGORIES.map((cat) => {
            const Icon = getCategoryIcon(cat);
            return (
              <Link
                key={cat}
                href={`/products?category=${encodeURIComponent(cat)}`}
                className="p-5 rounded-xl bg-card border border-border hover:border-primary/50 text-center flex flex-col items-center justify-center space-y-3 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 hover-scale group"
              >
                <div className="p-3 rounded-full bg-primary/5 group-hover:bg-primary/10 text-primary transition-all">
                  <Icon className="h-6 w-6" />
                </div>
                <span className="text-xs font-semibold text-foreground truncate max-w-full">{cat}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. Biggest Price Drops Section */}
      <section className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Biggest Price Drops</h2>
            <p className="text-muted-foreground text-sm mt-1">Products with the maximum discount percentages right now</p>
          </div>
          <Link href="/deals" className="text-xs text-primary font-semibold hover:underline flex items-center gap-1">
            <span>Explore All Drops</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {biggestDrops?.slice(0, 4).map((product) => {
            const wish = isWishlisted(product.id);
            return (
              <div
                key={product.id}
                className="rounded-xl border border-border bg-card shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col overflow-hidden relative group"
              >
                {/* Sale tag */}
                <div className="absolute top-3 left-3 z-10 bg-destructive text-destructive-foreground text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                  <ArrowDownRight className="h-3 w-3" />
                  <span>{product.discountPercentage}% OFF</span>
                </div>

                {/* Image panel */}
                <div className="aspect-video relative overflow-hidden bg-muted">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-colors cursor-pointer border ${wish
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background/80 text-muted-foreground border-border hover:text-foreground"
                      }`}
                  >
                    <Heart className="h-4 w-4" />
                  </button>
                </div>

                {/* Details */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                      {product.category}
                    </span>
                    <Link
                      href={`/products/${product.id}`}
                      className="block font-semibold text-foreground text-sm hover:text-primary transition-colors line-clamp-1"
                    >
                      {product.name}
                    </Link>
                    {product.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-end justify-between">
                    <div>
                      <span className="text-xs text-muted-foreground line-through block">
                        {formatCurrency(product.originalPrice)}
                      </span>
                      <span className="text-base font-extrabold text-foreground">
                        {formatCurrency(product.currentPrice)}
                      </span>
                    </div>
                    <Link
                      href={`/products/${product.id}`}
                      className="bg-muted hover:bg-primary hover:text-primary-foreground text-muted-foreground text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <span>Track</span>
                      <ChevronRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Trending Deals Section */}
      <section className="container mx-auto px-4 bg-muted/20 py-12 rounded-2xl border border-border/50">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Trending Deals</h2>
            <p className="text-muted-foreground text-sm mt-1">Recently tracked products gaining attention this week</p>
          </div>
          <Link href="/deals" className="text-xs text-primary font-semibold hover:underline flex items-center gap-1">
            <span>View All Deals</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingDeals?.slice(0, 4).map((product) => {
            const wish = isWishlisted(product.id);
            return (
              <div
                key={product.id}
                className="rounded-xl border border-border bg-card shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col overflow-hidden relative group"
              >
                {/* Seller badge */}
                <div className="absolute top-3 left-3 z-10 bg-primary text-primary-foreground text-[9px] font-bold px-2 py-0.5 rounded">
                  {product.sellerName}
                </div>

                <div className="aspect-video relative overflow-hidden bg-muted">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <button
                    onClick={() => toggleWishlist(product.id)}
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
                    {/* Category badge replaces the old rating/reviewsCount
                        display — neither field exists in the real schema,
                        the crawler never collects ratings from Daraz. */}
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                      {product.category}
                    </span>
                    <Link
                      href={`/products/${product.id}`}
                      className="block font-semibold text-foreground text-sm hover:text-primary transition-colors line-clamp-1"
                    >
                      {product.name}
                    </Link>
                  </div>

                  <div className="flex items-end justify-between">
                    <div>
                      <span className="text-xs text-muted-foreground line-through block">
                        {formatCurrency(product.originalPrice)}
                      </span>
                      <span className="text-base font-extrabold text-foreground">
                        {formatCurrency(product.currentPrice)}
                      </span>
                    </div>
                    <Link
                      href={`/products/${product.id}`}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold px-4 py-2 rounded-lg transition-all"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Features Section */}
      <section className="container mx-auto px-4 text-center space-y-12">
        <div className="max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Advanced Price Tracker Tools</h2>
          <p className="text-muted-foreground text-sm">Everything you need to outsmart price adjustments and inflation</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {[
            {
              title: "Instant Price Alerts",
              desc: "Set your target price threshold on laptops, phones, or gadgets. We crawl continuously and drop you a notification as soon as the target is reached.",
              icon: Clock,
              color: "text-primary bg-primary/10",
              link: "/dashboard/alerts",
            },
            {
              title: "Fake Sale & Price Detector",
              desc: "Paste an e-commerce product link to check if a sale is genuine. Analyze its price history and trust scores before hitting checkout.",
              icon: ShieldCheck,
              color: "text-secondary bg-secondary/10",
              link: "/fake-page-detector",
            },
            {
              title: "Monthly Price Index",
              desc: "View category price trends, inflation triggers, and historical changes in Nepal e-commerce using interactive charts.",
              icon: LineChart,
              color: "text-success bg-success/10",
              link: "/price-index",
            },
          ].map((feat, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-4 hover:shadow-md transition-shadow">
              <div className={`p-3 rounded-xl w-fit ${feat.color}`}>
                <feat.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground">{feat.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{feat.desc}</p>
              <Link href={feat.link} className="inline-flex items-center text-xs font-bold text-primary hover:underline gap-1 pt-2">
                <span>Try Tool</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Monthly Index Preview Section */}
      <section className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-card border border-border p-8 rounded-2xl shadow-sm">
        <div className="space-y-6">
          <span className="bg-success/10 text-success text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
            Nepal Retail Trends
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Monthly Consumer Price Index</h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Our crawling intelligence measures online retail inflation and deflation dynamically by evaluating over 50,000 retail assets. We monitor shifts across key tech and lifestyle sectors in Kathmandu and beyond.
          </p>
          <ul className="space-y-3 text-xs sm:text-sm text-foreground/80">
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span>Technology category dropped 3.4% on average last month</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span>Inflation stabilized at 1.2% over general products in June</span>
            </li>
          </ul>
          <Link href="/price-index" className="inline-block bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold px-5 py-2.5 rounded-xl transition-all shadow-md">
            View Dynamic Price Index
          </Link>
        </div>

        {/* Dynamic Chart Container */}
        <div className="h-64 sm:h-72 w-full bg-muted/20 p-4 rounded-xl border border-border/50">
          <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground mb-4">Dealert Price Index (DPI)</p>
          <ResponsiveContainer width="100%" height="90%">
            <AreaChart data={INDEX_PREVIEW_DATA}>
              <defs>
                <linearGradient id="colorIndex" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" stroke="#9ca3af" fontSize={10} tickLine={false} />
              <YAxis stroke="#9ca3af" fontSize={10} domain={['dataMin - 5', 'auto']} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
              <Area type="monotone" dataKey="index" stroke="#2563EB" strokeWidth={2.5} fillOpacity={1} fill="url(#colorIndex)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* 7. Testimonials Section */}
      <section className="container mx-auto px-4 text-center space-y-12">
        <div className="max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">What Smart Shoppers Say</h2>
          <p className="text-muted-foreground text-sm">Save thousands on tech, appliances, and lifestyle goods</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {[
            {
              quote: "Dealert helped me track the MacBook Air M2 price. I set an alert for 138k and got notified on Friday when it plummeted. Saved Rs. 17,000!",
              author: "Niranjan Shrestha",
              location: "Kathmandu",
              role: "Software Engineer",
              avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
            },
            {
              quote: "The fake page detector is awesome. Tested a '50% sale' on a television and saw they raised the original price just before the sale. Kept me from buying a fake deal.",
              author: "Pooja Gurung",
              location: "Lalitpur",
              role: "Creative Designer",
              avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80",
            },
            {
              quote: "I use Dealert to check index statistics for my online store purchases. Being able to compare seller history is a lifesaver in Nepal e-commerce.",
              author: "Sanjay Devkota",
              location: "Pokhara",
              role: "E-commerce Merchant",
              avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80",
            },
          ].map((test, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow">
              <p className="text-xs text-muted-foreground italic leading-relaxed">
                &ldquo;{test.quote}&rdquo;
              </p>
              <div className="flex items-center space-x-3.5 pt-2 border-t border-border/50">
                <img
                  src={test.avatar}
                  alt={test.author}
                  className="h-10 w-10 rounded-full object-cover shrink-0"
                />
                <div>
                  <p className="text-xs font-bold text-foreground">{test.author}</p>
                  <p className="text-[10px] text-muted-foreground font-medium">{test.role} • {test.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}