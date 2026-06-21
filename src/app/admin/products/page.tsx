"use client";

import { useState, useEffect } from "react";
import { ProductService } from "@/actions/product.actions";
import { Product } from "@/types/product";
import { formatCurrency } from "@/lib/jwt";
import { Search, Edit, Eye, Filter, ArrowUpRight, X, AlertCircle } from "lucide-react";
import Link from "next/link";
import { CATEGORIES } from "@/lib/constants";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  // Price Update Overlay
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [newPrice, setNewPrice] = useState("");

  const loadProducts = () => {
    ProductService.getProducts().then(setProducts);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleUpdatePrice = async (e: React.FormEvent, id: string) => {
    e.preventDefault();
    if (!newPrice) return;

    try {
      await ProductService.updateProductPrice(id, Number(newPrice));
      setNewPrice("");
      setUpdatingId(null);
      loadProducts(); // Refresh list
    } catch {
      // ignore
    }
  };

  const filtered = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All" || p.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 animate-fade-in text-foreground">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Products Database</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Review monitored product assets. You can manually adjust catalog prices here to verify price drop triggers and alerts.
        </p>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-card border border-border rounded-xl justify-between items-stretch sm:items-center">
        <div className="flex-1 max-w-sm relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-foreground"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
          <select
            className="bg-muted border border-border text-xs rounded-lg px-2.5 py-1.5 focus:outline-none text-foreground font-medium"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table grid */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-muted-foreground text-[10px] uppercase font-bold tracking-wider">
                <th className="p-4">Name & Seller</th>
                <th className="p-4">Category</th>
                <th className="p-4">Current Price</th>
                <th className="p-4 text-center">Discount %</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-xs text-muted-foreground">
                    No products matching filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-muted/10 transition-colors">
                    {/* Name */}
                    <td className="p-4">
                      <div className="font-bold text-foreground line-clamp-1">{p.name}</div>
                      <span className="text-[9px] bg-muted px-1.5 py-0.5 rounded text-foreground font-medium mt-1 inline-block">
                        {p.sellerName}
                      </span>
                    </td>

                    {/* Category */}
                    <td className="p-4">
                      <span className="text-muted-foreground">{p.category}</span>
                    </td>

                    {/* Price */}
                    <td className="p-4 font-bold text-foreground">
                      {formatCurrency(p.currentPrice)}
                    </td>

                    {/* Discount */}
                    <td className="p-4 text-center">
                      <span className="bg-destructive/10 text-destructive text-[10px] font-bold px-2 py-0.5 rounded-full inline-block">
                        {p.discountPercentage}%
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Edit Override */}
                        <button
                          onClick={() => {
                            setNewPrice(p.currentPrice.toString());
                            setUpdatingId(p.id || null);
                          }}
                          className="p-1.5 rounded-lg hover:bg-muted text-primary hover:text-primary-foreground flex items-center gap-1 cursor-pointer"
                          title="Override Price"
                        >
                          <Edit className="h-4 w-4" />
                          <span className="text-[10px] font-bold hidden sm:inline">Override</span>
                        </button>

                        {/* View Product */}
                        <Link
                          href={`/products/${p.id}`}
                          className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground"
                          title="View Details"
                        >
                          <Eye className="h-4.5 w-4.5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Override Price Modal */}
      {updatingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-sm p-6 shadow-2xl relative space-y-4 text-foreground animate-scale-up">
            <button
              onClick={() => setUpdatingId(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div>
              <h3 className="font-bold text-base">Crawl Price Override</h3>
              <p className="text-xs text-muted-foreground">
                Set a mock price level. This represents the next crawled value and triggers notifications if targets are breached.
              </p>
            </div>

            <form onSubmit={(e) => handleUpdatePrice(e, updatingId)} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold">New Price (NPR)</label>
                <input
                  type="number"
                  required
                  placeholder="Enter new price..."
                  className="w-full px-3 py-2.5 text-xs rounded-xl bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Trigger Price Sync</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
