/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect } from "react";
import DynamicAuthHeader from "../common/dynamic-auth-header";
import AuthInput from "./auth-input";
import LoginFormActions from "./actions";
import LoginButton from "./login-button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/core/validations/auth-validation";
import WithError from "./with-error";
import { login } from "@/core/actions";
import { toast } from "sonner";

const LoginForm = () => {
  const {
    getValues,
    register,
    reset,
    formState: { errors },
    setValue,
    handleSubmit,
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    resolver: zodResolver(LoginSchema),
  });

  const submitted = async (values: any) => {
    const requestResolve = await login({
      password: values.password,
      username: values.username,
    });

    if (requestResolve.code == 1) {
        toast.error("نام کاربری شما نامعتبر است.", {
            className: "font-estedad!",
            closeButton: true
        })
    }
  };

  return (
    <form
      className="space-y-4 container md:w-[60%]!  w-full *:w-full! h-dvh flex items-center justify-center! *:max-h-max! flex-col"
      action={"#"}
      onSubmit={handleSubmit(submitted)}
    >
      <DynamicAuthHeader />
      <WithError error={errors.username?.message}>
        <AuthInput
          placeholder="نام کاربری یا شماره موبایل"
          dir="ltr"
          onChange={(e) => {
            setValue("username", e.target.value);
          }}
          className="placeholder:text-end!"
        />
      </WithError>
      <WithError error={errors.password?.message}>
        <AuthInput
          type="password"
          placeholder="لطفا گذرواژه خود را وارد نمائید"
          dir="ltr"
          className="placeholder:text-end!"
          onChange={(e) => {
            setValue("password", e.target.value);
          }}
        />
      </WithError>
      <LoginFormActions />
      <LoginButton onSubmit={() => {}} />
    </form>
  );
};

export default LoginForm;
