"use client";

import { create } from "zustand";

type Locale = "en" | "fa";

interface LocalizationState {
  locale: Locale;
  messages: Record<string, string>;
  status: "pending" | "ready";
  changeLocale: (newLocale: Locale) => Promise<void>;
  refetchMessages: () => Promise<void>;
}

export const useLocalization = create<LocalizationState>((set, get) => ({
  locale: "fa" as Locale,
  messages: {},
  status: "pending",

  async refetchMessages() {
    set({ status: "pending" });
    try {
      const res = await fetch("/api/locale/messages");
      const data = await res.json();
      console.log(data)
      set({
        locale: data.locale,
        messages: data.messages,
        status: "ready",
      });

      // تغییر direction
      document.documentElement.dir = data.locale === "fa" ? "rtl" : "ltr";
      document.documentElement.lang = data.locale;
    } catch (err) {
      console.error("Failed to fetch messages", err);
      set({ status: "ready" });
    }
  },

  async changeLocale(newLocale: Locale) {
    // ست کردن کوکی (برای درخواست‌های بعدی سرور)
    await fetch("/api/locale/change-locale", {
      method: "POST",
      body: JSON.stringify({ locale: newLocale }),
      headers: { "Content-Type": "application/json" },
    });

    // سپس پیام‌ها رو دوباره بگیریم
    await get().refetchMessages();
  },
}));