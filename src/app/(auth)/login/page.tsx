"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "@/validations/auth.schema";
import { useAuth } from "@/hooks/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/dashboard";

  const { login, error, loading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      const user = await login(data);
      router.push(redirectUrl);
    } catch {
      // Handled by state
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-center text-foreground">Welcome Back</h2>

      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-xs text-destructive flex items-start gap-2 font-medium">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold">Email Address</label>
          <input
            type="email"
            placeholder="e.g. user@dealert.com"
            className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-foreground"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-[10px] text-destructive font-semibold flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              <span>{errors.email.message}</span>
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold">Password</label>
            <Link
              href="/forgot-password"
              className="text-[10px] text-primary font-bold hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
          <input
            type="password"
            placeholder="••••••"
            className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-foreground"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-[10px] text-destructive font-semibold flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              <span>{errors.password.message}</span>
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-primary/20 cursor-pointer disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-4.5 w-4.5 animate-spin" /> : null}
          <span>Sign In</span>
        </button>
      </form>

      <div className="text-center text-xs text-muted-foreground pt-2 border-t border-border/50">
        <span>Don&apos;t have an account? </span>
        <Link href="/register" className="text-primary font-bold hover:underline">
          Register Here
        </Link>
      </div>

      <div className="p-3 bg-muted rounded-xl text-[10px] text-muted-foreground leading-relaxed text-center">
        💡 Use <b>user@dealert.com</b> (standard user) or <b>admin@dealert.com</b> (admin role) with password <b>password</b> to access the dashboards.
      </div>
    </div>
  );
}
