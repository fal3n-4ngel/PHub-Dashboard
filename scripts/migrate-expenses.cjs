/**
 * migrate-expenses.cjs
 * Run: node scripts/migrate-expenses.cjs
 */

const { Client } = require("@notionhq/client");

const USER_ID = "***REMOVED-USER-UID***";

const FIREBASE_CONFIG = {
  apiKey: "***REMOVED-FIREBASE-API-KEY***",
  authDomain: "personal-hub-adi.firebaseapp.com",
  projectId: "personal-hub-adi",
  storageBucket: "personal-hub-adi.firebasestorage.app",
  messagingSenderId: "793448324934",
  appId: "1:793448324934:web:c6e88abd8e59b0bd3ecf47",
};

const NOTION_TOKEN         = "***REMOVED-NOTION-TOKEN-ROTATE-THIS***";
const NOTION_EXPENSES_DB   = "***REMOVED-NOTION-DB-ID***";
const NOTION_CATEGORIES_DB = "***REMOVED-NOTION-DB-ID***";

const notion = new Client({ auth: NOTION_TOKEN });

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

async function main() {
  // Load Firebase ESM modules dynamically
  const { initializeApp }                                             = await import("firebase/app");
  const { getFirestore, collection, addDoc, getDocs, query, where }  = await import("firebase/firestore");

  const app = initializeApp(FIREBASE_CONFIG, "migrate");
  const db  = getFirestore(app);

  // ─── Step 1: Categories ───────────────────────────────────────────────────
  console.log("📖 Fetching categories from Notion...");
  const catPages = await queryAllNotionPages(NOTION_CATEGORIES_DB);
  const catMap   = new Map();
  for (const p of catPages) {
    const name = p.properties.Name?.title?.[0]?.plain_text?.trim();
    if (name) catMap.set(p.id, name);
  }
  console.log(`   ✅ ${catMap.size} categories loaded.`);

  // ─── Step 2: Expenses from Notion ────────────────────────────────────────
  console.log("\n📖 Fetching expenses from Notion...");
  const expPages = await queryAllNotionPages(
    NOTION_EXPENSES_DB,
    [{ property: "Date", direction: "descending" }]
  );
  console.log(`   ✅ ${expPages.length} records fetched from Notion.`);

  // ─── Step 3: Dedup check in Firestore ────────────────────────────────────
  console.log("\n🔍 Checking Firestore for existing records...");
  const existingSnap = await getDocs(
    query(collection(db, "expenses"), where("userId", "==", USER_ID))
  );
  const existingKeys = new Set(
    existingSnap.docs.map((d) => `${d.data().title}::${d.data().date}::${d.data().amount}`)
  );
  console.log(`   ℹ️  ${existingSnap.size} records already in Firestore.`);

  // ─── Step 4: Upload ───────────────────────────────────────────────────────
  let uploaded = 0, skipped = 0, failed = 0;
  console.log("\n⬆️  Uploading to Firestore...\n");

  for (const page of expPages) {
    const props    = page.properties;
    const title    = props.Title?.title?.[0]?.plain_text?.trim() || "Untitled";
    const amount   = props.Amount?.number                        ?? null;
    const date     = props.Date?.date?.start                     || null;
    const notes    = props.Notes?.rich_text?.[0]?.plain_text     || null;
    const catId    = props.Category?.relation?.[0]?.id           || null;
    const category = catId ? (catMap.get(catId) || null)         : null;

    const key = `${title}::${date}::${amount}`;
    if (existingKeys.has(key)) {
      console.log(`  ⏭  Skip: ${title} (${date})`);
      skipped++;
      continue;
    }

    try {
      await addDoc(collection(db, "expenses"), {
        userId: USER_ID,
        title,
        amount,
        category,
        date,
        notes,
        createdAt: Date.now(),
        migratedFrom: "notion",
      });
      console.log(`  ✅ ${title} | ${date} | ₹${amount} | ${category || "—"}`);
      uploaded++;
      existingKeys.add(key);
    } catch (err) {
      console.error(`  ❌ Failed: ${title} — ${err.message}`);
      failed++;
    }

    await new Promise((r) => setTimeout(r, 60));
  }

  console.log(`
────────────────────────────────────────
Migration complete!
  ✅ Uploaded : ${uploaded}
  ⏭  Skipped  : ${skipped}
  ❌ Failed   : ${failed}
────────────────────────────────────────`);
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Crashed:", err);
  process.exit(1);
});
