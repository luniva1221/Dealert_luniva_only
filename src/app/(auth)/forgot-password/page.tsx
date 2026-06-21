"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle, Mail, Loader2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to send link");
      }
      setMessage(data.message);
    } catch (err: any) {
      setMessage(err.message || "Failed to send link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-center text-foreground">Recover Password</h2>

      {message ? (
        <div className="p-4 bg-success/10 border border-success/20 rounded-xl space-y-3 text-center">
          <CheckCircle className="h-8 w-8 text-success mx-auto" />
          <p className="text-xs text-foreground font-semibold">{message}</p>
          <div className="pt-2">
            <Link
              href="/login"
              className="bg-primary text-primary-foreground font-semibold px-4 py-2 rounded-xl text-xs inline-block"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-xs text-muted-foreground leading-relaxed text-center">
            Enter your email address and we will mail you a reset link.
          </p>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Email Address</label>
            <input
              type="email"
              required
              placeholder="e.g. ram@example.com"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-foreground"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-primary/20 cursor-pointer disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4.5 w-4.5 animate-spin" /> : <Mail className="h-4 w-4" />}
            <span>Send Recovery Link</span>
          </button>
        </form>
      )}

      {!message && (
        <div className="text-center text-xs text-muted-foreground pt-2 border-t border-border/50">
          <Link href="/login" className="text-primary font-bold hover:underline">
            Back to login
          </Link>
        </div>
      )}
    </div>
  );
}
