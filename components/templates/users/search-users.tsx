"use client";

import DynamicDrawer from "@/components/common/drawer";
import useToggle from "@/core/hooks/use-toggle";
import { Button, Input, Select } from "antd";
import { Search } from "lucide-react";
import React, { useTransition } from "react";
import { useUserSearchStore } from "./settings/user.search.store";
import { useTranslations } from "next-intl";

type SearchFormValues = {
  status?: 0 | 1;
  deviceId?: string;
  account?: string;
};

const SearchUsers = () => {
  const [values, setValues] = React.useState<SearchFormValues>({});
  const [isDrawerOpen, toggle] = useToggle();
  const [isPending, startTransition] = useTransition();
  const usersT = useTranslations("users")
  const t = useTranslations("common")

  const { search,  clearSearch, setIsSearching } = useUserSearchStore();

  const handleSearch = () => {
    startTransition(async () => {
      await search({
        page: 0,
        limit: 20,
        status: values.status,
        deviceId: values.deviceId?.trim() || undefined,
        account: values.account?.trim() || undefined,
      });
      toggle(); // دراور رو می‌بنده بعد از جستجو (اختیاری)
    setIsSearching(true)
});
  };

  const handleClear = () => {
    setIsSearching(false)
    setValues({});
    clearSearch();
    toggle();
  };

  return (
    <>
      <div className="*:cursor-pointer *:flex *:items-center *:gap-1 *:h-10 *:rounded-lg *:bg-white *:justify-center *:hover:shadow-sm text-xs *:px-3 *:border *:border-zinc-200">
        <Button
           onClick={() => toggle()}
          iconPosition="end"
          
          icon={<Search className="size-4.5" />}
        >
          <span>{usersT("searchUsers")}</span>
        </Button>
      </div>

      <DynamicDrawer open={isDrawerOpen} toggle={toggle} title={usersT("searchUsers")}>
        <div className="space-y-5">
          {/* وضعیت کاربر */}
          <div className="space-y-2">
            <label>{usersT("user_status")}</label>
            <Select
              allowClear
              placeholder={usersT("status_placeholder")}
              className="w-full h-10"
              value={values.status}
              onChange={(v) => setValues((p) => ({ ...p, status: v }))}
              options={[
                { label: usersT("status_active"), value: 0 },
                { label: usersT("status_blocked"), value: 1 },
              ]}
            />
          </div>

          {/* شناسه دستگاه */}
          <div className="space-y-2">
            <label>{usersT("deviceId")} (deviceId)</label>
            <Input
              dir="ltr"
              placeholder={usersT("device_id_placeholder")}
              value={values.deviceId ?? ""}
              onChange={(e) => setValues((p) => ({ ...p, deviceId: e.target.value }))}
            />
          </div>

          {/* نام کاربری اکانت */}
          <div className="space-y-2">
            <label>{usersT("account")}</label>
            <Input
              dir="ltr"
              placeholder={usersT("account_placeholder")}
              value={values.account ?? ""}
              onChange={(e) => setValues((p) => ({ ...p, account: e.target.value }))}
            />
          </div>

          {/* دکمه‌ها */}
          <div className="flex gap-3 pt-4">
            <Button
              type="primary"
              size="large"
              className="flex-1"
              loading={isPending}
              onClick={handleSearch}
            >
              {t("confirm")}
            </Button>
            <Button size="large" className="flex-1" onClick={handleClear}>
              {t("clear")}
            </Button>
          </div>
        </div>
      </DynamicDrawer>
    </>
  );
};

export default SearchUsers;