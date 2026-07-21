/**
 * migrate-expenses.mjs
 * Reads all expenses from the Portfolio Notion database and
 * writes them to the personal-hub-adi Firestore under the given userId.
 *
 * Run from the personal-dashboard directory:
 *   node scripts/migrate-expenses.mjs
 */

import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, where } from "firebase/firestore";
import pkg from "@notionhq/client";
const { Client } = pkg;

// ─── Config ────────────────────────────────────────────────────────────────
const USER_ID = "***REMOVED-USER-UID***";

const FIREBASE_CONFIG = {
  apiKey: "***REMOVED-FIREBASE-API-KEY***",
  authDomain: "personal-hub-adi.firebaseapp.com",
  projectId: "personal-hub-adi",
  storageBucket: "personal-hub-adi.firebasestorage.app",
  messagingSenderId: "793448324934",
  appId: "1:793448324934:web:c6e88abd8e59b0bd3ecf47",
};

const NOTION_TOKEN       = "***REMOVED-NOTION-TOKEN-ROTATE-THIS***";
const NOTION_EXPENSES_DB = "***REMOVED-NOTION-DB-ID***";
const NOTION_CATEGORIES_DB = "***REMOVED-NOTION-DB-ID***";

// ─── Init Clients ───────────────────────────────────────────────────────────
const app = initializeApp(FIREBASE_CONFIG, "migrate");
const db  = getFirestore(app);
const notion = new Client({ auth: NOTION_TOKEN });

// ─── Helpers ────────────────────────────────────────────────────────────────
async function queryAllNotionPages(database_id, sorts = [], filter = null) {
  const results = [];
  let cursor;
  for (let p = 0; p < 20; p++) {
    const res = await notion.databases.query({
      database_id,
      ...(sorts.length && { sorts }),
      ...(filter && { filter }),
      ...(cursor && { start_cursor: cursor }),
    });
    results.push(...res.results);
    if (!res.has_more || !res.next_cursor) break;
    cursor = res.next_cursor;
  }
  return results;
}

// ─── Main ───────────────────────────────────────────────────────────────────
async function migrate() {
  console.log("📖 Fetching categories from Notion...");
  const catPages = await queryAllNotionPages(NOTION_CATEGORIES_DB);
  const catMap   = new Map(); // id → name
  for (const p of catPages) {
    const name = p.properties.Name?.title?.[0]?.plain_text?.trim();
    if (name) catMap.set(p.id, name);
  }
  console.log(`   ✅ ${catMap.size} categories loaded.`);

  console.log("\n📖 Fetching expenses from Notion...");
  const expPages = await queryAllNotionPages(
    NOTION_EXPENSES_DB,
    [{ property: "Date", direction: "descending" }]
  );
  console.log(`   ✅ ${expPages.length} expense records fetched from Notion.`);

  // Check what's already in Firestore to avoid duplicates
  console.log("\n🔍 Checking Firestore for existing records...");
  const existingSnap = await getDocs(
    query(collection(db, "expenses"), where("userId", "==", USER_ID))
  );
  const existingTitles = new Set(
    existingSnap.docs.map((d) => `${d.data().title}::${d.data().date}::${d.data().amount}`)
  );
  console.log(`   ℹ️  ${existingSnap.size} records already in Firestore for this user.`);

  let uploaded = 0;
  let skipped  = 0;
  let failed   = 0;

  console.log("\n⬆️  Migrating expenses to Firestore...\n");

  for (const page of expPages) {
    const props = page.properties;
    const title    = props.Title?.title?.[0]?.plain_text?.trim() || "Untitled";
    const amount   = props.Amount?.number ?? null;
    const date     = props.Date?.date?.start || null;
    const notes    = props.Notes?.rich_text?.[0]?.plain_text || null;
    const catId    = props.Category?.relation?.[0]?.id || null;
    const category = catId ? (catMap.get(catId) || null) : null;

    // Dedup key
    const key = `${title}::${date}::${amount}`;
    if (existingTitles.has(key)) {
      console.log(`  ⏭  Skipped (already exists): ${title} | ${date} | ₹${amount}`);
      skipped++;
      continue;
    }

    try {
      await addDoc(collection(db, "expenses"), {
        userId:    USER_ID,
        title,
        amount,
        category,
        date,
        notes,
        createdAt: Date.now(),
        migratedFrom: "notion",
      });
      console.log(`  ✅ Uploaded: ${title} | ${date} | ₹${amount} | ${category || "—"}`);
      uploaded++;
      existingTitles.add(key); // prevent re-upload in same run
    } catch (err) {
      console.error(`  ❌ Failed: ${title} — ${err.message}`);
      failed++;
    }

    // Small delay to avoid Firestore burst limits
    await new Promise((r) => setTimeout(r, 50));
  }

  console.log(`
─────────────────────────────────────
Migration complete!
  ✅ Uploaded : ${uploaded}
  ⏭  Skipped  : ${skipped}
  ❌ Failed   : ${failed}
─────────────────────────────────────`);
  process.exit(0);
}

migrate().catch((err) => {
  console.error("❌ Migration crashed:", err);
  process.exit(1);
});
