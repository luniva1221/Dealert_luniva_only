"use client";

import { useAlerts } from "@/hooks/useAlerts";
import { formatCurrency } from "@/lib/jwt";
import { Bell, Trash2, Edit2, CheckCircle2, AlertTriangle, Eye, Plus, X, ShieldAlert } from "lucide-react";
import { useState } from "react";
import { INITIAL_PRODUCTS } from "@/lib/constants";
import Link from "next/link";

export default function AlertsPage() {
  const { alerts, createAlert, editAlert, deleteAlert, toggleAlert, loading } = useAlerts();

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState<string | null>(null);

  // Create state
  const [selectedProductId, setSelectedProductId] = useState("");
  const [targetPrice, setTargetPrice] = useState("");

  // Edit state
  const [editPrice, setEditPrice] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId || !targetPrice) return;

    const product = INITIAL_PRODUCTS.find((p) => p.id === selectedProductId);
    if (!product) return;

    createAlert(
      product.id,
      Number(targetPrice),
      product.currentPrice,
      product.name,
      product.imageUrl
    );

    setSelectedProductId("");
    setTargetPrice("");
    setCreateOpen(false);
  };

  const handleEditSubmit = (e: React.FormEvent, id: string) => {
    e.preventDefault();
    if (!editPrice) return;
    editAlert(id, Number(editPrice));
    setEditPrice("");
    setEditOpen(null);
  };

  return (
    <div className="space-y-8 animate-fade-in text-foreground">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Price Track Alerts</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Configure target pricing triggers on tracked retail inventory in Nepal.
          </p>
        </div>

        <button
          onClick={() => setCreateOpen(true)}
          className="bg-primary hover:bg-primary/95 text-primary-foreground text-xs font-semibold px-4.5 py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-primary/10 cursor-pointer self-start sm:self-auto shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>New Alert</span>
        </button>
      </div>

      {alerts.length === 0 ? (
        <div className="text-center p-16 bg-card border border-border rounded-2xl space-y-4">
          <Bell className="h-10 w-10 text-muted-foreground mx-auto" />
          <p className="font-semibold text-foreground">No alerts active</p>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            You don&apos;t have any price tracking alerts configured. Get notified immediately when pricing shifts.
          </p>
          <button
            onClick={() => setCreateOpen(true)}
            className="bg-primary hover:bg-primary/95 text-primary-foreground text-xs font-semibold px-5 py-2.5 rounded-xl"
          >
            Create First Alert
          </button>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          {/* Desktop Table view */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-muted-foreground text-[10px] uppercase font-bold tracking-wider">
                  <th className="p-4">Product Info</th>
                  <th className="p-4">Current Price</th>
                  <th className="p-4">Target Price</th>
                  <th className="p-4 text-center">Active Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {alerts.map((alert) => (
                  <tr key={alert.id} className="hover:bg-muted/10 transition-colors">
                    {/* Info */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={alert.productImage}
                          alt={alert.productName}
                          className="h-10 w-10 rounded-lg object-cover bg-muted shrink-0"
                        />
                        <div className="min-w-0 max-w-[200px] sm:max-w-xs">
                          <p className="font-bold text-foreground truncate">{alert.productName}</p>
                          <span className="text-[9px] text-muted-foreground block">
                            Checked {new Date(alert.lastCheckedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Current */}
                    <td className="p-4">
                      <span className="font-bold text-foreground">{formatCurrency(alert.currentPrice)}</span>
                      {alert.isTriggered && (
                        <span className="ml-2 bg-success/10 text-success text-[9px] font-bold px-1.5 py-0.5 rounded">
                          Triggered
                        </span>
                      )}
                    </td>

                    {/* Target */}
                    <td className="p-4">
                      <span className="font-bold text-primary">{formatCurrency(alert.targetPrice)}</span>
                    </td>

                    {/* Status Toggle */}
                    <td className="p-4 text-center">
                      <button
                        onClick={() => toggleAlert(alert.id)}
                        disabled={loading}
                        className={`text-[10px] px-2.5 py-1 rounded-full font-bold transition-colors cursor-pointer ${alert.isActive
                            ? "bg-success/15 text-success hover:bg-success/25"
                            : "bg-muted text-muted-foreground hover:bg-muted/70"
                          }`}
                      >
                        {alert.isActive ? "ENABLED" : "DISABLED"}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Edit button */}
                        <button
                          onClick={() => {
                            setEditPrice(alert.targetPrice.toString());
                            setEditOpen(alert.id);
                          }}
                          className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                          title="Edit Target Price"
                        >
                          <Edit2 className="h-4.5 w-4.5" />
                        </button>

                        {/* Delete button */}
                        <button
                          onClick={() => deleteAlert(alert.id)}
                          className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive cursor-pointer"
                          title="Delete Alert"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* New Alert Modal overlay */}
      {createOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md p-6 shadow-2xl relative space-y-4 text-foreground">
            <button
              onClick={() => setCreateOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div>
              <h3 className="font-bold text-base">Create Price Alert</h3>
              <p className="text-xs text-muted-foreground">Select a product catalog item to start tracking price changes.</p>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              {/* Product Select */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Select Product</label>
                <select
                  required
                  className="w-full px-3 py-2 text-xs rounded-xl bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground font-medium"
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                >
                  <option value="">Choose item...</option>
                  {INITIAL_PRODUCTS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({formatCurrency(p.currentPrice)})
                    </option>
                  ))}
                </select>
              </div>

              {/* Target Price */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Target Price Threshold (NPR)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 135000"
                  className="w-full px-3 py-2.5 text-xs rounded-xl bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg"
              >
                <Bell className="h-4 w-4" />
                <span>Start Tracking Alert</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Alert Modal overlay */}
      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-sm p-6 shadow-2xl relative space-y-4 text-foreground">
            <button
              onClick={() => setEditOpen(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div>
              <h3 className="font-bold text-base">Edit Target Price</h3>
              <p className="text-xs text-muted-foreground">Adjust target price threshold for this alert.</p>
            </div>

            <form onSubmit={(e) => handleEditSubmit(e, editOpen)} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold">New Target Price (NPR)</label>
                <input
                  type="number"
                  required
                  placeholder="Enter target price..."
                  className="w-full px-3 py-2.5 text-xs rounded-xl bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Save Changes</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
