import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { ApiError, toErrorResponse } from "@/lib/errors";
import { deleteSubscription, updateSubscription } from "@/lib/firebase";

export const dynamic = "force-dynamic";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await requireUser(req);
    await deleteSubscription(session, id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return toErrorResponse(error, "DELETE /api/subscriptions/[id]");
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await requireUser(req);
    let body: any;
    try {
      body = await req.json();
    } catch {
      throw new ApiError(400, "Invalid JSON body");
    }
    await updateSubscription(session, id, body);
    return NextResponse.json({ success: true });
  } catch (error) {
    return toErrorResponse(error, "PATCH /api/subscriptions/[id]");
  }
}
