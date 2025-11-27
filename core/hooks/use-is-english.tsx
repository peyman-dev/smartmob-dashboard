"use client";
import React from "react";
import { useLocalization } from "../stores/localization.store";

const useIsEnglish = () => {
  const { locale } = useLocalization();
  return locale == "en";
};

export default useIsEnglish;
