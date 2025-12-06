"use client";

import React from "react";
import Item from "./item";
import {
  Home,
  Settings,
  ShoppingBag,
  HandCoins,
  Users,
  UserSearch,
  X,
} from "lucide-react";
import { useIsMobile } from "@/core/hooks/use-is-mobile";
import { useSidebarStore } from "@/core/stores/sidebar.store";
import { useTranslations } from "next-intl";
import useIsEnglish from "@/core/hooks/use-is-english";

const Sidebar = () => {
  const isMobile = useIsMobile();
  const { isMenuOpen, toggleMenu } = useSidebarStore();
  const t = useTranslations();

  const isEN = useIsEnglish();
  const isRTL = !isEN;

  /** Desktop version — simple, no animation */
  if (!isMobile) {
    return (
      <aside
        className="w-[230px] min-w-[230px] pt-10 sticky top-0 h-dvh space-y-3 ps-6 pe-3 bg-white shadow"
        style={{
          [isRTL ? "right" : "left"]: 0,
          position: "sticky",
        }}
      >
        <Item Icon={<Home />} href="/" label={t("sidebar.home")} />
        <Item Icon={<Users />} href="/users" label={t("sidebar.users")} />
        <Item Icon={<ShoppingBag />} href="/orders" label={t("sidebar.orders")} />
        <Item Icon={<HandCoins />} href="/transfers" label={t("sidebar.transfers")} />
        <Item Icon={<UserSearch />} href="/accounts" label={t("sidebar.accounts")} />
        <Item Icon={<Settings />} href="/settings" label={t("sidebar.settings")} />
      </aside>
    );
  }

  /** Mobile version — simple, no animation */
  return (
    <>
      {isMenuOpen && (
        <aside
          className="fixed inset-y-0 w-[260px] bg-white shadow-2xl z-50 p-6 space-y-3"
          style={{
            [isRTL ? "right" : "left"]: 0,
          }}
        >
          <div className="mb-10 flex justify-end">
            <button onClick={toggleMenu} className="p-2 -mr-2">
              <X className="w-6 h-6" />
            </button>
          </div>

          <Item Icon={<Home />} href="/" label={t("sidebar.home")} />
          <Item Icon={<ShoppingBag />} href="/orders" label={t("sidebar.orders")} />
          <Item Icon={<HandCoins />} href="/transfers" label={t("sidebar.transfers")} />
          <Item Icon={<Users />} href="/users" label={t("sidebar.users")} />
          <Item Icon={<UserSearch />} href="/accounts" label={t("sidebar.accounts")} />
          <Item Icon={<Settings />} href="/settings" label={t("sidebar.settings")} />
        </aside>
      )}
    </>
  );
};

export default Sidebar;
