#!/usr/bin/env node

/**
 * Database seeding script
 * Run with: npx tsx scripts/seed-database.ts
 */

import { seedAdmin, seedSampleOffers, getDatabaseStats } from "../lib/database-utils"


async function main() {
  console.log("🌱 Starting database seeding...")

  try {
    // Seed admin user
    console.log("\n📝 Creating admin user...")
    await seedAdmin()

    // Seed sample offers
    console.log("\n🎯 Creating sample offers...")
    await seedSampleOffers()

    // Show database stats
    console.log("\n📊 Database statistics:")
    const stats = await getDatabaseStats()
    console.log(`- Admins: ${stats.admins}`)
    console.log(`- Total offers: ${stats.totalOffers}`)
    console.log(`- Active offers: ${stats.activeOffers}`)

    console.log("\n✅ Database seeding completed successfully!")
    console.log("\n🔐 Admin Login Credentials:")
    console.log("Email: admin@offers-system.com")
    console.log("Password: admin123")
    console.log("\n🌐 Access admin panel at: /login")
  } catch (error) {
    console.error("\n❌ Seeding failed:", error)
    process.exit(1)
  }

  process.exit(0)
}

main()
