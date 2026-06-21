"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import {
  Bell,
  Sun,
  Moon,
  Search,
  Menu,
  X,
  Heart,
  User,
  Sparkles,
  LogOut,
  ChevronDown,
  CheckCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";
import { useWishlist } from "@/hooks/useWishlist";
import { INITIAL_PRODUCTS } from "@/lib/constants";

export default function Navbar() {
  const router = useRouter();

  const {
    user,
    isAuthenticated,
    notifications,
    logout,
    markNotificationRead,
  } = useAuth();

  const { wishlistItems } = useWishlist();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState<any[]>([]);
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // -------------------------
  // Theme toggle
  // -------------------------
  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);

    if (typeof window !== "undefined") {
      if (next === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  };

  // -------------------------
  // Click outside handler
  // -------------------------
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchSuggestions([]);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // -------------------------
  // Search suggestions
  // -------------------------
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const query = searchQuery.toLowerCase();

      const filtered = INITIAL_PRODUCTS.filter((p) =>
        p.name.toLowerCase().includes(query)
      ).slice(0, 5);

      setSearchSuggestions(filtered);
    } else {
      setSearchSuggestions([]);
    }
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchSuggestions([]);
    }
  };

  const handleSuggestionClick = (id: string) => {
    router.push(`/products/${id}`);
    setSearchQuery("");
    setSearchSuggestions([]);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  // -------------------------
  // UI
  // -------------------------
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/85 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">

        {/* Left Side: Logo & Desktop Navigation */}
        <div className="flex items-center gap-6 lg:gap-8">
          <Link href="/" className="flex items-center space-x-2 font-bold text-2xl text-primary shrink-0">
            <Sparkles className="h-6 w-6" />
            <span>Dealert</span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-5 text-sm font-semibold text-muted-foreground">
            <Link href="/products" className="hover:text-primary transition-colors py-1 px-2 rounded-lg hover:bg-muted/40">
              Products
            </Link>
            <Link href="/deals" className="hover:text-primary transition-colors py-1 px-2 rounded-lg hover:bg-muted/40">
              Deals
            </Link>
            <Link href="/categories" className="hover:text-primary transition-colors py-1 px-2 rounded-lg hover:bg-muted/40">
              Categories
            </Link>
            <Link href="/fake-page-detector" className="hover:text-primary transition-colors py-1 px-2 rounded-lg hover:bg-muted/40 flex items-center gap-1">
              <span>Fake Page Detector</span>
            </Link>
          </nav>
        </div>

        {/* Search */}
        <div ref={searchRef} className="hidden md:flex flex-1 max-w-md relative">
          <form onSubmit={handleSearchSubmit} className="w-full">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-9 pr-4 py-2 rounded-full bg-muted border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              />
            </div>
          </form>

          {searchSuggestions.length > 0 && (
            <div className="absolute top-12 left-0 right-0 bg-background border rounded-xl shadow-lg z-50">
              {searchSuggestions.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSuggestionClick(item.id)}
                  className="w-full text-left px-3 py-2 hover:bg-muted flex justify-between text-xs text-foreground"
                >
                  <span>{item.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">

          {/* Theme */}
          <button onClick={toggleTheme} className="p-2 cursor-pointer text-muted-foreground hover:text-foreground">
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          {/* Wishlist */}
          <Link href={isAuthenticated ? "/dashboard/wishlist" : "/login?redirect=/dashboard/wishlist"} className="relative p-2 text-muted-foreground hover:text-foreground">
            <Heart className="h-5 w-5" />
            {wishlistItems.length > 0 && (
              <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-white rounded-full px-1">
                {wishlistItems.length}
              </span>
            )}
          </Link>

          {/* Notifications */}
          <div ref={notifRef} className="relative">
            <button onClick={() => setNotifOpen(!notifOpen)} className="p-2 cursor-pointer relative text-muted-foreground hover:text-foreground">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-white rounded-full px-1">
                  {unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-xl shadow-lg z-50 py-2">
                <div className="px-4 py-2 border-b border-border flex justify-between items-center">
                  <span className="font-semibold text-sm">Notifications</span>
                  {unreadCount > 0 && (
                    <button
                      onClick={() => {
                        notifications.forEach(n => {
                          if (!n.read) markNotificationRead(n.id);
                        });
                      }}
                      className="text-xs text-primary hover:underline font-medium cursor-pointer"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-6 text-center text-xs text-muted-foreground">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          markNotificationRead(notif.id);
                          if (notif.link) {
                            router.push(notif.link);
                          }
                          setNotifOpen(false);
                        }}
                        className={`px-4 py-3 hover:bg-muted cursor-pointer transition-colors border-b border-border/50 last:border-b-0 flex flex-col gap-1 ${
                          !notif.read ? "bg-primary/5" : ""
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <span className={`text-xs font-semibold ${!notif.read ? "text-foreground" : "text-muted-foreground"}`}>
                            {notif.title}
                          </span>
                          {!notif.read && (
                            <span className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1" />
                          )}
                        </div>
                        <p className="text-[10px] text-muted-foreground leading-relaxed">{notif.message}</p>
                        <span className="text-[8px] text-muted-foreground/80 mt-1">
                          {new Date(notif.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Auth */}
          {isAuthenticated ? (
            <div ref={profileRef} className="relative">
              <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 cursor-pointer">
                <img
                  src={user?.avatarUrl || "https://i.pravatar.cc/40"}
                  className="h-7 w-7 rounded-full object-cover border border-border"
                />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-lg z-50 py-2">
                  <div className="px-4 py-2 border-b border-border">
                    <p className="text-xs font-semibold text-foreground truncate">{user?.fullName}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{user?.email}</p>
                  </div>
                  <div className="py-1">
                    <Link
                      href="/dashboard"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs hover:bg-muted text-foreground transition-colors"
                    >
                      <User className="h-3.5 w-3.5" />
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      href="/dashboard/profile"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs hover:bg-muted text-foreground transition-colors"
                    >
                      <User className="h-3.5 w-3.5" />
                      <span>Account Settings</span>
                    </Link>
                    {user?.role === "ADMIN" && (
                      <Link
                        href="/admin"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs hover:bg-muted text-foreground transition-colors"
                      >
                        <User className="h-3.5 w-3.5" />
                        <span>Admin Portal</span>
                      </Link>
                    )}
                  </div>
                  <div className="border-t border-border mt-1 pt-1">
                    <button
                      onClick={async () => {
                        setProfileOpen(false);
                        await logout();
                        router.push("/");
                      }}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs hover:bg-destructive/10 text-destructive transition-colors cursor-pointer"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-bold rounded-full transition-all shrink-0">
              Sign In
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 lg:hidden text-muted-foreground hover:text-foreground cursor-pointer"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-card/95 backdrop-blur-md py-4">
          <div className="container mx-auto px-4 flex flex-col gap-4">
            
            {/* Search Input for Mobile */}
            <div className="block md:hidden">
              <form onSubmit={handleSearchSubmit} className="w-full">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-muted border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  />
                </div>
              </form>
            </div>

            {/* Mobile Navigation Links */}
            <nav className="flex flex-col gap-2 font-semibold text-sm">
              <Link
                href="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                Products
              </Link>
              <Link
                href="/deals"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                Deals
              </Link>
              <Link
                href="/categories"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                Categories
              </Link>
              <Link
                href="/fake-page-detector"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                Fake Page Detector
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}