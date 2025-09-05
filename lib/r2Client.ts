import { S3Client } from "@aws-sdk/client-s3"

const R2_ENDPOINT = process.env.R2_ENDPOINT!
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID!
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY!

if (!R2_ENDPOINT || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
  throw new Error("Missing required R2 environment variables")
}

// S3-compatible client for Cloudflare R2
export const r2Client = new S3Client({
  region: "auto",
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
})

export const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME!
export const CDN_BASE_URL = process.env.CDN_BASE_URL!
