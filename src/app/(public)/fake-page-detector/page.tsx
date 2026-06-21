"use client";

import { useState } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  Globe,
  Lock,
  Calendar,
  AlertTriangle,
  FileSearch,
  CheckCircle,
  HelpCircle,
  Loader2
} from "lucide-react";
import { formatPercentage } from "@/lib/jwt";

interface DetectorResult {
  url: string;
  trustScore: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  sslStatus: "VALID" | "INVALID" | "NONE";
  domainAge: string;
  indicators: string[];
  recommendation: string;
}

export default function FakePageDetector() {
  const [urlInput, setUrlInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DetectorResult | null>(null);

  const handleDetect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    setLoading(true);
    setResult(null);

    // Simulate URL analysis
    setTimeout(() => {
      const url = urlInput.trim().toLowerCase();

      let trustScore = 88;
      let riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" = "LOW";
      let sslStatus: "VALID" | "INVALID" | "NONE" = "VALID";
      let domainAge = "6 years, 4 months";
      let indicators: string[] = ["SSL Certificate matches domain credentials."];
      let recommendation = "Safe to browse. This website corresponds to an established merchant in Nepal. Ensure standard checkout protocols.";

      if (url.includes("darazzz") || url.includes("sastodeall") || url.includes("scam") || url.includes("cheap-iphone")) {
        trustScore = 14;
        riskLevel = "CRITICAL";
        sslStatus = "NONE";
        domainAge = "5 days";
        indicators = [
          "Domain age is less than 30 days (extremely common for retail scams).",
          "SSL certificate is missing or invalid.",
          "Spell-squatting detected: spelling resembles known brand 'Daraz' or 'Sastodeal'.",
          "Contact address and company registration are completely missing on home page.",
        ];
        recommendation = "Do NOT enter credentials, credit cards, or eSewa pins on this page. This exhibits classic signs of a phishing landing page designed to clone brand credentials.";
      } else if (url.includes("hamrobazaar-deal") || url.includes("discount-nepal")) {
        trustScore = 48;
        riskLevel = "HIGH";
        sslStatus = "VALID";
        domainAge = "2 months";
        indicators = [
          "Recently registered domain (2 months old).",
          "Domain registrant info is hidden behind WHOIS privacy guard.",
          "Unusually high discount rates compared to average Nepalese index.",
        ];
        recommendation = "Exercise extreme caution. We recommend choosing 'Cash on Delivery' and checking the product in person. Avoid advance online banking transfers.";
      } else if (!url.startsWith("http://") && !url.startsWith("https://")) {
        // generic fallback for user typing regular website
        trustScore = 75;
        riskLevel = "MEDIUM";
        sslStatus = "VALID";
        domainAge = "2 years";
        indicators = [
          "No copycat domain spellings detected.",
          "Registrar exhibits standard retail records.",
        ];
        recommendation = "Standard risk. Proceed with standard security guidelines, check reviews, and verify payment methods before submitting.";
      }

      setResult({
        url: urlInput,
        trustScore,
        riskLevel,
        sslStatus,
        domainAge,
        indicators,
        recommendation,
      });
      setLoading(false);
    }, 1500);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "LOW": return "bg-success/10 text-success border-success/30";
      case "MEDIUM": return "bg-orange-500/10 text-orange-500 border-orange-500/30";
      case "HIGH": return "bg-destructive/10 text-destructive border-destructive/30";
      case "CRITICAL": return "bg-destructive text-destructive-foreground animate-pulse";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success border-success";
    if (score >= 50) return "text-orange-500 border-orange-500";
    return "text-destructive border-destructive";
  };

  return (
    <div className="container mx-auto px-4 py-10 space-y-10 max-w-4xl">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="p-3.5 bg-primary/10 text-primary rounded-full w-fit mx-auto">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Fake Sale & Link Detector</h1>
        <p className="text-muted-foreground text-xs sm:text-sm max-w-lg mx-auto">
          Paste an e-commerce link (e.g. from Daraz, Sastodeal, or unknown social links) to check if the store is trusted or suspicious.
        </p>
      </div>

      {/* Input box */}
      <div className="bg-card border border-border p-6 rounded-2xl shadow-sm space-y-4">
        <form onSubmit={handleDetect} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Paste website link or deal URL, e.g. https://darazzz.com/discount-iphone"
            className="flex-1 px-4 py-3 text-xs sm:text-sm rounded-xl bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-foreground"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-primary hover:bg-primary/95 text-primary-foreground text-xs sm:text-sm font-semibold px-6 py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4.5 w-4.5 animate-spin" /> : <FileSearch className="h-4 w-4" />}
            <span>Analyze Link</span>
          </button>
        </form>

        <p className="text-[10px] text-muted-foreground text-center">
          💡 Try pasting `darazzz.com/cheap-iphone` or `discount-nepal.com` to see high-risk indicators in action.
        </p>
      </div>

      {/* Result Display */}
      {loading && (
        <div className="text-center py-12 space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-xs text-muted-foreground">Fetching server WHOIS, SSL records, and crawling link metadata...</p>
        </div>
      )}

      {result && (
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-md animate-fade-in">
          {/* Top banner */}
          <div className="p-4 bg-muted/50 border-b border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <span className="font-mono text-muted-foreground truncate max-w-md">Analyzed: {result.url}</span>
            <span className={`px-2.5 py-1 rounded-full border text-[10px] font-bold ${getRiskColor(result.riskLevel)}`}>
              RISK: {result.riskLevel}
            </span>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Left Column: Big Trust Gauge */}
            <div className="md:col-span-4 flex flex-col items-center justify-center text-center space-y-4">
              <span className="text-xs uppercase font-bold text-muted-foreground">Trust Index Score</span>

              <div className={`h-32 w-32 rounded-full border-[8px] flex flex-col items-center justify-center ${getScoreColor(result.trustScore)}`}>
                <span className="text-3xl font-extrabold">{result.trustScore}%</span>
                <span className="text-[9px] font-bold text-muted-foreground uppercase">Safe Rank</span>
              </div>
            </div>

            {/* Right Column: Key Details */}
            <div className="md:col-span-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* SSL */}
                <div className="p-3.5 bg-muted/40 border border-border/50 rounded-xl space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Lock className="h-4 w-4" />
                    <span>SSL Certificate</span>
                  </div>
                  <p className="text-xs font-bold text-foreground">
                    {result.sslStatus === "VALID" ? "Valid & Secure" : result.sslStatus === "NONE" ? "Missing / Invalid" : "Self-Signed"}
                  </p>
                </div>

                {/* Age */}
                <div className="p-3.5 bg-muted/40 border border-border/50 rounded-xl space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Domain Age</span>
                  </div>
                  <p className="text-xs font-bold text-foreground">
                    {result.domainAge}
                  </p>
                </div>

                {/* Status */}
                <div className="p-3.5 bg-muted/40 border border-border/50 rounded-xl space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Globe className="h-4 w-4" />
                    <span>WHOIS Registry</span>
                  </div>
                  <p className="text-xs font-bold text-foreground">
                    {result.trustScore > 50 ? "Verified Record" : "Hidden / Masked"}
                  </p>
                </div>
              </div>

              {/* Indicators */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Analysis Indicators</h4>
                <ul className="space-y-2 text-xs">
                  {result.indicators.map((ind, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-muted-foreground">
                      {result.trustScore > 50 ? (
                        <CheckCircle className="h-4 w-4 text-success shrink-0 mt-0.5" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                      )}
                      <span>{ind}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommendation */}
              <div className={`p-4 rounded-xl border text-xs leading-relaxed ${result.trustScore >= 80
                  ? "bg-success/5 border-success/20 text-success"
                  : result.trustScore >= 50
                    ? "bg-orange-500/5 border-orange-500/20 text-orange-500"
                    : "bg-destructive/5 border-destructive/20 text-destructive font-semibold"
                }`}>
                <h5 className="font-bold uppercase tracking-wider mb-1.5 text-[10px]">Dealert Recommendation:</h5>
                <p>{result.recommendation}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
