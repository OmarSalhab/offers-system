import { S3Client } from "@aws-sdk/client-s3"

let r2Client: S3Client | null = null

function getR2Client() {
  if (!r2Client) {
    const R2_ENDPOINT = process.env.R2_ENDPOINT
    const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID
    const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY

    if (!R2_ENDPOINT || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
      throw new Error("Missing required R2 environment variables")
    }

    r2Client = new S3Client({
      region: "auto",
      endpoint: R2_ENDPOINT,
      credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY,
      },
    })
  }
  return r2Client
}

export { getR2Client as r2Client }

export function getR2BucketName() {
  const bucketName = process.env.R2_BUCKET_NAME
  if (!bucketName) {
    throw new Error("R2_BUCKET_NAME environment variable is required")
  }
  return bucketName
}

export function getCDNBaseUrl() {
  return process.env.CDN_BASE_URL || ""
}
