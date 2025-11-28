// next.config.ts
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts"); // مسیر فایل i18n.ts یا i18n.js

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },

  // این دو خط جدید و درست (به جای experimental قدیمی)
  serverExternalPackages: ["next-intl"], // ← این دقیقاً همون serverComponentsExternalPackages قبلیه

  // i18n رو کامل حذف کن (در App Router + next-intl دیگه نباید باشه)
  // i18n: { ... } ← حذفش کن!

  // اگه واقعاً می‌خوای خروجی استاتیک بگیری (GitHub Pages و …) اینو بذار:
  // output: "export",
  // images: { unoptimized: true }, // برای خروجی استاتیک لازمه

  // اگه سرور داری (توصیه میشه برای داشبورد) اینا رو نذار
};

export default withNextIntl(nextConfig);