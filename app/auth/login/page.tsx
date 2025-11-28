"use client"
import LoginForm from "@/components/common/login/login-form";
import OTPForm from "@/components/common/login/otp-form";
import { locateImagePath } from "@/core/lib/helpers";
import setAuthorization from "@/core/lib/set-authorization";
import { useTwoAuthentication } from "@/core/stores/two.athentication.store";
import clsx from "clsx";

const page = () => {
  const {isOTPSent,setIsOTPSent} = useTwoAuthentication()
  return (
    <section className="grid  lg:grid-cols-2 gap-10 w-full mx-">
      <div
        className={clsx("h-dvh hidden! invisible lg:visible lg:block! w-full", "bg-cover bg-center")}
        style={{
          backgroundImage: `url(${locateImagePath("auth-cover.jpg")}`,
        }}
      ></div>
      {
        isOTPSent ? <OTPForm /> :
        <LoginForm handleCookies={setAuthorization}/>
      }
    </section>
  );
};

export default page;
