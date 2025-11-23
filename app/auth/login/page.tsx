
import LoginForm from "@/components/templates/auth/login/login-form";
import { localeImagePath } from "@/core/lib/helpers";
import clsx from "clsx";

const page = () => {
  return (
    <section className="grid  lg:grid-cols-2 gap-10 w-full mx-">
      <div
        className={clsx("h-dvh hidden! invisible lg:visible lg:block! w-full", "bg-cover bg-center")}
        style={{
          backgroundImage: `url(${localeImagePath("auth-cover.jpg")}`,
        }}
      ></div>
      <LoginForm />
    </section>
  );
};

export default page;
