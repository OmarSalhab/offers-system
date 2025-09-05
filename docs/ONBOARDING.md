# Developer Onboarding Guide

Welcome to the Offers System! This guide will help you get up to speed quickly with the codebase, architecture, and development workflow.

## 🎯 Quick Overview

The Offers System is a Next.js application that allows administrators to manage special offers with image uploads, while providing a public interface for customers to view active offers.

**Key Technologies**: Next.js 15, TypeScript, MongoDB, Cloudflare R2, JWT Authentication, Tailwind CSS

## 🚀 Getting Started (5 minutes)

### 1. Environment Setup

\`\`\`bash
# Clone and install
git clone <repository-url>
cd offers-system
npm install

# Copy environment template
cp .env.example .env.local
\`\`\`

### 2. Configure Environment Variables

Edit `.env.local` with your values:

\`\`\`env
# Required for basic functionality
MONGODB_URI=mongodb://localhost:27017/offers-system
JWT_SECRET=your-secret-key-here

# Required for image uploads (can be configured later)
R2_ENDPOINT=https://your-account.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=your-key
R2_SECRET_ACCESS_KEY=your-secret
R2_BUCKET_NAME=offers-images
CDN_BASE_URL=https://cdn.yourdomain.com
\`\`\`

### 3. Start Development

\`\`\`bash
# Seed database with admin user and sample data
npm run seed

# Start development server
npm run dev
\`\`\`

**Access Points**:
- Public site: http://localhost:3000
- Admin login: http://localhost:3000/login
- Credentials: `admin@offers-system.com` / `admin123`

## 📚 Understanding the Codebase

### Project Structure Overview

\`\`\`
offers-system/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Protected admin pages
│   ├── api/               # API routes
│   ├── login/             # Admin login page
│   └── page.tsx           # Public homepage
├── components/ui/         # Reusable UI components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries
├── models/                # MongoDB models
├── scripts/               # Database scripts
└── middleware.ts          # Route protection
\`\`\`

### Key Concepts

#### 1. Authentication Flow
- **JWT-based**: Uses httpOnly cookies for security
- **Single Admin**: Only one admin user (can be extended)
- **Hidden Login**: No public links to `/login` page
- **Route Protection**: Middleware protects `/admin/*` routes

#### 2. Image Upload Workflow
- **Signed URLs**: Direct browser upload to Cloudflare R2
- **No Server Transit**: Images bypass Next.js server
- **Metadata Storage**: Only keys/URLs stored in MongoDB
- **CDN Delivery**: Images served via Cloudflare CDN

#### 3. Data Models
- **Offers**: Title, description, prices, dates, images, visibility
- **Admin**: Email, hashed password, name
- **Validation**: Frontend + backend validation

## 🛠 Development Workflow

### Common Tasks

#### Adding a New Offer Field

1. **Update Model** (`models/Offer.ts`):
\`\`\`typescript
const OfferSchema = new Schema({
  // existing fields...
  newField: {
    type: String,
    required: true,
  },
})
\`\`\`

2. **Update API** (`app/api/admin/offers/route.ts`):
\`\`\`typescript
const { title, description, newField, /* other fields */ } = body
// Add validation for newField
\`\`\`

3. **Update Forms** (`app/admin/offers/new/page.tsx`):
\`\`\`tsx
const [formData, setFormData] = useState({
  // existing fields...
  newField: "",
})
\`\`\`

#### Adding a New Admin Endpoint

1. **Create Route** (`app/api/admin/new-endpoint/route.ts`):
\`\`\`typescript
import { getCurrentAdmin } from "@/lib/auth"

export async function GET() {
  const admin = await getCurrentAdmin()
  if (!admin) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }
  // Your logic here
}
\`\`\`

2. **Update Middleware** (if needed):
\`\`\`typescript
export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/api/admin/new-endpoint/:path*"],
}
\`\`\`

### Testing Your Changes

\`\`\`bash
# Run the application
npm run dev

# Test public functionality
curl http://localhost:3000/api/offers

# Test admin functionality (after login)
curl -b cookies.txt http://localhost:3000/api/admin/offers
\`\`\`

## 🔧 Key Files to Know

### Essential Files

| File | Purpose | When to Modify |
|------|---------|----------------|
| `app/page.tsx` | Public homepage | Changing public UI |
| `app/admin/page.tsx` | Admin dashboard | Modifying admin interface |
| `models/Offer.ts` | Offer data model | Adding/changing offer fields |
| `lib/auth.ts` | Authentication utilities | Changing auth logic |
| `middleware.ts` | Route protection | Adding protected routes |

### Configuration Files

| File | Purpose | When to Modify |
|------|---------|----------------|
| `.env.example` | Environment template | Adding new env vars |
| `lib/mongodb.ts` | Database connection | Changing DB config |
| `lib/r2Client.ts` | R2 storage config | Modifying storage setup |

## 🐛 Common Issues & Solutions

### Database Connection Issues

**Problem**: `MongooseError: Operation buffering timed out`

**Solution**:
\`\`\`bash
# Check MongoDB is running
mongosh mongodb://localhost:27017/offers-system

# Or use MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/offers-system
\`\`\`

### Image Upload Not Working

**Problem**: Images not uploading or displaying

**Solutions**:
1. **Check R2 Configuration**:
   \`\`\`bash
   # Verify environment variables are set
   echo $R2_ENDPOINT
   echo $R2_ACCESS_KEY_ID
   \`\`\`

2. **Check CORS Settings** in Cloudflare R2 dashboard

3. **Verify CDN Domain** is properly configured

### Authentication Issues

**Problem**: Admin can't access dashboard after login

**Solutions**:
1. **Check JWT Secret**:
   \`\`\`bash
   # Ensure JWT_SECRET is set and consistent
   echo $JWT_SECRET
   \`\`\`

2. **Clear Cookies** and try logging in again

3. **Check Middleware Configuration** in `middleware.ts`

## 📖 Learning Resources

### Next.js Concepts Used
- **App Router**: File-based routing system
- **API Routes**: Server-side endpoints
- **Middleware**: Request/response interception
- **Server Components**: Default rendering mode

### External Services
- **MongoDB**: Document database with Mongoose ODM
- **Cloudflare R2**: S3-compatible object storage
- **JWT**: JSON Web Tokens for authentication

### Useful Commands

\`\`\`bash
# Database operations
npm run seed           # Create admin user and sample data
npm run clear-db       # Clear all database data

# Development
npm run dev           # Start development server
npm run build         # Build for production
npm run lint          # Check code quality

# Debugging
console.log("[DEBUG]", data)  # Add debug logs
\`\`\`

## 🚀 Next Steps

### Immediate Tasks (First Day)
1. ✅ Set up development environment
2. ✅ Run the application locally
3. ✅ Create a test offer through admin interface
4. ✅ Verify offer appears on public homepage

### Week 1 Goals
- [ ] Understand the authentication flow
- [ ] Modify an existing component
- [ ] Add a simple new field to offers
- [ ] Deploy to a staging environment

### Advanced Topics (Week 2+)
- [ ] Implement additional admin features
- [ ] Add API rate limiting
- [ ] Implement offer analytics
- [ ] Add email notifications
- [ ] Optimize performance

## 🤝 Getting Help

### Code Review Process
1. Create feature branch from `main`
2. Make changes with clear commit messages
3. Test thoroughly in development
4. Submit pull request with description
5. Address review feedback

### Documentation
- **API Reference**: See `docs/API.md`
- **Architecture**: See `docs/ARCHITECTURE.md`
- **README**: See main `README.md`

### Questions?
- Check existing documentation first
- Review similar implementations in codebase
- Ask specific questions with context
- Include error messages and steps to reproduce

## 🎉 Welcome to the Team!

You're now ready to contribute to the Offers System. Start with small changes to get familiar with the codebase, and don't hesitate to ask questions. Happy coding! 🚀
