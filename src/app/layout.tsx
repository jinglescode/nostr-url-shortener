import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "URL Shortener",
  description:
    "A free URL shortener service enabled by the NOSTR protocol, that is fast and fuss-free, stripped of all bells and whistles, no gimmicks—it just works!",
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
