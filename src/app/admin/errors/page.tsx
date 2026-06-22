"use client";

import { useEffect, useState } from "react";
import { AdminService } from "@/actions/admin.actions";
import { SystemError } from "@/types/admin";
import { Loader2, ShieldAlert, Bug, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";

export default function ErrorsPage() {
  const [errors, setErrors] = useState<SystemError[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchErrors = () => {
    setLoading(true);
    AdminService.getErrors()
      .then((data) => {
        setErrors(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchErrors();
  }, []);

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return "bg-destructive text-destructive-foreground animate-pulse font-bold";
      case "HIGH":
        return "bg-destructive/10 text-destructive border-destructive/20 font-bold";
      case "MEDIUM":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-foreground">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">System Exceptions</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Displaying server-side errors, database pool timeouts, and parser failures.
          </p>
        </div>

        <button
          onClick={fetchErrors}
          className="p-2 bg-card hover:bg-muted border border-border rounded-xl text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          title="Refresh Errors"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-xs text-muted-foreground mt-2">Loading errors collection logs...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {errors.map((err) => (
            <div
              key={err.id}
              className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between"
            >
              {/* Summary panel */}
              <div
                onClick={() => setExpandedId(expandedId === err.id ? null : err.id)}
                className="p-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-muted/10 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-lg bg-destructive/10 text-destructive shrink-0">
                    <Bug className="h-4.5 w-4.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-xs sm:text-sm text-foreground truncate max-w-xs sm:max-w-md">
                      {err.message}
                    </p>
                    <div className="flex items-center gap-3 text-[10px] mt-1 flex-wrap text-muted-foreground">
                      <span className="font-semibold text-foreground">Component: {err.component}</span>
                      <span>•</span>
                      <span>Logged: {new Date(err.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold border uppercase ${getSeverityStyle(err.severity)}`}>
                    {err.severity}
                  </span>
                  {expandedId === err.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </div>

              {/* Stacktrace expanded */}
              {expandedId === err.id && (
                <div className="p-4 border-t border-border bg-muted/30 space-y-2.5">
                  <h4 className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                    Error Diagnostic Stack Trace
                  </h4>
                  {err.stackTrace ? (
                    <pre className="p-3 bg-muted border border-border rounded-xl text-[10px] text-destructive leading-relaxed overflow-x-auto font-mono">
                      {err.stackTrace}
                    </pre>
                  ) : (
                    <p className="text-xs text-muted-foreground italic">No extended stack trace available for this record.</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
