// Test script to validate the extraction pipeline
// Run with: npx tsx scripts/test-extraction.ts

import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

async function testPipeline() {
  console.log("\n=== TESTING EXTRACTION PIPELINE ===\n")

  // Step 1: Check failed records
  const { data: failedRecords } = await supabase
    .from("imported_feedback")
    .select("id, raw_image_url, extraction_error")
    .eq("extraction_status", "failed")
    .order("created_at", { ascending: false })
    .limit(2)

  console.log("Failed records:", JSON.stringify(failedRecords, null, 2))

  if (failedRecords && failedRecords.length > 0) {
    const record = failedRecords[0]
    console.log("\nTesting URL format detection:")
    console.log("URL:", record.raw_image_url)
    console.log("Starts with https://:", record.raw_image_url?.startsWith("https://"))
    console.log("Is Vercel Blob:", record.raw_image_url?.includes("blob.vercel-storage.com"))
  }
}

testPipeline().catch(console.error)
