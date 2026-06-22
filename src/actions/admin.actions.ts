"use server";

import { adminService } from "@/services/admin.service";
import { verifyAccessToken } from "@/lib/jwt";
import { cookies } from "next/headers";

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  if (!token) throw new Error("Unauthorized");
  try {
    const payload = await verifyAccessToken(token);
    if (payload.role !== "ADMIN" && payload.role !== "SUPER_ADMIN") {
      throw new Error("Forbidden");
    }
    return payload;
  } catch {
    throw new Error("Unauthorized");
  }
}

export async function getCrawlLogsAction() {
  await requireAdmin();
  const result = await adminService.getCrawlLogs({});
  // Map MongoDB _id to string id
  return result.logs.map((log: any) => ({
    id: log._id?.toString() || log.id,
    source: log.source || "Daraz Crawler",
    status: log.status || "SUCCESS",
    startedAt: log.startedAt || log.createdAt || new Date().toISOString(),
    finishedAt: log.finishedAt || log.updatedAt || new Date().toISOString(),
    productsCrawled: log.productsCrawled || 0,
    failureReason: log.failureReason || null,
  }));
}

export async function getCrawlErrorsAction() {
  await requireAdmin();
  const result = await adminService.getCrawlErrors({});
  return result.errors.map((err: any) => ({
    id: err._id?.toString() || err.id,
    message: err.message || "Unknown error",
    component: err.component || "Crawler",
    severity: err.severity || "HIGH",
    stackTrace: err.stackTrace || err.stack || null,
    timestamp: err.createdAt || err.timestamp || new Date().toISOString(),
  }));
}

export async function getAffiliateStatsAction() {
  await requireAdmin();
  // Mock last 7 days of conversion data for the trend chart
  return [
    { date: "Jun 13", revenue: 1500, clicks: 120, conversions: 5 },
    { date: "Jun 14", revenue: 2300, clicks: 150, conversions: 7 },
    { date: "Jun 15", revenue: 3200, clicks: 200, conversions: 10 },
    { date: "Jun 16", revenue: 1800, clicks: 110, conversions: 6 },
    { date: "Jun 17", revenue: 4500, clicks: 250, conversions: 15 },
    { date: "Jun 18", revenue: 2800, clicks: 180, conversions: 9 },
    { date: "Jun 19", revenue: 3500, clicks: 210, conversions: 11 },
  ];
}

export async function getDashboardStatsAction() {
  await requireAdmin();
  const stats = await adminService.getDashboardStats();
  const affiliateStats = await adminService.getAffiliateStats();
  return {
    totalProducts: stats.totalProducts,
    activeUsers: stats.totalUsers,
    activeAlerts: stats.activeAlerts,
    affiliateRevenue: affiliateStats.totalClicks * 15,
  };
}

export async function triggerCrawlerAction(source: string) {
  await requireAdmin();
  // Mock trigger action and return a new crawl log entry
  return {
    id: `log-${Date.now()}`,
    source,
    startedAt: new Date().toISOString(),
    finishedAt: new Date().toISOString(),
    productsCrawled: Math.floor(Math.random() * 200) + 50,
    status: "SUCCESS",
    failureReason: null,
  };
}

export const AdminService = {
  getCrawlLogs: getCrawlLogsAction,
  getErrors: getCrawlErrorsAction,
  getOverview: getDashboardStatsAction,
  getAffiliateAnalytics: getAffiliateStatsAction,
  triggerCrawler: triggerCrawlerAction,
};
