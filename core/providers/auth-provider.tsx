"use client"
import React, { ReactNode, useEffect } from "react";
import "@/core/utils/session";
import { authorize } from "../actions";
import { redirect, usePathname } from "next/navigation";
import { toast } from "sonner";

const AuthenticationProvider = ({ children }: { children: ReactNode }) => {
  const path = usePathname()
  useEffect(() => {
    const getMe = async () => {
      fetch("/api/auth/session").then((r) => r.json()).then(data => {

        const callbackUrl = new URL("/auth/login")
        callbackUrl.searchParams.set("callbackUrl", path)
        

        if (!data.ok) {
          toast.info("لطفا وارد حساب کاربری خود بشوید")
          redirect(callbackUrl.toString())
        }
      })
    }
    getMe()
  }, [])
  return <>{children}</>;
};

export default AuthenticationProvider;
