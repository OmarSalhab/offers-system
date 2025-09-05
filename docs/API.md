# API Documentation

Complete API reference for the Offers System.

## Base URL

- **Development**: `http://localhost:3000`
- **Production**: `https://yourdomain.com`

## Authentication

Admin endpoints require authentication via JWT token stored in httpOnly cookie. Include the cookie in requests to protected endpoints.

## Public Endpoints

### Get Active Offers

Retrieves all active, non-hidden offers for public display.

**Endpoint**: `GET /api/offers`

**Response**:
\`\`\`json
{
  "offers": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "title": "Summer Sale - 50% Off Electronics",
      "description": "Get amazing discounts on all electronic items...",
      "originalPrice": 999.99,
      "discountedPrice": 499.99,
      "validFrom": "2024-01-15T00:00:00.000Z",
      "validUntil": "2024-02-15T23:59:59.000Z",
      "imageUrl": "https://cdn.yourdomain.com/offers/image.jpg",
      "createdAt": "2024-01-10T10:30:00.000Z"
    }
  ]
}
\`\`\`

**Status Codes**:
- `200` - Success
- `500` - Server error

## Authentication Endpoints

### Admin Login

Authenticates admin user and sets httpOnly cookie.

**Endpoint**: `POST /api/auth/login`

**Request Body**:
\`\`\`json
{
  "email": "admin@offers-system.com",
  "password": "admin123"
}
\`\`\`

**Response**:
\`\`\`json
{
  "success": true,
  "admin": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "email": "admin@offers-system.com",
    "name": "System Administrator"
  }
}
\`\`\`

**Status Codes**:
- `200` - Login successful
- `400` - Missing email or password
- `401` - Invalid credentials
- `500` - Server error

### Admin Logout

Clears authentication cookie.

**Endpoint**: `POST /api/auth/logout`

**Response**:
\`\`\`json
{
  "success": true
}
\`\`\`

**Status Codes**:
- `200` - Logout successful
- `500` - Server error

### Get Current Admin

Returns current authenticated admin information.

**Endpoint**: `GET /api/auth/me`

**Headers**: Requires authentication cookie

**Response**:
\`\`\`json
{
  "admin": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "email": "admin@offers-system.com",
    "name": "System Administrator"
  }
}
\`\`\`

**Status Codes**:
- `200` - Success
- `401` - Not authenticated
- `500` - Server error

## Admin Endpoints

All admin endpoints require authentication.

### Get All Offers (Admin)

Retrieves all offers including hidden ones for admin management.

**Endpoint**: `GET /api/admin/offers`

**Headers**: Requires authentication cookie

**Response**:
\`\`\`json
{
  "offers": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "title": "Summer Sale - 50% Off Electronics",
      "description": "Get amazing discounts on all electronic items...",
      "originalPrice": 999.99,
      "discountedPrice": 499.99,
      "validFrom": "2024-01-15T00:00:00.000Z",
      "validUntil": "2024-02-15T23:59:59.000Z",
      "imageKey": "offers/uuid.jpg",
      "imageUrl": "https://cdn.yourdomain.com/offers/uuid.jpg",
      "isHidden": false,
      "createdAt": "2024-01-10T10:30:00.000Z",
      "updatedAt": "2024-01-10T10:30:00.000Z"
    }
  ]
}
\`\`\`

### Create Offer

Creates a new offer.

**Endpoint**: `POST /api/admin/offers`

**Headers**: Requires authentication cookie

**Request Body**:
\`\`\`json
{
  "title": "New Offer Title",
  "description": "Detailed offer description",
  "originalPrice": 199.99,
  "discountedPrice": 99.99,
  "validFrom": "2024-01-15T00:00:00.000Z",
  "validUntil": "2024-02-15T23:59:59.000Z",
  "imageKey": "offers/uuid.jpg",
  "imageUrl": "https://cdn.yourdomain.com/offers/uuid.jpg"
}
\`\`\`

**Validation Rules**:
- All fields except `imageKey` and `imageUrl` are required
- `discountedPrice` must be less than `originalPrice`
- `validFrom` must be before `validUntil`
- `title` max length: 200 characters
- `description` max length: 1000 characters

**Response**:
\`\`\`json
{
  "offer": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "title": "New Offer Title",
    // ... full offer object
  }
}
\`\`\`

**Status Codes**:
- `201` - Created successfully
- `400` - Validation error
- `401` - Not authenticated
- `500` - Server error

### Get Single Offer

Retrieves a specific offer by ID.

**Endpoint**: `GET /api/admin/offers/[id]`

**Headers**: Requires authentication cookie

**Response**:
\`\`\`json
{
  "offer": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "title": "Summer Sale - 50% Off Electronics",
    // ... full offer object
  }
}
\`\`\`

**Status Codes**:
- `200` - Success
- `401` - Not authenticated
- `404` - Offer not found
- `500` - Server error

### Update Offer

Updates an existing offer.

**Endpoint**: `PUT /api/admin/offers/[id]`

**Headers**: Requires authentication cookie

**Request Body**: Same as create offer

**Response**: Same as create offer

**Status Codes**:
- `200` - Updated successfully
- `400` - Validation error
- `401` - Not authenticated
- `404` - Offer not found
- `500` - Server error

### Delete Offer

Permanently deletes an offer and its associated image from R2.

**Endpoint**: `DELETE /api/admin/offers/[id]`

**Headers**: Requires authentication cookie

**Response**:
\`\`\`json
{
  "success": true
}
\`\`\`

**Status Codes**:
- `200` - Deleted successfully
- `401` - Not authenticated
- `404` - Offer not found
- `500` - Server error

### Toggle Offer Visibility

Toggles the `isHidden` flag of an offer without deleting it.

**Endpoint**: `PATCH /api/admin/offers/[id]/toggle`

**Headers**: Requires authentication cookie

**Response**:
\`\`\`json
{
  "offer": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "isHidden": true,
    // ... full offer object
  }
}
\`\`\`

**Status Codes**:
- `200` - Toggled successfully
- `401` - Not authenticated
- `404` - Offer not found
- `500` - Server error

### Get Signed Upload URL

Generates a signed URL for direct image upload to Cloudflare R2.

**Endpoint**: `POST /api/admin/upload/signed-url`

**Headers**: Requires authentication cookie

**Request Body**:
\`\`\`json
{
  "fileName": "image.jpg",
  "fileType": "image/jpeg"
}
\`\`\`

**Response**:
\`\`\`json
{
  "signedUrl": "https://account.r2.cloudflarestorage.com/bucket/offers/uuid.jpg?X-Amz-Algorithm=...",
  "imageKey": "offers/uuid.jpg",
  "imageUrl": "https://cdn.yourdomain.com/offers/uuid.jpg"
}
\`\`\`

**Usage**:
1. Get signed URL from this endpoint
2. Upload file directly to `signedUrl` using PUT request
3. Use `imageKey` and `imageUrl` when creating/updating offers

**Status Codes**:
- `200` - Success
- `400` - Invalid file type or missing parameters
- `401` - Not authenticated
- `500` - Server error

## Error Responses

All endpoints return errors in this format:

\`\`\`json
{
  "error": "Error message description"
}
\`\`\`

## Rate Limiting

Currently no rate limiting is implemented. Consider adding rate limiting for production use.

## CORS

CORS is configured to allow requests from the same origin. Adjust CORS settings if needed for different deployment scenarios.
