"use client";

import { toast } from "sonner";
import { UserSession } from "../types/types";
import { create } from "zustand";
import Cookies from "js-cookie";

type AuthStatus = "authenticated" | "loading" | "unauthenticated";

interface SessionStore {
  status: AuthStatus;
  session: UserSession | null;
  clearSession: () => void;
  updateSession: () => Promise<void>;
}

interface ApiRequest {
  session: UserSession | null;
  status: AuthStatus;
}

const requestFailed = (): ApiRequest => ({
  status: "unauthenticated",
  session: null,
});

const authorizeSession = async (): Promise<ApiRequest> => {
  try {
    const res = await fetch("/api/auth/session", {});
    const data = await res.json();

    if (!data?.ok) {
      toast.warning("لطفا وارد حساب مدیریت خود بشوید", {
        position: "top-left",
        duration: 1500,
      });
      return requestFailed();
    }

    return {
      session: data.payload as UserSession,
      status: "authenticated",
    };
  } catch {
    return requestFailed();
  }
};

export const useSessionStore = create<SessionStore>((set) => ({
  session: null,
  status: "loading" as AuthStatus,

  clearSession: async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
    });
    set({
      session: null,
      status: "unauthenticated" as AuthStatus,
    }),
      window.location.reload();
  },

  updateSession: async () => {
    set({ status: "loading" as AuthStatus });
    const result = await authorizeSession();
    set({
      session: result.session,
      status: result.status,
    });
  },
}));

if (typeof window !== "undefined") {
  useSessionStore.getState().updateSession();
}
