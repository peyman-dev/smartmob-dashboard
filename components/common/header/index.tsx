"use client";
import { useIsMobile } from "@/core/hooks/use-is-mobile";
import { useSidebarStore } from "@/core/stores/sidebar-store";
import { Menu } from "lucide-react";
import { motion } from "motion/react";
import React from "react";

const Header = () => {
  const isMobile = useIsMobile();
  const { isMenuOpen, setIsMenuOpen, toggleMenu } = useSidebarStore();

  if (isMobile) {
    return (
      <header>
        <button onClick={toggleMenu}>
          <Menu className="size-4" />
        </button>
      </header>
    );
  }
};

export default Header;
