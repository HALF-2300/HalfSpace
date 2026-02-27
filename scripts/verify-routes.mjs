#!/usr/bin/env node
/**
 * Route Verification Script
 * 
 * Mechanically verifies every URL in contentIndex.json returns 200 or 30x.
 * No assumptions. No narratives. Just HTTP truth.
 */

import fs from "node:fs";

function parseArgs(argv) {
  const args = [...argv];
  let baseUrl;

  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if ((a === "--base" || a === "--base-url") && typeof args[i + 1] === "string") {
      baseUrl = args[i + 1];
      i++;
      continue;
    }
  }

  return { baseUrl };
}

const { baseUrl } = parseArgs(process.argv.slice(2));
const BASE = baseUrl || process.env.BASE_URL || "http://localhost:9200";

console.log("🔍 Route Verification");
console.log(`Base URL: ${BASE}`);
console.log("---\n");

async function checkRoute(url) {
  try {
    const res = await fetch(BASE + url, { 
      redirect: "manual",
      headers: { 'User-Agent': 'HalfSpace-Route-Verifier/1.0' }
    });
    return { 
      url, 
      status: res.status,
      ok: res.status >= 200 && res.status < 400
    };
  } catch (error) {
    const message = error?.cause?.code
      ? `${error.message} (${error.cause.code})`
      : error.message;
    return { 
      url, 
      status: 0, 
      ok: false,
      error: message 
    };
  }
}

async function main() {
  // Preflight: ensure server is reachable
  try {
    const res = await fetch(BASE, { redirect: "manual" });
    if (!res) throw new Error("No response");
  } catch (error) {
    const msg = error?.cause?.code
      ? `${error.message} (${error.cause.code})`
      : error?.message || "Unknown error";
    console.error(`❌ Cannot reach base URL: ${BASE}`);
    console.error(`   ${msg}`);
    console.error(`\nTip: start the dev server first (npm run dev), or pass --base http://localhost:PORT`);
    process.exit(1);
  }

  // Read content index
  let index;
  try {
    const raw = fs.readFileSync("data/contentIndex.json", "utf8");
    index = JSON.parse(raw);
  } catch (error) {
    console.error("❌ Failed to read contentIndex.json:", error.message);
    process.exit(1);
  }

  const items = index?.items || [];
  
  if (!items.length) {
    console.error("❌ contentIndex.json has no items");
    process.exit(1);
  }

  console.log(`Found ${items.length} routes to verify\n`);

  // Check all routes
  const results = [];
  let checked = 0;
  
  for (const item of items) {
    const result = await checkRoute(item.url);
    results.push(result);
    checked++;
    
    // Progress indicator
    if (checked % 10 === 0) {
      console.log(`Checked ${checked}/${items.length}...`);
    }
    
    // Show bad routes immediately
    if (!result.ok) {
      console.error(`❌ ${result.url} → ${result.status}${result.error ? ` (${result.error})` : ''}`);
    }
  }

  // Summary
  console.log("\n---");
  console.log("📊 RESULTS:");
  
  const good = results.filter(r => r.ok);
  const bad = results.filter(r => !r.ok);
  
  console.log(`✅ Good: ${good.length}`);
  console.log(`❌ Bad: ${bad.length}`);
  
  if (bad.length > 0) {
    console.log("\n❌ FAILED ROUTES:");
    bad.forEach(r => {
      console.log(`  - ${r.url} (${r.status})`);
    });
    console.log("\n⚠️  Fix these routes before deployment!");
    process.exit(1);
  } else {
    console.log("\n🎉 All routes verified successfully!");
    process.exit(0);
  }
}

main();
