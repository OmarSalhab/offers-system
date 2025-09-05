import { type NextRequest, NextResponse } from "next/server"
import { getCurrentAdmin } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin()

    if (!admin) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    return NextResponse.json({
      admin: {
        id: admin.adminId,
        email: admin.email,
        name: admin.name,
      },
    })
  } catch (error) {
    console.error("Auth check error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}