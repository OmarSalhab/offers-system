import { SignJWT, jwtVerify } from "jose"
import type { NextRequest } from "next/server"
import { cookies } from "next/headers"

const JWT_SECRET = process.env.JWT_SECRET!

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required")
}

// Create a secret key for jose
const secret = new TextEncoder().encode(JWT_SECRET)

export interface JWTPayload {
  adminId: string
  email: string
  name: string
}

export async function signToken(payload: JWTPayload): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret)
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    console.log("verifying token:", token);
    const { payload } = await jwtVerify(token, secret);
    console.log("verifyToken Output: ", payload);
    return payload as JWTPayload
  } catch (error) {
    console.log("JWT verification error:", error);
    return null
  }
}

export async function getAuthToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies()
    return cookieStore.get("auth-token")?.value || null
  } catch (error) {
    return null
  }
}

export async function getCurrentAdmin(): Promise<JWTPayload | null> {
  const token = await getAuthToken()
  if (!token) return null

  return await verifyToken(token)
}

export function getTokenFromRequest(request: NextRequest): string | null {
  return request.cookies.get("auth-token")?.value || null
}

export async function isAuthenticated(request: NextRequest): Promise<boolean> {
  const token = getTokenFromRequest(request)
  
  console.log("getTokenFromRequest Output: ", token);
  
  if (!token) {
    console.log("No token found in request");
    return false
  }

  const payload = await verifyToken(token)
  console.log("payload is : ", payload);
  return payload !== null
}
