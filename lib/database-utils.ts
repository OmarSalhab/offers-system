import connectDB from "./mongodb"
import Admin from "@/models/Admin"
import Offer from "@/models/Offer"

/**
 * Database utility functions for seeding and management
 */

export async function seedAdmin() {
  try {
    await connectDB()

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({})
    if (existingAdmin) {
      console.log("Admin user already exists")
      return existingAdmin
    }

    // Create default admin user
    const adminData = {
      email: "admin@offers-system.com",
      password: "admin123", // This will be hashed by the pre-save hook
      name: "System Administrator",
    }

    const admin = new Admin(adminData)
    await admin.save()

    console.log("Admin user created successfully")
    console.log(`Email: ${adminData.email}`)
    console.log(`Password: ${adminData.password}`)

    return admin
  } catch (error) {
    console.error("Error seeding admin:", error)
    throw error
  }
}

export async function seedSampleOffers() {
  try {
    await connectDB()

    // Check if offers already exist
    const existingOffers = await Offer.countDocuments()
    if (existingOffers > 0) {
      console.log("Sample offers already exist")
      return
    }

    const sampleOffers = [
      {
        title: "Summer Sale - 50% Off Electronics",
        description:
          "Get amazing discounts on all electronic items including smartphones, laptops, and accessories. Limited time offer!",
        originalPrice: 999.99,
        discountedPrice: 499.99,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        isHidden: false,
      },
      {
        title: "Buy One Get One Free - Fashion Items",
        description:
          "Purchase any fashion item and get another one absolutely free. Mix and match from our entire collection.",
        originalPrice: 79.99,
        discountedPrice: 39.99,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        isHidden: false,
      },
      {
        title: "Weekend Special - Home & Garden",
        description:
          "Transform your living space with our weekend special on home and garden items. Free delivery included!",
        originalPrice: 299.99,
        discountedPrice: 199.99,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        isHidden: false,
      },
    ]

    await Offer.insertMany(sampleOffers)
    console.log("Sample offers created successfully")
  } catch (error) {
    console.error("Error seeding sample offers:", error)
    throw error
  }
}

export async function clearDatabase() {
  try {
    await connectDB()

    await Admin.deleteMany({})
    await Offer.deleteMany({})

    console.log("Database cleared successfully")
  } catch (error) {
    console.error("Error clearing database:", error)
    throw error
  }
}

export async function getDatabaseStats() {
  try {
    await connectDB()

    const adminCount = await Admin.countDocuments()
    const offerCount = await Offer.countDocuments()
    const activeOfferCount = await Offer.countDocuments({
      isHidden: false,
      validFrom: { $lte: new Date() },
      validUntil: { $gte: new Date() },
    })

    return {
      admins: adminCount,
      totalOffers: offerCount,
      activeOffers: activeOfferCount,
    }
  } catch (error) {
    console.error("Error getting database stats:", error)
    throw error
  }
}
