import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Offer from "@/models/Offer"

export async function GET() {
  try {
    await connectDB()

    // Return all offers for admin (including hidden ones)
    const offers = await Offer.find({}).sort({ createdAt: -1 })

    return NextResponse.json({ offers })
  } catch (error) {
    console.error("Error fetching admin offers:", error)
    return NextResponse.json({ error: "Failed to fetch offers" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, description, originalPrice, discountedPrice, validFrom, validUntil, imageKey, imageUrl } = body

    // Validation
    if (!title || !description || !originalPrice || !discountedPrice || !validFrom || !validUntil) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    if (discountedPrice >= originalPrice) {
      return NextResponse.json({ error: "Discounted price must be less than original price" }, { status: 400 })
    }

    if (new Date(validFrom) >= new Date(validUntil)) {
      return NextResponse.json({ error: "Valid from date must be before valid until date" }, { status: 400 })
    }

    await connectDB()

    const offer = new Offer({
      title,
      description,
      originalPrice: Number.parseFloat(originalPrice),
      discountedPrice: Number.parseFloat(discountedPrice),
      validFrom: new Date(validFrom),
      validUntil: new Date(validUntil),
      imageKey,
      imageUrl,
    })

    await offer.save()

    return NextResponse.json({ offer }, { status: 201 })
  } catch (error) {
    console.error("Error creating offer:", error)
    return NextResponse.json({ error: "Failed to create offer" }, { status: 500 })
  }
}
