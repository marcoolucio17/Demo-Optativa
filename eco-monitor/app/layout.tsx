import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HFC TraceSystem",
  description:
    "Trazabilidad certificada de refrigerantes HFC — Arca Continental",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
