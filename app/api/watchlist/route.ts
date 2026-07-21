import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { ApiError, toErrorResponse } from "@/lib/errors";
import { listWatchlist, addWatchlistItem } from "@/lib/firebase";
import { validateNewWatchlistItem } from "@/lib/validate";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await requireUser(req);
    const items = await listWatchlist(session);
    return NextResponse.json(items);
  } catch (error) {
    return toErrorResponse(error, "GET /api/watchlist");
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireUser(req);

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      throw new ApiError(400, "Invalid JSON body");
    }

    const item = validateNewWatchlistItem(body);
    const result = await addWatchlistItem(session, item);
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    return toErrorResponse(error, "POST /api/watchlist");
  }
}
