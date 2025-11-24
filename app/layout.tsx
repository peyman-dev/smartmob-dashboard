import type { Metadata } from "next";
import "@/public/assets/static/css/globals.css";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import { Toaster } from "sonner";
import AuthenticationProvider from "@/core/providers/auth-provider";
import ApplicationProvider from "@/core/providers/application-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa-IR" dir="rtl">
      <body>
        <ApplicationProvider>
          <AuthenticationProvider>
            <Toaster richColors className="font-estedad! **:font-estedad!" />
            <DashboardLayout>{children}</DashboardLayout>
          </AuthenticationProvider>
        </ApplicationProvider>
      </body>
    </html>
  );
}
