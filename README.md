# Offers System

A complete Next.js application for managing and displaying special offers with secure admin authentication, image upload capabilities using Cloudflare R2, and MongoDB persistence.

## 🚀 Features

- **Public Offers Display**: Responsive homepage showcasing active offers
- **Admin Management**: Secure admin interface with full CRUD operations
- **Image Upload**: Direct browser upload to Cloudflare R2 with CDN delivery
- **Authentication**: JWT-based admin authentication with httpOnly cookies
- **Database**: MongoDB with Mongoose ODM for robust data persistence
- **Responsive Design**: Mobile-first design with Tailwind CSS v4
- **Security**: Protected admin routes with middleware authentication
- **Validation**: Comprehensive frontend and backend validation

## 🛠 Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS v4
- **Backend**: Next.js API Routes, Mongoose ODM
- **Database**: MongoDB
- **Storage**: Cloudflare R2 (S3-compatible)
- **Authentication**: JWT with httpOnly cookies
- **UI Components**: shadcn/ui components
- **Icons**: Lucide React

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB instance (local or MongoDB Atlas)
- Cloudflare R2 bucket configured
- CDN domain pointing to your R2 bucket (optional but recommended)

## 🚀 Quick Start

### 1. Clone and Install

\`\`\`bash
git clone <repository-url>
cd offers-system
npm install
\`\`\`

### 2. Environment Setup

\`\`\`bash
cp .env.example .env.local
\`\`\`

Edit `.env.local` with your actual values:

\`\`\`env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/offers-system

# Cloudflare R2 Configuration
R2_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=your_r2_access_key_id
R2_SECRET_ACCESS_KEY=your_r2_secret_access_key
R2_BUCKET_NAME=offers-images
CDN_BASE_URL=https://cdn.yourdomain.com

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random

# Optional
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

### 3. Database Setup

\`\`\`bash
# Seed the database with admin user and sample offers
npm run seed
\`\`\`

### 4. Start Development Server

\`\`\`bash
npm run dev
\`\`\`

Visit:
- **Public Site**: `http://localhost:3000`
- **Admin Login**: `http://localhost:3000/login`

### 5. Default Admin Credentials

\`\`\`
Email: admin@offers-system.com
Password: admin123
\`\`\`

## 📁 Project Structure

\`\`\`
offers-system/
├── app/
│   ├── admin/                    # Admin dashboard pages
│   │   ├── layout.tsx           # Admin layout with navigation
│   │   ├── page.tsx             # Offers management dashboard
│   │   └── offers/
│   │       ├── new/page.tsx     # Create offer form
│   │       └── [id]/edit/page.tsx # Edit offer form
│   ├── api/
│   │   ├── auth/                # Authentication endpoints
│   │   │   ├── login/route.ts   # Admin login
│   │   │   ├── logout/route.ts  # Admin logout
│   │   │   └── me/route.ts      # Get current admin
│   │   ├── admin/               # Protected admin API routes
│   │   │   ├── offers/          # Admin CRUD operations
│   │   │   └── upload/          # Image upload endpoints
│   │   └── offers/route.ts      # Public offers API
│   ├── login/page.tsx           # Hidden admin login page
│   ├── layout.tsx               # Root layout with auth provider
│   ├── page.tsx                 # Public homepage
│   └── globals.css              # Global styles
├── components/ui/               # Reusable UI components (shadcn/ui)
├── hooks/
│   └── use-auth.tsx            # Authentication context and hooks
├── lib/
│   ├── auth.ts                 # JWT utilities and auth helpers
│   ├── database-utils.ts       # Database seeding and utilities
│   ├── mongodb.ts              # MongoDB connection utility
│   ├── r2Client.ts             # Cloudflare R2 client setup
│   └── utils.ts                # General utilities
├── models/
│   ├── Admin.ts                # Admin user model
│   └── Offer.ts                # Offer model
├── scripts/
│   ├── seed-database.ts        # Database seeding script
│   └── clear-database.ts       # Database clearing script
├── middleware.ts               # Route protection middleware
└── docs/                       # Additional documentation
    ├── API.md                  # API documentation
    ├── ARCHITECTURE.md         # Architecture overview
    └── ONBOARDING.md           # Developer onboarding guide
\`\`\`

## 🔧 Available Scripts

\`\`\`bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run seed         # Seed database with admin and sample data
npm run clear-db     # Clear all database data
\`\`\`

## 🌐 API Endpoints

### Public Endpoints
- `GET /api/offers` - Fetch active, non-hidden offers

### Authentication Endpoints
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout
- `GET /api/auth/me` - Get current admin info

### Admin Endpoints (Protected)
- `GET /api/admin/offers` - Get all offers (including hidden)
- `POST /api/admin/offers` - Create new offer
- `GET /api/admin/offers/[id]` - Get specific offer
- `PUT /api/admin/offers/[id]` - Update offer
- `DELETE /api/admin/offers/[id]` - Delete offer (removes DB record and R2 image)
- `PATCH /api/admin/offers/[id]/toggle` - Toggle offer visibility
- `POST /api/admin/upload/signed-url` - Get signed URL for image upload

## 🔐 Authentication Flow

1. Admin navigates to `/login` (no UI links to this page)
2. Submits credentials via login form
3. Server validates credentials and issues JWT
4. JWT stored in httpOnly cookie
5. Middleware protects `/admin/*` and `/api/admin/*` routes
6. Admin can access dashboard and manage offers

## 📸 Image Upload Workflow

1. Admin selects image in create/edit form (preview shown)
2. Image is NOT uploaded immediately
3. On form submit, app requests signed URL from `/api/admin/upload/signed-url`
4. Browser uploads image directly to Cloudflare R2 using signed URL
5. App stores `imageKey` and `imageUrl` in MongoDB
6. Images served via CDN for optimal performance

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Environment Variables for Production

Ensure all environment variables are set in your deployment platform:

- `MONGODB_URI` - Production MongoDB connection string
- `R2_ENDPOINT` - Cloudflare R2 endpoint
- `R2_ACCESS_KEY_ID` - R2 access key
- `R2_SECRET_ACCESS_KEY` - R2 secret key
- `R2_BUCKET_NAME` - R2 bucket name
- `CDN_BASE_URL` - CDN domain for images
- `JWT_SECRET` - Strong secret for JWT signing

### Post-Deployment Setup

1. Run database seeding:
   \`\`\`bash
   npm run seed
   \`\`\`

2. Access admin panel at `https://yourdomain.com/login`

## 🔧 Configuration

### Cloudflare R2 Setup

1. Create R2 bucket in Cloudflare dashboard
2. Generate R2 API tokens with read/write permissions
3. (Optional) Set up custom domain for CDN delivery
4. Configure CORS if needed for direct uploads

### MongoDB Setup

1. Create MongoDB database (local or Atlas)
2. Ensure connection string includes database name
3. No additional configuration required (Mongoose handles schema)

## 🛡 Security Features

- **JWT Authentication**: Secure token-based authentication
- **httpOnly Cookies**: Prevents XSS attacks on auth tokens
- **Route Protection**: Middleware protects admin routes
- **Input Validation**: Comprehensive validation on frontend and backend
- **File Upload Security**: Validates file types and sizes
- **Hidden Admin Access**: No public links to admin login

## 📚 Additional Documentation

- [API Documentation](./docs/API.md) - Detailed API reference
- [Architecture Overview](./docs/ARCHITECTURE.md) - System architecture and data flow
- [Developer Onboarding](./docs/ONBOARDING.md) - Guide for new developers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For issues and questions:
1. Check the documentation in the `docs/` folder
2. Review the API documentation
3. Check environment variable configuration
4. Ensure all prerequisites are met

## 🔄 Version History

- **v1.0.0** - Initial release with full CRUD functionality
  - Admin authentication system
  - Offer management with image upload
  - Public offers display
  - Cloudflare R2 integration
  - MongoDB persistence
