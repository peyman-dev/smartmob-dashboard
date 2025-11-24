"use client";
import React, { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const appClient = new QueryClient({});

const ApplicationProvider = ({ children }: { children: ReactNode }) => {
  return <QueryClientProvider client={appClient}>{children}</QueryClientProvider>;
};

export default ApplicationProvider;
