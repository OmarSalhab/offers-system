import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Offer from "@/models/Offer"

export async function GET() {
  try {
    await connectDB()

    // Only return active, non-hidden offers for public consumption
    const now = new Date()
    const offers = await Offer.find({
      isHidden: false,
      validFrom: { $lte: now },
      validUntil: { $gte: now },
    }).sort({ createdAt: -1 })

    return NextResponse.json({ offers })
  } catch (error) {
    console.error("Error fetching offers:", error)
    return NextResponse.json({ error: "Failed to fetch offers" }, { status: 500 })
  }
}
