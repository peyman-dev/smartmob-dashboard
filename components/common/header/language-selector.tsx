"use client"

import { Select } from "antd"
import { useState } from "react"

const languages = [
  { value: "fa", label: "فارسی", flag: "🇮🇷" },
  { value: "en", label: "English", flag: "🇬🇧" },
]

export function LanguageSelector() {
  const [selectedLang, setSelectedLang] = useState("en")

  return (
    <Select
      value={selectedLang}
      onChange={setSelectedLang}
      className="font-estedad! h-14! border-neutral-100! **:border-neutral-200!"
      style={{ width: 140 }}
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
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
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
  )
}
