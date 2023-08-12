import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NOSTR URL Shortener",
  description: "A URL shortener that stores your links on the NOSTR protocol.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
