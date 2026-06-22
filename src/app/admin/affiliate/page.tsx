"use client";

import { useQuery } from "@tanstack/react-query";
import { AdminService } from "@/actions/admin.actions";
import { formatCurrency } from "@/lib/jwt";
import {
  TrendingUp,
  MousePointerClick,
  Percent,
  Banknote,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Loader2
} from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

// Mock Affiliate Link performance
const POPULAR_LINKS = [
  {
    productName: "MacBook Air M2 (8GB RAM, 256GB SSD)",
    sellerName: "Daraz Nepal",
    clicks: 1240,
    conversions: 42,
    revenue: 42000,
    conversionRate: 3.3,
  },
  {
    productName: "iPhone 15 Pro (128GB, Natural Titanium)",
    sellerName: "Oliz Store",
    clicks: 980,
    conversions: 35,
    revenue: 52500,
    conversionRate: 3.5,
  },
  {
    productName: "Sony WH-1000XM5 Wireless Headphones",
    clicks: 650,
    sellerName: "Daraz Nepal",
    conversions: 20,
    revenue: 16000,
    conversionRate: 3.0,
  },
  {
    productName: "Philips Air Fryer HD9200/90",
    clicks: 520,
    sellerName: "Sastodeal",
    conversions: 18,
    revenue: 9000,
    conversionRate: 3.4,
  }
];

export default function AffiliatePage() {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ["admin-affiliate-analytics"],
    queryFn: () => AdminService.getAffiliateAnalytics(),
  });

  const totalClicks = analytics?.reduce((sum, item) => sum + item.clicks, 0) || 0;
  const totalConversions = analytics?.reduce((sum, item) => sum + item.conversions, 0) || 0;
  const totalRevenue = analytics?.reduce((sum, item) => sum + item.revenue, 0) || 0;

  const averageConversionRate = totalClicks > 0 ? ((totalConversions / totalClicks) * 100).toFixed(1) : "0";

  return (
    <div className="space-y-8 animate-fade-in text-foreground">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Affiliate Partner Analytics</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Monitor outbound click redirects, checkout conversions, and aggregated commissions earnings in Nepal.
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-xs text-muted-foreground mt-2">Retrieving affiliate data stream...</p>
        </div>
      ) : (
        <>
          {/* Metrics summary cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                title: "Outbound Redirects",
                val: totalClicks,
                desc: "Outbound checkout clicks",
                icon: MousePointerClick,
                color: "text-primary bg-primary/10",
              },
              {
                title: "Conversions Captured",
                val: totalConversions,
                desc: "Completed sales conversions",
                icon: Percent,
                color: "text-secondary bg-secondary/10",
              },
              {
                title: "Partner Conversion Rate",
                val: `${averageConversionRate}%`,
                desc: "Average conversion index",
                icon: TrendingUp,
                color: "text-indigo-500 bg-indigo-500/10",
              },
              {
                title: "Total Revenue Earned",
                val: formatCurrency(totalRevenue),
                desc: "Commissions accrued this month",
                icon: Banknote,
                color: "text-success bg-success/10",
              },
            ].map((card, idx) => (
              <div
                key={idx}
                className="bg-card border border-border p-5 rounded-2xl shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
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
                  <p className="text-[10px] text-muted-foreground">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Comparative charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Click redirects */}
            <div className="bg-card border border-border p-6 rounded-2xl shadow-sm space-y-4">
              <div>
                <h3 className="font-bold text-foreground">Click Redirect Actions</h3>
                <p className="text-xs text-muted-foreground">Volume of shopping clicks forwarded to e-commerce partners</p>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
                    <XAxis dataKey="date" stroke="#9ca3af" fontSize={10} tickLine={false} />
                    <YAxis stroke="#9ca3af" fontSize={10} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)", borderRadius: "12px", fontSize: "11px" }} />
                    <Bar dataKey="clicks" fill="#2563EB" radius={[4, 4, 0, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Commissions breakdown */}
            <div className="bg-card border border-border p-6 rounded-2xl shadow-sm space-y-4">
              <div>
                <h3 className="font-bold text-foreground">Commission Growth Curve</h3>
                <p className="text-xs text-muted-foreground">Accrued partner payout over time</p>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics}>
                    <defs>
                      <linearGradient id="affGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
                    <XAxis dataKey="date" stroke="#9ca3af" fontSize={10} tickLine={false} />
                    <YAxis stroke="#9ca3af" fontSize={10} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)", borderRadius: "12px", fontSize: "11px" }} formatter={(val) => [formatCurrency(val as number), "Earnings"]} />
                    <Area type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#affGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Performance Table */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm space-y-4 p-6">
            <div>
              <h3 className="font-bold text-foreground">Product Affiliate Rankings</h3>
              <p className="text-xs text-muted-foreground">Most popular redirects based on conversion rates</p>
            </div>

            <div className="overflow-x-auto border border-border rounded-xl">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-muted-foreground text-[10px] uppercase font-bold tracking-wider">
                    <th className="p-4">Affiliate Product</th>
                    <th className="p-4">Sellers</th>
                    <th className="p-4 text-center">Clicks</th>
                    <th className="p-4 text-center">Conversions</th>
                    <th className="p-4 text-center">Conversion %</th>
                    <th className="p-4 text-right">Commissions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {POPULAR_LINKS.map((link, idx) => (
                    <tr key={idx} className="hover:bg-muted/10 transition-colors">
                      <td className="p-4 font-bold text-foreground truncate max-w-xs">{link.productName}</td>
                      <td className="p-4 text-muted-foreground">{link.sellerName}</td>
                      <td className="p-4 text-center font-semibold text-foreground">{link.clicks}</td>
                      <td className="p-4 text-center font-semibold text-foreground">{link.conversions}</td>
                      <td className="p-4 text-center">
                        <span className="bg-primary/10 text-primary px-2 py-0.5 rounded font-bold">
                          {link.conversionRate}%
                        </span>
                      </td>
                      <td className="p-4 text-right font-bold text-success">{formatCurrency(link.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
