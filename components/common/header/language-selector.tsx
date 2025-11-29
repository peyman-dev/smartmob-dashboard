"use client";

import { Select } from "antd";
import { useEffect, useState, useTransition } from "react";
import LoadingScreen from "../loading-screen";
import { useLocalization } from "@/core/stores/localization.store";

const languages = [
  { value: "fa", label: "فارسی", flag: "🇮🇷" },
  { value: "en", label: "English", flag: "🇬🇧" },
];

export function LanguageSelector() {
  const { locale, changeLocale, refetchMessages, status } = useLocalization();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (v: "en" | "fa") => {
    changeLocale(v);
    startTransition(async () => {
      const res = await fetch("/api/locale", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          locale: v,
        }),
      });
      const data = await res.json();
    });
  };

  if (isPending) return <LoadingScreen />;

  if (status == "pending") {
    return <div
    className="font-estedad! h-14! border-neutral-100! **:border-neutral-200! md:w-30"
    ></div>;
  } else
    return (
      <Select
        value={locale}
        onChange={(v) => {
          handleSubmit(v as "en" | "fa");
          changeLocale(v);
        }}
        className="font-estedad! h-14! border-neutral-100! **:border-neutral-200! md:w-30"
        popupClassName="font-estedad"
        options={languages.map((lang) => ({
          value: lang.value,
          label: (
            <div className="flex items-center gap-2">
              <span>{lang.flag}</span>
              <span>{lang.label}</span>
            </div>
          ),
        }))}
        suffixIcon={
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 4.5L6 7.5L9 4.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        }
      />
    );
}
