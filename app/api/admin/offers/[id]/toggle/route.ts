import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Offer from "@/models/Offer"

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const offer = await Offer.findById(params.id)
    if (!offer) {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 })
    }

    // Toggle the isHidden flag
    offer.isHidden = !offer.isHidden
    await offer.save()

    return NextResponse.json({ offer })
  } catch (error) {
    console.error("Error toggling offer visibility:", error)
    return NextResponse.json({ error: "Failed to toggle offer visibility" }, { status: 500 })
  }
}
