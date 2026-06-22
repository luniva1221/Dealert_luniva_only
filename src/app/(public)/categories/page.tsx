"use client";

import Link from "next/link";
import {
  Laptop,
  Smartphone,
  Tv,
  Headphones,
  Footprints,
  BookOpen,
  ChefHat,
  Camera,
  Layers,
  ChevronRight,
  TrendingDown
} from "lucide-react";
import { CATEGORIES } from "@/lib/constants";

export default function CategoriesPage() {
  const getCategoryDetails = (name: string) => {
    switch (name) {
      case "Laptops":
        return {
          icon: Laptop,
          desc: "Compare high-performance ultrabooks, gaming laptops, and macbooks.",
          count: 421,
          avgDiscount: 12,
          bgColor: "bg-blue-500/10 text-blue-500",
        };
      case "Smartphones":
        return {
          icon: Smartphone,
          desc: "Track pricing drops on Android devices and iPhones across retailers.",
          count: 512,
          avgDiscount: 9,
          bgColor: "bg-sky-500/10 text-sky-500",
        };
      case "Televisions":
        return {
          icon: Tv,
          desc: "Capture the best prices on 4K smart screens, QLEDs, and soundbars.",
          count: 184,
          avgDiscount: 15,
          bgColor: "bg-emerald-500/10 text-emerald-500",
        };
      case "Headphones":
        return {
          icon: Headphones,
          desc: "Deals on wireless earbuds, audiophile over-ears, and gaming headsets.",
          count: 242,
          avgDiscount: 14,
          bgColor: "bg-indigo-500/10 text-indigo-500",
        };
      case "Shoes":
        return {
          icon: Footprints,
          desc: "Runners, basketball shoes, and lifestyle trainers at the lowest cost.",
          count: 310,
          avgDiscount: 20,
          bgColor: "bg-orange-500/10 text-orange-500",
        };
      case "Books":
        return {
          icon: BookOpen,
          desc: "Compare prices of non-fiction, fiction, textbooks, and bestsellers.",
          count: 650,
          avgDiscount: 25,
          bgColor: "bg-teal-500/10 text-teal-500",
        };
      case "Kitchen Appliances":
        return {
          icon: ChefHat,
          desc: "Microwaves, refrigerators, mixers, and multi-cookers in Nepal.",
          count: 150,
          avgDiscount: 18,
          bgColor: "bg-rose-500/10 text-rose-500",
        };
      case "Cameras":
        return {
          icon: Camera,
          desc: "Mirrorless frames, action cameras, and prime lenses from major stores.",
          count: 88,
          avgDiscount: 10,
          bgColor: "bg-violet-500/10 text-violet-500",
        };
      default:
        return {
          icon: Layers,
          desc: "General categories and items available for comparison.",
          count: 120,
          avgDiscount: 5,
          bgColor: "bg-muted text-muted-foreground",
        };
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Explore Categories</h1>
        <p className="text-muted-foreground text-xs sm:text-sm mt-1">
          Select a category to compare pricing histograms, reviews, and current deals.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {CATEGORIES.map((cat) => {
          const info = getCategoryDetails(cat);
          const Icon = info.icon;
          return (
            <Link
              key={cat}
              href={`/products?category=${encodeURIComponent(cat)}`}
              className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 flex flex-col justify-between space-y-6 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 group hover-scale"
            >
              <div className="space-y-4">
                {/* Icon */}
                <div className={`p-3.5 rounded-xl w-fit ${info.bgColor} group-hover:scale-105 transition-transform`}>
                  <Icon className="h-6 w-6" />
                </div>

                <div className="space-y-1">
                  <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors">
                    {cat}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {info.desc}
                  </p>
                </div>
              </div>

              {/* Info pills */}
              <div className="flex items-center justify-between pt-4 border-t border-border/50 text-[10px] font-bold">
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground">{info.count} items</span>
                  <span className="text-success bg-success/10 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                    <TrendingDown className="h-2.5 w-2.5" />
                    <span>~{info.avgDiscount}% OFF</span>
                  </span>
                </div>
                
                <span className="text-primary group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                  <span>Browse</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
