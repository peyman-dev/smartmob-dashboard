// hooks/useUserFinder.ts
"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { getUserById } from "@/core/actions";
import { UserFindEndpoints } from "@/core/types/types";
import { toast } from "sonner";

const useUserFinder = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname(); // اینو از Next.js بگیر، نه location!

  const [foundedUsers, setFoundedUsers] = useState<any[]>([]);
  const [isSearchingUser, setIsSearchingUser] = useState(false);

  const userId = searchParams.get("userId");

  // مپ کردن pathname به endpoint
  const getEndpointFromPath = (path: string): UserFindEndpoints | null => {
    if (path.startsWith("/users")) return "users";
    if (path.startsWith("/accounts")) return "accounts";
    if (path.startsWith("/transfers") || path.startsWith("/transcoin")) return "transfers";
    return null;
  };

  const setUserParams = useCallback(
    (userId: string | null) => {
      const params = new URLSearchParams(searchParams);
      if (userId) {
        params.set("userId", userId);
      } else {
        params.delete("userId");
      }
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [searchParams, router, pathname]
  );

  const clearAllParams = useCallback(() => {
    router.replace(pathname, { scroll: false });
    setIsSearchingUser(false);
    setFoundedUsers([]);
  }, [router, pathname]);

  const clearUserParams = useCallback(() => {
    setUserParams(null);
  }, [setUserParams]);

  const navigateToWithUser = useCallback(
    (url: string, userId?: string) => {
      const newUrl = userId ? `${url}?userId=${userId}` : url;
      router.push(newUrl);
    },
    [router]
  );

  // فقط وقتی userId هست و در صفحه مجاز هستیم، درخواست بزنیم
  useEffect(() => {
    if (!userId) {
      setIsSearchingUser(false);
      setFoundedUsers([]);
      return;
    }

    const endpoint = getEndpointFromPath(pathname);
    if (!endpoint) {
      setIsSearchingUser(false);
      return;
    }

    const fetchUser = async () => {
      setIsSearchingUser(true);
      const res = await getUserById(endpoint, userId);
      if (res.ok && res.data?.data) {
        setFoundedUsers(res.data?.data);
      } else {
        toast.warning("متاسفانه هیچ دیتایی یافت نشد !", {
            position: "top-right"
        })
        setFoundedUsers([]);
        setIsSearchingUser(false);
      }
    };

    fetchUser();
  }, [userId, pathname]);

  return {
    userId,
    isSearchingUser,
    foundedUsers,
    setUserParams,
    clearUserParams,
    clearAllParams,
    navigateToWithUser,
  };
};

export default useUserFinder;