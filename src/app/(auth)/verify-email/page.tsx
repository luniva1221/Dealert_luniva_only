"use client";

import { useState } from "react";

import Link from "next/link";
import { CheckCircle, ShieldAlert, Loader2 } from "lucide-react";

export default function VerifyEmailPage() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: code }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Verification failed");
      }
      setVerified(true);
      setMessage(data.message || "Email verified successfully");
    } catch (err: any) {
      setMessage(err.message || "Verification code mismatch. Try 123456.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-center text-foreground">Verify Email</h2>

      {verified ? (
        <div className="p-4 bg-success/10 border border-success/20 rounded-xl space-y-3 text-center">
          <CheckCircle className="h-8 w-8 text-success mx-auto" />
          <p className="text-xs text-foreground font-semibold">{message}</p>
          <div className="pt-2">
            <Link
              href="/dashboard"
              className="bg-primary text-primary-foreground font-semibold px-4 py-2 rounded-xl text-xs inline-block"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleVerify} className="space-y-4">
          <p className="text-xs text-muted-foreground leading-relaxed text-center">
            We have sent a verification code to your email. Enter it below to activate your account.
          </p>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Verification Code</label>
            <input
              type="text"
              required
              placeholder="e.g. 123456"
              className="w-full text-center tracking-widest font-bold text-lg px-3.5 py-2 rounded-xl bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-foreground"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            {message && (
              <p className="text-[10px] text-destructive font-semibold flex items-center gap-1 mt-1 justify-center">
                <ShieldAlert className="h-3 w-3" />
                <span>{message}</span>
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-primary/20 cursor-pointer disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4.5 w-4.5 animate-spin" /> : null}
            <span>Verify Code</span>
          </button>
        </form>
      )}
    </div>
  );
}
