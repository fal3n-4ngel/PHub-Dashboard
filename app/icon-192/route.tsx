import { ImageResponse } from "next/og";

export const size = { width: 192, height: 192 };
export const contentType = "image/png";

// Standalone Route Handler (not the special icon.tsx convention) so the URL
// is stable and predictable for manifest.ts to reference directly — needed
// because generateImageMetadata's multi-size output uses generated query
// strings we can't hardcode into the manifest.
export async function GET() {
  const cell = 68;
  const gap = 12;
  const radius = 42; // baked-in rounding so the icon still looks like an app icon on launchers that don't apply their own mask

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f4f3ec",
          borderRadius: radius,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap }}>
          <div style={{ display: "flex", gap }}>
            <div style={{ display: "flex", width: cell, height: cell, borderRadius: 16, backgroundColor: "#1c1b18" }} />
            <div style={{ display: "flex", width: cell, height: cell, borderRadius: 16, backgroundColor: "#1c1b18", opacity: 0.55 }} />
          </div>
          <div style={{ display: "flex", gap }}>
            <div style={{ display: "flex", width: cell, height: cell, borderRadius: 16, backgroundColor: "#1c1b18", opacity: 0.55 }} />
            <div style={{ display: "flex", width: cell, height: cell, borderRadius: 16, backgroundColor: "#1c1b18", opacity: 0.85 }} />
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
