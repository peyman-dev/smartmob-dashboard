/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import DynamicAuthHeader from "../../templates/auth/common/dynamic-auth-header";
import AuthInput from "./auth-input";
import LoginFormActions from "./actions";
import LoginButton from "./login-button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/core/validations/auth-validation";
import WithError from "./with-error";
import { login } from "@/core/actions";
import { toast } from "sonner";
import { useSessionStore } from "@/core/stores/auth.store";
import { useTwoAuthentication } from "@/core/stores/two.authentication.store";
import { useTransition } from "react";
import { useTranslations } from "next-intl";

const LoginForm = () => {
  const t = useTranslations("auth.login");

  const { setIsOTPSent, setPassword, setUsername } = useTwoAuthentication();
  const { updateSession } = useSessionStore();
  const [isPending, startAsyncAction] = useTransition();

  const {
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
    startAsyncAction(
      async () =>
        await login({
          password: values.password,
          username: values.username,
        }).then(async (r) => {
          if (r.code == 1) {
            toast.error(t("invalid"), {
              position: "top-right",
              description: t("wrongUserPass"),
            });
          } else if (r.code == 4) {
            toast.error(t("pleaseWait"), {
              position: "top-right",
              description: t("otpSent"),
            });
            setIsOTPSent(true);
          } else {
            if (r.code == 201) {
              setUsername(values.username);
              setPassword(values.password);
              setIsOTPSent(true);

              toast.success(t("otpSentOk"), {
                position: "top-right",
              });
            }
          }
        })
    );
  };

  return (
    <form
      className="space-y-4 container md:w-[60%]! w-full h-dvh flex items-center justify-center flex-col"
      action={"#"}
      onSubmit={handleSubmit(submitted)}
    >
      <DynamicAuthHeader />
      <div className="w-full! min-w-full! **:w-full! space-y-2 my-10!">
        <WithError error={errors.username?.message}>
          <AuthInput
            placeholder={t("usernamePlaceholder")}
            dir="ltr"
            onChange={(e) => setValue("username", e.target.value)}
            className="placeholder:text-end!"
          />
        </WithError>

        <WithError error={errors.password?.message}>
          <AuthInput
            type="password"
            placeholder={t("passwordPlaceholder")}
            dir="ltr"
            className="placeholder:text-end!"
            onChange={(e) => setValue("password", e.target.value)}
          />
        </WithError>
      </div>
      {/* <LoginFormActions /> */}
      <LoginButton loading={isPending} />
    </form>
  );
};

export default LoginForm;
