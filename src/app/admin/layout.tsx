"use client";

import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2, ShieldAlert } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push("/login?redirect=/admin");
      } else if (user?.role !== "ADMIN") {
        // Redirect non-admins to user dashboard
        router.push("/dashboard");
      }
    }
  }, [isAuthenticated, loading, user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="text-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-xs text-muted-foreground">Authorizing admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "ADMIN") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4">
        <div className="max-w-md w-full bg-card border border-border p-6 rounded-2xl text-center space-y-4 shadow-xl">
          <ShieldAlert className="h-10 w-10 text-destructive mx-auto" />
          <h3 className="text-base font-bold">Access Denied</h3>
          <p className="text-xs text-muted-foreground">
            This panel is restricted to system administrators. Log in with an admin account (e.g. admin@dealert.com) to request access.
          </p>
          <button
            onClick={() => router.push("/login")}
            className="bg-primary hover:bg-primary/95 text-primary-foreground text-xs font-semibold px-5 py-2 rounded-xl"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <div className="flex-1 flex items-stretch">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
