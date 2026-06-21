"use client";

import { useAuth } from "@/hooks/useAuth";
import { useWishlist } from "@/hooks/useWishlist";
import { useAlerts } from "@/hooks/useAlerts";
import { formatCurrency } from "@/lib/jwt";
import {
  Heart,
  Bell,
  CheckCircle,
  PiggyBank,
  TrendingDown,
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import Link from "next/link";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";

// Mock monthly savings chart
const MOCK_SAVINGS_HISTORY = [
  { month: "Jan", saved: 1200 },
  { month: "Feb", saved: 2500 },
  { month: "Mar", saved: 3200 },
  { month: "Apr", saved: 4800 },
  { month: "May", saved: 6900 },
  { month: "Jun", saved: 8500 },
];

export default function DashboardOverviewPage() {
  const { user } = useAuth();
  const { wishlistItems } = useWishlist();
  const { alerts } = useAlerts();

  const activeAlerts = alerts.filter((a) => a.isActive).length;
  const triggeredAlerts = alerts.filter((a) => a.isTriggered).length;

  return (
    <div className="space-y-8 animate-fade-in text-foreground">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Hello, {user?.fullName}!
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Welcome to your price intelligence panel. Check pricing shifts and notifications below.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: "Wishlist Items",
            val: wishlistItems.length,
            desc: "Products tracked locally",
            icon: Heart,
            color: "text-rose-500 bg-rose-500/10",
            link: "/dashboard/wishlist",
          },
          {
            title: "Active Alerts",
            val: activeAlerts,
            desc: "Continuous price crawling",
            icon: Bell,
            color: "text-primary bg-primary/10",
            link: "/dashboard/alerts",
          },
          {
            title: "Triggered Alerts",
            val: triggeredAlerts,
            desc: "Bargains matched targets",
            icon: CheckCircle,
            color: "text-success bg-success/10",
            link: "/dashboard/notifications",
          },
          {
            title: "Total Saved Amount",
            val: formatCurrency(user?.savedAmount || 0),
            desc: "Based on alert buying",
            icon: PiggyBank,
            color: "text-emerald-500 bg-emerald-500/10",
            link: "#",
          },
        ].map((card, idx) => (
          <div
            key={idx}
            className="bg-card border border-border p-5 rounded-2xl shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow relative overflow-hidden group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                {card.title}
              </span>
              <div className={`p-2 rounded-xl ${card.color}`}>
                <card.icon className="h-4 w-4" />
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-xl sm:text-2xl font-bold">{card.val}</p>
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-muted-foreground">{card.desc}</span>
                {card.link !== "#" && (
                  <Link href={card.link} className="text-primary font-bold hover:underline flex items-center gap-0.5">
                    <span>View</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Savings Analytics & Alerts Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Savings Curve Chart */}
        <div className="lg:col-span-7 bg-card border border-border p-6 rounded-2xl shadow-sm flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="font-bold text-foreground">Cumulative Purchase Savings</h3>
            <p className="text-xs text-muted-foreground">Approximate savings derived from tracking price thresholds</p>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_SAVINGS_HISTORY}>
                <defs>
                  <linearGradient id="savedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={10} tickLine={false} />
                <YAxis stroke="#9ca3af" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)", borderRadius: "12px", fontSize: "11px" }} formatter={(val) => [formatCurrency(val as number), "Saved"]} />
                <Area type="monotone" dataKey="saved" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#savedGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick alerts snapshot */}
        <div className="lg:col-span-5 bg-card border border-border p-6 rounded-2xl shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <h3 className="font-bold text-foreground">Triggered Alerts History</h3>
            <p className="text-xs text-muted-foreground">Recently matches that met your target levels</p>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-64 divide-y divide-border/60">
            {alerts.filter((a) => a.isTriggered).length === 0 ? (
              <div className="text-center py-10 text-xs text-muted-foreground">
                No alerts triggered yet. You will see matches here when prices slide.
              </div>
            ) : (
              alerts.filter((a) => a.isTriggered).slice(0, 3).map((alert) => (
                <div key={alert.id} className="pt-2 text-xs flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <img
                      src={alert.productImage}
                      alt={alert.productName}
                      className="h-8 w-8 rounded-lg object-cover bg-muted"
                    />
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground truncate max-w-[150px]">{alert.productName}</p>
                      <p className="text-[10px] text-muted-foreground">Target: {formatCurrency(alert.targetPrice)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-success">
                      {formatCurrency(alert.currentPrice)}
                    </span>
                    <span className="text-[9px] text-muted-foreground block">Triggered</span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-3 bg-muted rounded-xl flex items-center gap-2.5 text-[10px] text-muted-foreground leading-relaxed">
            <ShieldCheck className="h-4.5 w-4.5 text-primary shrink-0" />
            <span>Active monitoring runs securely via cloud background crawler.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
