// app/layout.tsx
import "./globals.css";

export const metadata = {
  title: "Reklama kadr anketasi",
  description: "Next.js + Tailwind + Telegram",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz" translate="no" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-50 antialiased">{children}</body>
    </html>
  );
}
