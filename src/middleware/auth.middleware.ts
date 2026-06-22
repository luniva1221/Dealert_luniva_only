import { NextResponse } from "next/server";
import { AuthService } from "@/services/auth.service";

export function withAuth(handler: Function) {
  return async (request: Request, ...args: any[]) => {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized: Access token missing" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const payload = AuthService.verifyAccessToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized: Access token expired" }, { status: 401 });
    }

    return handler(request, payload, ...args);
  };
}
export default withAuth;
