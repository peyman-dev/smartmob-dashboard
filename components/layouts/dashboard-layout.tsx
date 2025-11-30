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
          className="bg-white p-5  space-y-0 md:space-y-5  shadow w-full min-h-dvh"
        >
          <div className="container">
            <Header />
            <div>{children}</div>
          </div>
        </section>
      </main>
    );
};

export default DashboardLayout;
