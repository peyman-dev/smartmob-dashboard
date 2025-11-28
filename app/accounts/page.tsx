"use client"
import React, { Suspense } from "react";
import LoadingScreen from "@/components/common/loading-screen";
import AccountsPage from "./client-page";

const page = () => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      {<AccountsPage />}
    </Suspense>
  );
};

export default page;
