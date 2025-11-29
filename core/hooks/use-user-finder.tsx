"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  getAdminUsers,
  getAdminAccounts,
  getAdminTransfers,
  getAdminOrders,
} from "@/core/actions";
import { toast } from "sonner";
import { Button } from "antd";
import { useTranslations } from "next-intl";

type Endpoint = "users" | "accounts" | "transfers" | "orders";

const useUserFinder = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [foundedUsers, setFoundedUsers] = useState<any[]>([]);
  const [isSearchingUser, setIsSearchingUser] = useState(false);

  const userId = searchParams.get("userId");

  const getEndpointFromPath = (path: string): Endpoint | null => {
    if (path.startsWith("/users")) return "users";
    if (path.startsWith("/orders")) return "orders";
    if (path.startsWith("/accounts")) return "accounts";
    if (path.startsWith("/transfers") || path.startsWith("/transcoin"))
      return "transfers";
    return null;
  };

  const setUserParams = useCallback(
    (id: string | null) => {
      const params = new URLSearchParams(searchParams);
      if (id) params.set("userId", id);
      else params.delete("userId");

      router.replace(params.toString() ? `${pathname}?${params.toString()}` : pathname, {
        scroll: false,
      });
    },
    [searchParams, router, pathname]
  );

  const clearAllParams = useCallback(() => {
    router.replace(pathname, { scroll: false });
    setIsSearchingUser(false);
    setFoundedUsers([]);
  }, [router, pathname]);

  const clearUserParams = useCallback(() => setUserParams(null), [setUserParams]);

  const navigateToWithUser = useCallback(
    (url: string, id?: string) => {
      router.push(id ? `${url}?userId=${id}` : url);
    },
    [router]
  );

  useEffect(() => {
    if (!userId) {
      setFoundedUsers([]);
      setIsSearchingUser(false);
      return;
    }

    const endpoint = getEndpointFromPath(pathname);
    if (!endpoint) {
      setFoundedUsers([]);
      setIsSearchingUser(false);
      return;
    }

    const fetchData = async () => {
      setIsSearchingUser(true);

      let result;
      switch (endpoint) {
        case "users":
          result = await getAdminUsers(userId);
          break;
        case "accounts":
          result = await getAdminAccounts(userId);
          break;
        case "transfers":
          result = await getAdminTransfers(userId);
          break;
        case "orders":
          result = await getAdminOrders(userId);
          break;
      }

      console.log(result)

      if (result?.ok && result.data?.data) {
        setFoundedUsers(result.data.data);
      } else {
        setFoundedUsers([]);
      }

    };

    fetchData();
  }, [userId, pathname]);

  const t = useTranslations("common");

  const StopSearchingButton = () =>
    isSearchingUser ? (
      <Button variant="filled" color="red" onClick={clearAllParams}>
        {t("clear")}
      </Button>
    ) : null;

  return {
    userId,
    isSearchingUser,
    foundedUsers,
    setUserParams,
    clearUserParams,
    StopSearchingButton,
    clearAllParams,
    navigateToWithUser,
    setIsSearchingUser,
  };
};

export default useUserFinder;