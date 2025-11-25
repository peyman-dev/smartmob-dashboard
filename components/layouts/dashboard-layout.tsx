"use client";
import React, { ReactNode } from "react";
import Sidebar from "../common/sidebar";
import DynamicPageLabel from "../common/dynamic-page-label";
import Header from "../common/header";
import { usePathname } from "next/navigation";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const path = usePathname();

  const isAuthRoute = path.includes("auth");

  if (isAuthRoute) return children;
  else
    return (
      <main id="dashboard-template" className="flex">
        <Sidebar />
        <section
          id="content"
          className="bg-white *:p-10  space-y-5  shadow w-full min-h-dvh"
        >
          <Header />
          <div>{children}</div>
        </section>
      </main>
    );
};

export default DashboardLayout;
