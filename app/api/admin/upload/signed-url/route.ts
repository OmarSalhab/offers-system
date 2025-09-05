import { NextResponse } from "next/server"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import { r2Client, R2_BUCKET_NAME, CDN_BASE_URL } from "@/lib/r2Client"
import { randomUUID } from "crypto"

export async function POST(request: Request) {
  try {
    const { fileName, fileType } = await request.json()

    if (!fileName || !fileType) {
      return NextResponse.json({ error: "fileName and fileType are required" }, { status: 400 })
    }

    // Validate file type
    if (!fileType.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 })
    }

    // Generate unique key for the file
    const fileExtension = fileName.split(".").pop()
    const imageKey = `offers/${randomUUID()}.${fileExtension}`

    // Create signed URL for upload
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: imageKey,
      ContentType: fileType,
    })

    const signedUrl = await getSignedUrl(r2Client, command, { expiresIn: 3600 }) // 1 hour

    // Construct the public URL
    const imageUrl = `${CDN_BASE_URL}/${imageKey}`

    return NextResponse.json({
      signedUrl,
      imageKey,
      imageUrl,
    })
  } catch (error) {
    console.error("Error generating signed URL:", error)
    return NextResponse.json({ error: "Failed to generate signed URL" }, { status: 500 })
  }
}
