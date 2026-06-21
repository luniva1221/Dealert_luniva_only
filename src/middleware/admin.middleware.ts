import { NextResponse } from "next/server";

export function withAdmin(handler: Function) {
  return async (request: Request, payload: { userId: string; role: string }, ...args: any[]) => {
    if (payload.role !== "ADMIN" && payload.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Access Denied: Admin role required" }, { status: 403 });
    }
    return handler(request, payload, ...args);
  };
}
export default withAdmin;
