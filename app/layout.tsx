import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Personal Hub Dashboard",
  description: "Dynamic tracking dashboard for expenses, movies, TV series, and anime.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
