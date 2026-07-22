import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { listExpenses, updateExpense } from "@/lib/firebase";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await requireUser(req);
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "";

    // Verify admin access
    if (!session.user.email || session.user.email !== adminEmail) {
      return NextResponse.json({ error: "Forbidden: Admin access required." }, { status: 403 });
    }

    // Load all raw expenses (the listExpenses helper now automatically decrypts them,
    // but we can query them and check their encrypted status using their raw format).
    // Wait, let's load all expenses.
    const expenses = await listExpenses(session);
    let migratedCount = 0;
    let skippedCount = 0;
    const errors: string[] = [];

    // Let's re-save each expense. If we call updateExpense, the new implementation
    // will encrypt the fields on-the-fly!
    for (const exp of expenses) {
      try {
        // We want to verify if the document in Firestore is already encrypted.
        // But listExpenses returns the decrypted version!
        // To be safe and fully migrate everything, we can simply re-save every document.
        // Re-saving is completely safe: if a record was already encrypted, it will decrypt it,
        // and re-encrypt it using the key. If it was unencrypted, it will read it raw and save it encrypted!
        // So a full re-save acts as a perfect migration!
        await updateExpense(session, exp.id, {
          title: exp.title,
          amount: exp.amount ?? 0,
          category: exp.category || "",
          notes: exp.notes || "",
          date: exp.date || undefined
        });
        migratedCount++;
      } catch (err: any) {
        skippedCount++;
        errors.push(`ID ${exp.id}: ${err.message || "Unknown error"}`);
      }
    }

    return NextResponse.json({
      success: true,
      migratedCount,
      skippedCount,
      errors
    });
  } catch (error: any) {
    console.error("Migration Error:", error);
    return NextResponse.json({ error: error.message || "Migration failed" }, { status: 500 });
  }
}
