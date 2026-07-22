import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { ApiError, toErrorResponse } from "@/lib/errors";
import { getPortfolio, updatePortfolio } from "@/lib/firebase";
import { validatePortfolioAssets } from "@/lib/validate";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await requireUser(req);
    const portfolio = await getPortfolio(session);
    return NextResponse.json(portfolio || { assets: [] });
  } catch (error) {
    return toErrorResponse(error, "GET /api/portfolio");
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

    const assets = validatePortfolioAssets(body);
    await updatePortfolio(session, assets);
    return NextResponse.json({ success: true });
  } catch (error) {
    return toErrorResponse(error, "POST /api/portfolio");
  }
}
