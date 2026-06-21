"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard,
  Heart,
  Bell,
  User,
  AlertTriangle,
  FolderTree,
  ShieldAlert,
  Database,
  LineChart,
  ChevronLeft,
  ChevronRight,
  ShieldCheck
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/jwt";

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  // Check if we are on the admin path
  const isAdminPath = pathname.startsWith("/admin");

  const adminLinks = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/products", label: "Products DB", icon: FolderTree },
    { href: "/admin/crawler-logs", label: "Crawler Logs", icon: Database },
    { href: "/admin/errors", label: "System Errors", icon: ShieldAlert },
    { href: "/admin/affiliate", label: "Affiliate Sales", icon: LineChart },
  ];

  const userLinks = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/wishlist", label: "My Wishlist", icon: Heart },
    { href: "/dashboard/alerts", label: "Price Alerts", icon: Bell },
    { href: "/dashboard/notifications", label: "Alert History", icon: Bell },
    { href: "/dashboard/profile", label: "Account Profile", icon: User },
  ];

  const links = isAdminPath ? adminLinks : userLinks;

  return (
    <aside
      className={cn(
        "bg-card border-r border-border min-h-[calc(100vh-4rem)] transition-all duration-300 relative flex flex-col justify-between hidden md:flex",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="py-6 flex-1">
        {/* User Card */}
        {!collapsed && user && (
          <div className="px-4 mb-6">
            <div className="p-3 bg-muted/40 rounded-xl border border-border/50 flex items-center space-x-3">
              <img
                src={user.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"}
                alt={user.fullName}
                className="h-9 w-9 rounded-full object-cover shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-foreground truncate">{user.fullName}</p>
                <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Sidebar Header Indicator */}
        <div className="px-4 mb-4 flex items-center justify-between">
          {!collapsed && (
            <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
              {isAdminPath ? "Admin Dashboard" : "User Dashboard"}
            </span>
          )}
          {isAdminPath && !collapsed && (
            <span className="bg-primary/10 text-primary text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" /> Secure
            </span>
          )}
        </div>

        {/* Links Navigation */}
        <nav className="space-y-1.5 px-3">
          {links.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <Icon className={cn("h-4.5 w-4.5 shrink-0", isActive ? "" : "text-muted-foreground group-hover:text-foreground")} />
                {!collapsed && <span className="truncate">{link.label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Admin <-> User Switcher Helper */}
      {!collapsed && user?.role === "ADMIN" && (
        <div className="p-4 border-t border-border/50">
          <Link
            href={isAdminPath ? "/dashboard" : "/admin"}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-border text-xs font-semibold hover:bg-muted text-foreground transition-all"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>{isAdminPath ? "Switch to User" : "Switch to Admin"}</span>
          </Link>
        </div>
      )}

      {/* Collapse Trigger Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute top-1/2 -right-3 h-6 w-6 rounded-full border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center shadow-md cursor-pointer transition-colors"
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </button>
    </aside>
  );
}
