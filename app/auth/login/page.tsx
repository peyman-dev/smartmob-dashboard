"use client";
import DynamicAuthHeader from "@/components/templates/auth/common/dynamic-auth-header";
import LoginFormActions from "@/components/templates/auth/login/actions";
import AuthInput from "@/components/templates/auth/login/auth-input";
import LoginButton from "@/components/templates/auth/login/login-button";
import { localeImagePath } from "@/core/lib/helpers";
import clsx from "clsx";
import React from "react";

const page = () => {
  return (
    <section className="grid grid-cols-2 gap-10 w-full mx-">
        <div className={clsx("h-dvh w-full", "bg-cover bg-center")} style={{
          backgroundImage: `url(${localeImagePath("auth-cover.jpg")}`
        }}></div>
      <form className="space-y-4 container md:w-[60%]!  w-full *:w-full! h-dvh flex items-center justify-center! *:max-h-max! flex-col" action={"#"}>
        <DynamicAuthHeader />
        <AuthInput
          placeholder="نام کاربری یا شماره موبایل"
          dir="ltr"
          className="placeholder:text-end!"
        />
        <AuthInput
          type="password"
          placeholder="لطفا گذرواژه خود را وارد نمائید"
          dir="ltr"
          className="placeholder:text-end!"
        />
        <LoginFormActions />
        <LoginButton onSubmit={() => {}} />
      </form>
    </section>
  );
};

export default page;
