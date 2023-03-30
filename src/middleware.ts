import { NextMiddleware, NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { env } from "./env.mjs";

const challenge = (request: NextRequest): NextResponse => {
  const headers = new Headers(request.headers);
  headers.set("www-authenticate", "Basic");
  headers.set("content-type", "text/plain");
  return new NextResponse("authentication failed", {
    status: 401,
    headers,
  });
};

const isAuthenticated = (request: NextRequest): boolean => {
  const authorization = request.headers.get("authorization");
  if (!authorization || !(authorization ?? "").includes("Basic ")) {
    return false;
  }

  const base64 = authorization.split(" ")[1] || "";
  const [username, password] = atob(base64).split(":");
  if (
    username !== env.AUTHENTICATION_USERNAME ||
    password !== env.AUTHENTICATION_PASSWORD
  ) {
    return false;
  }

  return true;
};

export const middleware: NextMiddleware = (request: NextRequest) => {
  if (!isAuthenticated(request)) {
    return challenge(request);
  }

  return NextResponse.next();
};
