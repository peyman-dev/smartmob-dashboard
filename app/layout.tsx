import "@/public/assets/static/css/globals.css";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import { Toaster } from "sonner";
import AuthenticationProvider from "@/core/providers/auth-provider";
import ApplicationProvider from "@/core/providers/application-provider";
import LocaleProvider from "@/core/providers/locale-providert";
import { Metadata } from "next";
import PWAProvider from "@/core/providers/pwa-provider";

export const metadata: Metadata = {
  title: "RivaFollows CMS",
  appleWebApp: {
    title: "RivaFollows CMS",
    statusBarStyle: "default",
    capable: true,
  },
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <head>
        {/* اینا رو حتماً دستی اضافه کن */}
        <link rel="manifest" href="/manifest.webmanifest" />
        <link
          rel="apple-touch-icon"
          href="/assets/static/icons/icon-192x192.png"
        />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className="w-dvw! relative overflow-x-hidden">
        <LocaleProvider>
          <ApplicationProvider>
            <PWAProvider>
              <AuthenticationProvider>
                <Toaster
                  richColors
                  position="top-right"
                  className="font-estedad! **:font-estedad!"
                />
                <DashboardLayout>{children}</DashboardLayout>
              </AuthenticationProvider>
            </PWAProvider>
          </ApplicationProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
