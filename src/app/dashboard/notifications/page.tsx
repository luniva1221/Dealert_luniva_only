"use client";

import { useAuth } from "@/hooks/useAuth";
import { Bell, MailCheck, ShieldCheck, Trash2, CheckSquare } from "lucide-react";
import { formatCurrency } from "@/lib/jwt";

export default function NotificationsPage() {
  const { notifications, markNotificationRead, clearNotifications } = useAuth();

  // Simulated Email logs
  const simulatedEmailLogs = [
    {
      id: "email-1",
      recipient: "user@dealert.com",
      subject: "Price Drop Alert: iPhone 15 Pro",
      sentAt: new Date(Date.now() - 3600000).toISOString(), // 1 hr ago
      status: "DELIVERED",
      body: "Good news! iPhone 15 Pro (128GB, Natural Titanium) has hit your target of NPR 175,000. Current price is NPR 172,999 at Oliz Store."
    },
    {
      id: "email-2",
      recipient: "user@dealert.com",
      subject: "Welcome to Dealert Nepal!",
      sentAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      status: "DELIVERED",
      body: "Thank you for creating an account with Dealert. Start comparing online prices and setting alerts to save money."
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in text-foreground">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Alert & Email Logs</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Review triggered alerts notifications and simulated email delivery logs.
          </p>
        </div>

        {notifications.length > 0 && (
          <div className="flex gap-2">
            <button
              onClick={() => notifications.forEach((n) => markNotificationRead(n.id))}
              className="px-3 py-1.5 rounded-lg border border-border hover:bg-muted text-xs font-semibold cursor-pointer"
            >
              Mark All Read
            </button>
            <button
              onClick={clearNotifications}
              className="p-1.5 bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground rounded-lg transition-colors flex items-center justify-center cursor-pointer"
              title="Clear All Notifications"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: System Notifications */}
        <div className="lg:col-span-6 bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
            <Bell className="h-4 w-4 text-primary" />
            <span>In-App Notifications</span>
          </h3>

          <div className="space-y-3.5 divide-y divide-border/50 max-h-[400px] overflow-y-auto pr-1">
            {notifications.length === 0 ? (
              <div className="text-center py-16 text-xs text-muted-foreground">
                No notifications logged yet.
              </div>
            ) : (
              notifications.map((notif, idx) => (
                <div
                  key={notif.id}
                  onClick={() => markNotificationRead(notif.id)}
                  className={`pt-3.5 first:pt-0 text-xs cursor-pointer group ${!notif.read ? "bg-primary/5 p-2 rounded-xl border border-primary/10" : ""
                    }`}
                >
                  <div className="flex justify-between items-start mb-1 gap-2">
                    <span className={`font-bold ${!notif.read ? "text-primary" : "text-foreground"}`}>
                      {notif.title}
                    </span>
                    {!notif.read && (
                      <span className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1"></span>
                    )}
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{notif.message}</p>
                  <span className="text-[9px] text-muted-foreground/80 mt-1 block">
                    {new Date(notif.createdAt).toLocaleString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Side: Email Logs */}
        <div className="lg:col-span-6 bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
            <MailCheck className="h-4 w-4 text-success" />
            <span>Email Alert Logs</span>
          </h3>

          <div className="space-y-3.5 divide-y divide-border/50 max-h-[400px] overflow-y-auto pr-1">
            {simulatedEmailLogs.map((email) => (
              <div key={email.id} className="pt-3.5 first:pt-0 space-y-1.5 text-xs">
                <div className="flex justify-between items-center text-[10px] font-bold">
                  <span className="text-foreground truncate">To: {email.recipient}</span>
                  <span className="bg-success/10 text-success px-1.5 py-0.5 rounded">
                    {email.status}
                  </span>
                </div>
                <p className="font-bold text-foreground">{email.subject}</p>
                <div className="p-2.5 bg-muted rounded-xl text-[11px] text-muted-foreground leading-relaxed whitespace-pre-line font-mono">
                  {email.body}
                </div>
                <span className="text-[9px] text-muted-foreground/80 block">
                  Dispatched {new Date(email.sentAt).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          <div className="p-3 bg-muted rounded-xl flex items-center gap-2.5 text-[10px] text-muted-foreground leading-relaxed">
            <ShieldCheck className="h-4.5 w-4.5 text-success shrink-0" />
            <span>All outgoing alert emails use certified transactional gateways.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
