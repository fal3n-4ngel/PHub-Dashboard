import { NextResponse } from "next/server";

// Error with an HTTP status, safe to surface to the client verbatim.
export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

const STATUS_LABELS: Record<number, string> = {
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  429: "Too Many Requests",
  500: "Internal Server Error",
  502: "Bad Gateway",
};

// Maps any thrown value to a JSON error response. Only ApiError messages are
// exposed; anything else is logged server-side and returned as an opaque 500 so
// internals (stack traces, upstream URLs, config details) never leak.
export function toErrorResponse(error: unknown, context: string): NextResponse {
  if (error instanceof ApiError) {
    return NextResponse.json(
      { error: STATUS_LABELS[error.status] || "Error", message: error.message },
      { status: error.status }
    );
  }

  console.error(`${context}:`, error);
  return NextResponse.json(
    { error: "Internal Server Error", message: "Something went wrong. Please try again." },
    { status: 500 }
  );
}
