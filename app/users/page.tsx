"use client";
import LoadingScreen from "@/components/common/loading-screen";
import UsersTable from "@/components/templates/users/users-table";
import { getUsersList } from "@/core/actions";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const page = () => {
  const { data, refetch, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () =>
      await getUsersList({
        params: {
          limit: 20,
          page: 0,
        },
      }),
  });

  if (isLoading) <LoadingScreen />;

  return (
    <main id="users-template"><UsersTable users={data?.data} refetch={refetch} /></main>
  );
};

export default page;
