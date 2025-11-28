"use client";

import React from "react";
import Item from "./item";
import {
  HandCoins,
  Home,
  Settings,
  ShoppingBag,
  Users,
  UserSearch,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useIsMobile } from "@/core/hooks/use-is-mobile";
import { useSidebarStore } from "@/core/stores/sidebar.store";
import { useTranslations } from "next-intl";
import useIsEnglish from "@/core/hooks/use-is-english";

const Sidebar = () => {
  const isMobile = useIsMobile();
  const { isMenuOpen, toggleMenu } = useSidebarStore();
  const t = useTranslations();
  const isEN = useIsEnglish();

  const ui = {
    desktop: {
      initial: { x: isEN ? -400 : 400 },
      animate: { x: 0 },
    },
    mobile: {
      initial: { x: isEN ? -260 : 260 }, 
      animate: { x: 0 },
      exit: { x: isEN ? -260 : 260 },
    },
  };

  // Desktop Sidebar
  if (!isMobile) {
    return (
      <AnimatePresence>
        <motion.aside
          key="desktop-sidebar"
          {...ui.desktop}
          className="min-w-[250px] sticky top-0 h-dvh space-y-3 p-4"
        >
          <Item Icon={<Home />} href="/" label={t("sidebar.home")} />
          <Item Icon={<ShoppingBag />} href="/orders" label={t("sidebar.orders")} />
          <Item Icon={<HandCoins />} href="/transfers" label={t("sidebar.transfers")} />
          <Item Icon={<UserSearch />} href="/accounts" label={t("sidebar.accounts")} />
          <Item Icon={<Users />} href="/users" label={t("sidebar.users")} />
          <Item Icon={<Settings />} href="/settings" label={t("sidebar.settings")} />
        </motion.aside>
      </AnimatePresence>
    );
  }

  // Mobile Sidebar
  return (
    <AnimatePresence>
      {isMenuOpen && (
        <motion.aside
          key="mobile-sidebar"
          {...ui.mobile}
          className="w-[260px] fixed left-0 top-0 space-y-3 p-6 bg-white shadow-xl h-dvh min-h-dvh z-50"
        >
          <div className="mb-10 flex items-center justify-end">
            <button onClick={toggleMenu}>
              <X />
            </button>
          </div>

          <Item Icon={<Home />} href="/" label={t("sidebar.home")} />
          <Item Icon={<ShoppingBag />} href="/orders" label={t("sidebar.orders")} />
          <Item Icon={<HandCoins />} href="/transfers" label={t("sidebar.transfers")} />
          <Item Icon={<Users />} href="/users" label={t("sidebar.users")} />
          <Item Icon={<Settings />} href="/settings" label={t("sidebar.settings")} />
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
