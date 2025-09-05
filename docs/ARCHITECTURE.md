# System Architecture

## Overview

The Offers System is built as a full-stack Next.js application with a clear separation between public and admin functionality. The architecture follows modern web development practices with secure authentication, efficient image handling, and scalable data storage.

## Architecture Diagram

\`\`\`
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Public Users  │    │     Admin       │    │   Cloudflare    │
│                 │    │                 │    │      R2         │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          │ View Offers          │ Manage Offers        │ Image Storage
          │                      │                      │
          ▼                      ▼                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Next.js Application                          │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │  Public Pages   │  │  Admin Pages    │  │   API Routes    │ │
│  │                 │  │                 │  │                 │ │
│  │ • Homepage      │  │ • Dashboard     │  │ • Public API    │ │
│  │ • Offers List   │  │ • Create/Edit   │  │ • Admin API     │ │
│  │                 │  │ • Login         │  │ • Auth API      │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    Middleware Layer                         │ │
│  │  • Route Protection  • JWT Verification  • CORS Handling   │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
          │                      │                      │
          ▼                      ▼                      ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│    MongoDB      │    │   JWT Tokens    │    │      CDN        │
│                 │    │                 │    │                 │
│ • Offers        │    │ • httpOnly      │    │ • Image         │
│ • Admin Users   │    │   Cookies       │    │   Delivery      │
│                 │    │ • 7-day Expiry  │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
\`\`\`

## Data Flow

### Public User Flow
1. **User visits homepage** → Next.js renders public page
2. **Page requests offers** → API fetches active offers from MongoDB
3. **Offers displayed** → Images served from CDN

### Admin Management Flow
1. **Admin navigates to /login** → Hidden login page (no public links)
2. **Submits credentials** → API validates against MongoDB
3. **JWT issued** → Stored in httpOnly cookie
4. **Access admin dashboard** → Middleware verifies JWT
5. **Manage offers** → CRUD operations via protected API routes

### Image Upload Flow
1. **Admin selects image** → Preview shown in browser
2. **Form submission** → Request signed URL from API
3. **Direct upload** → Browser uploads to R2 using signed URL
4. **Save metadata** → Store imageKey and imageUrl in MongoDB
5. **Public access** → Images served via CDN

## Component Architecture

### Frontend Components

\`\`\`
app/
├── (public)/
│   └── page.tsx                 # Public homepage
├── admin/
│   ├── layout.tsx              # Admin layout with navigation
│   ├── page.tsx                # Offers management dashboard
│   └── offers/
│       ├── new/page.tsx        # Create offer form
│       └── [id]/edit/page.tsx  # Edit offer form
└── login/page.tsx              # Hidden admin login
\`\`\`

### API Architecture

\`\`\`
api/
├── offers/route.ts             # Public offers endpoint
├── auth/
│   ├── login/route.ts          # Admin authentication
│   ├── logout/route.ts         # Session termination
│   └── me/route.ts             # Current user info
└── admin/                      # Protected admin endpoints
    ├── offers/
    │   ├── route.ts            # CRUD operations
    │   └── [id]/
    │       ├── route.ts        # Single offer operations
    │       └── toggle/route.ts # Visibility toggle
    └── upload/
        └── signed-url/route.ts # Image upload URLs
\`\`\`

## Security Architecture

### Authentication Flow
1. **Credential Validation** → bcrypt password hashing
2. **JWT Generation** → Signed with secret key
3. **Cookie Storage** → httpOnly, secure, sameSite
4. **Route Protection** → Middleware verification
5. **API Protection** → Token validation on admin endpoints

### Security Measures
- **Password Hashing**: bcrypt with salt rounds
- **JWT Security**: httpOnly cookies prevent XSS
- **Route Protection**: Middleware guards admin routes
- **Input Validation**: Frontend and backend validation
- **File Upload Security**: Type and size validation
- **Hidden Admin Access**: No public navigation to admin

## Database Schema

### Offers Collection
\`\`\`javascript
{
  _id: ObjectId,
  title: String (required, max 200 chars),
  description: String (required, max 1000 chars),
  originalPrice: Number (required, min 0),
  discountedPrice: Number (required, min 0),
  validFrom: Date (required),
  validUntil: Date (required),
  imageKey: String (optional, R2 object key),
  imageUrl: String (optional, CDN URL),
  isHidden: Boolean (default false),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
\`\`\`

### Admin Collection
\`\`\`javascript
{
  _id: ObjectId,
  email: String (required, unique, lowercase),
  password: String (required, hashed),
  name: String (required, max 100 chars),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
\`\`\`

## Storage Architecture

### Cloudflare R2 Integration
- **Bucket Structure**: `offers/[uuid].[extension]`
- **Upload Method**: Signed URLs for direct browser upload
- **Access Control**: Public read, admin write
- **CDN Integration**: Custom domain for optimized delivery

### Image Workflow
1. **Selection** → Client-side preview
2. **Upload Request** → Generate signed URL
3. **Direct Upload** → Browser → R2 (bypasses server)
4. **Metadata Storage** → Save keys in MongoDB
5. **Public Access** → CDN delivery

## Performance Considerations

### Frontend Optimization
- **Next.js App Router**: Server-side rendering
- **Image Optimization**: Next.js Image component
- **Code Splitting**: Automatic route-based splitting
- **Caching**: Browser and CDN caching

### Backend Optimization
- **MongoDB Connection**: Connection pooling
- **JWT Caching**: Stateless authentication
- **API Efficiency**: Minimal data transfer
- **Image Delivery**: CDN for global distribution

### Scalability Features
- **Stateless Design**: Horizontal scaling ready
- **Database Indexing**: Optimized queries
- **CDN Distribution**: Global image delivery
- **Modular Architecture**: Easy feature additions

## Deployment Architecture

### Recommended Stack
- **Frontend/Backend**: Vercel (Next.js optimized)
- **Database**: MongoDB Atlas (managed)
- **Storage**: Cloudflare R2 (S3-compatible)
- **CDN**: Cloudflare (integrated with R2)

### Environment Configuration
- **Development**: Local MongoDB, R2 dev bucket
- **Staging**: Atlas shared cluster, R2 staging bucket
- **Production**: Atlas dedicated cluster, R2 production bucket

## Monitoring and Maintenance

### Health Checks
- **Database Connection**: MongoDB connectivity
- **Storage Access**: R2 bucket accessibility
- **Authentication**: JWT validation
- **API Endpoints**: Response time monitoring

### Backup Strategy
- **Database**: MongoDB Atlas automated backups
- **Images**: R2 versioning and lifecycle policies
- **Code**: Git repository with CI/CD

## Future Enhancements

### Potential Improvements
- **Multi-admin Support**: Role-based access control
- **Analytics**: Offer performance tracking
- **Notifications**: Email alerts for expiring offers
- **API Rate Limiting**: Prevent abuse
- **Caching Layer**: Redis for improved performance
- **Search Functionality**: Full-text search for offers
- **Bulk Operations**: Mass offer management
- **Audit Logging**: Track admin actions
