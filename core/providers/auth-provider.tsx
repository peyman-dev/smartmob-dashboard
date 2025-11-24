"use client";

import React, { ReactNode, useEffect } from "react";
import "@/core/utils/session";
import { redirect, usePathname } from "next/navigation";
import { toast } from "sonner";
import { useSessionStore } from "../stores/auth.store";
import LoadingScreen from "@/components/common/loading-screen";

const AuthenticationProvider = ({ children }: { children: ReactNode }) => {
  const { status } = useSessionStore();
  const path = usePathname();

  useEffect(() => {
    if (status === "unauthenticated" && path !== "/auth/login") {
      toast.warning("لطفا وارد حساب مدیریت خود بشوید", {
        position: "top-left",
        duration: 1500,
      });
    }
    if (path.startsWith("/auth/login") && status == "authenticated") {
      redirect("/");
    }
  }, [status, path]);

  return (
    <>
      {status == "loading" && <LoadingScreen />}
      {children}
    </>
  );
};

export default AuthenticationProvider;
