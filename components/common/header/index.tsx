"use client";
import { useIsMobile } from "@/core/hooks/use-is-mobile";
import { useSidebarStore } from "@/core/stores/sidebar.store";
import { Menu } from "lucide-react";
import { motion } from "motion/react";
import React from "react";
import UserProfile from "./user-profile";
import DynamicPageLabel from "../dynamic-page-label";
import { LanguageSelector } from "./language-selector";

const Header = () => {
  const isMobile = useIsMobile();
  const { toggleMenu } = useSidebarStore();

  return (
    <header className="flex items-center justify-between px-10">
      <div className="flex items-center gap-4">
        {isMobile && (
          <button onClick={toggleMenu}>
            <Menu className="size-4" />
          </button>
        )}
        <DynamicPageLabel />
      </div>
<div className="flex items-center gap-3">
        <LanguageSelector />
      <UserProfile />
</div>
    </header>
  );
};

export default Header;
