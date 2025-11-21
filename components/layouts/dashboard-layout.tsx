import React, { ReactNode } from "react";
import Sidebar from "../common/sidebar";
import DynamicPageLabel from "../common/dynamic-page-label";
import Header from "../common/header";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main id="dashboard-template" className="flex">
      <Sidebar />
      <section
        id="content"
        className="bg-white *:p-5 md:p-10 space-y-5 md:space-y-10 shadow w-full min-h-dvh"
      >
        <Header />
        <DynamicPageLabel />
        <div>{children}</div>
      </section>
    </main>
  );
};

export default DashboardLayout;
