import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fostra Chat",
  description: "Simple AI chat app powered by OpenAI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs">
      <body>{children}</body>
    </html>
  );
}
