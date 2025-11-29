export const dynamic = "force-dynamic";
export const revalidate = 0;
import SettingField from "@/components/templates/settings/setting-field";
import { getSettings } from "@/core/actions";
import { Setting, SettingsArray } from "@/core/types/types";
import React from "react";
import ClientPage from "./client-page";

export const metadata = {
  title: "تنظیمات اپلیکیشن",
};

const page = () => {
  // const res = await ()

  // console.log(settings)
  return <ClientPage />;
};

export default page;
