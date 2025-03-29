import { NextRequest, NextResponse } from "next/server";

export default function verify(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const protectedRoutes: string[] = ["/chat"];

  if (protectedRoutes.includes(req.nextUrl.pathname)) {
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/chat", "/chat/addfriend"],
};
