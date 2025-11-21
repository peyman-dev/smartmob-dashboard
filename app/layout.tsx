import type { Metadata } from "next";
import "@/public/assets/static/css/globals.css"


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa-IR" dir="rtl">
      <body
      >
        {children}
      </body>
    </html>
  );
}
