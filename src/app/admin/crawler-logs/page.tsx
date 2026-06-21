"use client";

import { useEffect, useState } from "react";
import { AdminService } from "@/actions/admin.actions";
import { CrawlLog } from "@/types/admin";
import { Loader2, Database, AlertCircle, RefreshCw } from "lucide-react";

export default function CrawlerLogsPage() {
  const [logs, setLogs] = useState<CrawlLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = () => {
    setLoading(true);
    AdminService.getCrawlLogs()
      .then((data) => {
        setLogs(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "SUCCESS":
        return "bg-success/15 text-success border-success/30";
      case "FAILED":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-primary/10 text-primary border-primary/20 animate-pulse";
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-foreground">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Crawler Activity Logs</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Displaying MongoDB crawl_logs records tracking status of Nepalese retail monitors.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          className="p-2 bg-card hover:bg-muted border border-border rounded-xl text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          title="Refresh Logs"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-xs text-muted-foreground mt-2">Loading crawler status logs...</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-muted-foreground text-[10px] uppercase font-bold tracking-wider">
                  <th className="p-4">Source Crawler</th>
                  <th className="p-4">Started At</th>
                  <th className="p-4">Finished At</th>
                  <th className="p-4">Products Crawled</th>
                  <th className="p-4">Crawl Status</th>
                  <th className="p-4">Failure Log</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-muted/10 transition-colors">
                    {/* Source */}
                    <td className="p-4 font-bold text-foreground">
                      {log.source}
                    </td>

                    {/* Start */}
                    <td className="p-4 text-muted-foreground">
                      {new Date(log.startedAt).toLocaleString()}
                    </td>

                    {/* Finish */}
                    <td className="p-4 text-muted-foreground">
                      {new Date(log.finishedAt).toLocaleString()}
                    </td>

                    {/* Count */}
                    <td className="p-4 font-semibold text-foreground">
                      {log.productsCrawled} items
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${getStatusBadge(log.status)}`}>
                        {log.status}
                      </span>
                    </td>

                    {/* Reason */}
                    <td className="p-4 text-xs max-w-xs truncate">
                      {log.failureReason ? (
                        <span className="text-destructive font-medium flex items-center gap-1">
                          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                          <span>{log.failureReason}</span>
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
