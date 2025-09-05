#!/usr/bin/env node

/**
 * Database clearing script
 * Run with: npx tsx scripts/clear-database.ts
 */
import "dotenv/config"
import { clearDatabase } from "../lib/database-utils"

async function main() {
  console.log("🗑️  Clearing database...")



  try {
    await clearDatabase()
    console.log("✅ Database cleared successfully!")
  } catch (error) {
    console.error("❌ Failed to clear database:", error)
    process.exit(1)
  }

  process.exit(0)
}

main()
