"use client";
import LoadingScreen from "@/components/common/loading-screen";
import SettingField from "@/components/templates/settings/setting-field";
import { getSettings } from "@/core/actions";
import { Setting, SettingsArray } from "@/core/types/types";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const ClientPage = () => {
  const { data, refetch, isLoading } = useQuery({
    queryKey: ["application-settings"],
    queryFn: getSettings,
  });

  const settings: SettingsArray = data?.data;

  if (isLoading) return <LoadingScreen />;
  return (
    <div className="space-y-10 max-w-3xl mx-auto text-sm">
      {settings.map((setting: Setting) => (
        <SettingField setting={setting} onSuccess={refetch} key={setting?.name} />
      ))}
    </div>
  );
};

export default ClientPage;
