import "@/public/assets/static/css/globals.css";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import { Toaster } from "sonner";
import AuthenticationProvider from "@/core/providers/auth-provider";
import ApplicationProvider from "@/core/providers/application-provider";
import LocaleProvider from "@/core/providers/locale-providert";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>
        <LocaleProvider>
          <ApplicationProvider>
            <AuthenticationProvider>
              <Toaster richColors className="font-estedad! **:font-estedad!" />
              <DashboardLayout>{children}</DashboardLayout>
            </AuthenticationProvider>
          </ApplicationProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
