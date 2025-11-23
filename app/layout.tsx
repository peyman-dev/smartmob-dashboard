import type { Metadata } from "next";
import "@/public/assets/static/css/globals.css";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import { Toaster } from 'sonner';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa-IR" dir="rtl">
      <body>
        <Toaster richColors/>
        <DashboardLayout>{children}</DashboardLayout>
      </body>
    </html>
  );
}
