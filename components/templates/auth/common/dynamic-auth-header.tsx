"use client";
import { useTwoAuthentication } from "@/core/stores/two.athentication.store";
import React from "react";

const DynamicAuthHeader = () => {
  const { isOTPSent } = useTwoAuthentication();
  return (
    <div className="text-center">
      <h1 className="font-extrabold text-2xl">
          به پنل مدیریت خوش آمدید
        </h1>
      <p className="text-[#718096] text-sm mt-2">
          "سفارشات و اپلیکیشن خود ر ا مدیریت کنید"
      </p>
    </div>
  );
};

export default DynamicAuthHeader;
