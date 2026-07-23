import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

// Android adaptive icons apply their own mask shape (circle/squircle/rounded
// square depending on device) over the full-bleed background, cropping
// anything outside the center ~66% "safe zone" — so the glyph is kept small
// and centered here instead of filling the canvas like the "any" variant.
export async function GET() {
  const cell = 130;
  const gap = 24;

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
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap }}>
          <div style={{ display: "flex", gap }}>
            <div style={{ display: "flex", width: cell, height: cell, borderRadius: 30, backgroundColor: "#1c1b18" }} />
            <div style={{ display: "flex", width: cell, height: cell, borderRadius: 30, backgroundColor: "#1c1b18", opacity: 0.55 }} />
          </div>
          <div style={{ display: "flex", gap }}>
            <div style={{ display: "flex", width: cell, height: cell, borderRadius: 30, backgroundColor: "#1c1b18", opacity: 0.55 }} />
            <div style={{ display: "flex", width: cell, height: cell, borderRadius: 30, backgroundColor: "#1c1b18", opacity: 0.85 }} />
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
