import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Offer from "@/models/Offer"
import { DeleteObjectCommand } from "@aws-sdk/client-s3"
import { r2Client, getR2BucketName } from "@/lib/r2Client"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const offer = await Offer.findById(params.id)
    if (!offer) {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 })
    }

    return NextResponse.json({ offer })
  } catch (error) {
    console.error("Error fetching offer:", error)
    return NextResponse.json({ error: "Failed to fetch offer" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
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

    const offer = await Offer.findByIdAndUpdate(
      params.id,
      {
        title,
        description,
        originalPrice: Number.parseFloat(originalPrice),
        discountedPrice: Number.parseFloat(discountedPrice),
        validFrom: new Date(validFrom),
        validUntil: new Date(validUntil),
        imageKey,
        imageUrl,
      },
      { new: true },
    )

    if (!offer) {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 })
    }

    return NextResponse.json({ offer })
  } catch (error) {
    console.error("Error updating offer:", error)
    return NextResponse.json({ error: "Failed to update offer" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const offer = await Offer.findById(params.id)
    if (!offer) {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 })
    }

    // Delete image from R2 if it exists
    if (offer.imageKey) {
      try {
        await r2Client().send(
          new DeleteObjectCommand({
            Bucket: getR2BucketName(),
            Key: offer.imageKey,
          }),
        )
      } catch (r2Error) {
        console.error("Error deleting image from R2:", r2Error)
        // Continue with database deletion even if R2 deletion fails
      }
    }

    // Delete offer from database
    await Offer.findByIdAndDelete(params.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting offer:", error)
    return NextResponse.json({ error: "Failed to delete offer" }, { status: 500 })
  }
}
