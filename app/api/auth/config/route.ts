import { NextRequest, NextResponse } from "next/server";
import { getCredentials, parseFirebaseConfig } from "@/lib/credentials";
import { toErrorResponse } from "@/lib/errors";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const creds = await getCredentials(req);
    const config = parseFirebaseConfig(creds);

    // Return only public Web SDK configuration fields
    const publicConfig = {
      apiKey: config.apiKey,
      authDomain: config.authDomain,
      projectId: config.projectId,
      storageBucket: config.storageBucket,
      messagingSenderId: config.messagingSenderId,
      appId: config.appId,
    };

    return NextResponse.json(publicConfig);
  } catch (error) {
    return toErrorResponse(error, "GET /api/auth/config");
  }
}
