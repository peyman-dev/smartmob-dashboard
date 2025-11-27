"use client";
import { NextIntlClientProvider } from "next-intl";
import React, { ReactNode, useEffect } from "react";
import { useLocalization } from "../stores/localization.store";

const LocaleProvider = ({ children }: { children: ReactNode }) => {
  const { refetchMessages, locale, messages } = useLocalization();

  useEffect(() => {
    refetchMessages();
  }, []);

  return <NextIntlClientProvider locale={locale} messages={messages}>{children}</NextIntlClientProvider>;
};

export default LocaleProvider;
