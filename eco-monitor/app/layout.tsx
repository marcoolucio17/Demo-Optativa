import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

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
      <body>
        {children}
        <Toaster
          position="top-right"
          theme="dark"
          toastOptions={{
            style: {
              background: "var(--surface-elevated)",
              border: "1px solid var(--border-subtle)",
              color: "var(--text-primary)",
              fontFamily: "IBM Plex Sans",
            },
          }}
        />
      </body>
    </html>
  );
}
