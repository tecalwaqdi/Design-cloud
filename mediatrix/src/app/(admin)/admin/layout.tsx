import type { Metadata } from "next";
import "../../globals.css";
import { fontVars } from "@/lib/fonts";

export const metadata: Metadata = { title: "لوحة التحكم | Mediatrix", robots: { index: false, follow: false }, icons: { icon: "/icon.svg" } };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={fontVars}>
      <body className="bg-ice min-h-screen">{children}</body>
    </html>
  );
}
