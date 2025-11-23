"use client";
import { toast } from "sonner";
import { UserSession } from "../types/types";
import { create } from "zustand";
import { redirect } from "next/navigation";

// Types
type AuthStatus = "authenticated" | "loading" | "unauthenticated";

interface SessionStore {
  status: AuthStatus;
  session: UserSession | null;
  clearSession: () => void;
  updateSession: () => void;
}

interface ApiRequest {
  session: UserSession | null;
  status: AuthStatus;
}

// Functions

const requestFailed = (): ApiRequest => {
  const result = {
    status: "unauthenticated" as AuthStatus,
    session: null,
  };

  return result;
};

const authorizeSession = async (): Promise<ApiRequest> => {
  try {
    return fetch("/api/auth/session")
      .then((r) => r.json())
      .then((data) => {
        if (!data.ok) {
          return requestFailed();
        }
        return {
          session: data,
          status: "authenticated" as AuthStatus,
        };
      });
  } catch {
    return requestFailed();
  }
};

export const useSessionStore = create<SessionStore>((set) => ({
  session: null,
  status: "loading" as AuthStatus,
  clearSession: () =>
    set({
      session: null,
      status: "unauthenticated" as AuthStatus,
    }),

  updateSession: async () => {
    const { session, status } = await authorizeSession();
    console.log(session, status);
    set({
      status,
      session,
    });
  },
}));

if (typeof window !== "undefined") {
  useSessionStore.getState().updateSession();
}
