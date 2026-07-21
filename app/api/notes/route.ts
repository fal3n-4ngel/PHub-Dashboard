import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { ApiError, toErrorResponse } from "@/lib/errors";
import { getNote, updateNote } from "@/lib/firebase";
import { validateNoteContent } from "@/lib/validate";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await requireUser(req);
    const note = await getNote(session);
    return NextResponse.json(note || { content: "" });
  } catch (error) {
    return toErrorResponse(error, "GET /api/notes");
  }
}

async function save(req: NextRequest, context: string) {
  try {
    const session = await requireUser(req);

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      throw new ApiError(400, "Invalid JSON body");
    }

    const content = validateNoteContent(body);
    await updateNote(session, content);
    return NextResponse.json({ success: true });
  } catch (error) {
    return toErrorResponse(error, context);
  }
}

// The dashboard's autosave debounce posts here; PUT is kept as the
// semantically-correct alias for direct API callers.
export async function POST(req: NextRequest) {
  return save(req, "POST /api/notes");
}

export async function PUT(req: NextRequest) {
  return save(req, "PUT /api/notes");
}
