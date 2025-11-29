// stores/useUserSearchStore.ts
import { getUserById } from "@/core/actions";
import { User } from "@/core/types/types";
import { create } from "zustand";

type UserSearchParams = {
  page?: number;
  limit?: number;
  status?: 0 | 1; // 0 = free, 1 = blocked
  deviceId?: string;
  account?: string;
};

interface UserSearchStore {
  isSearching: boolean;
  searchResult: any;
  search: (params?: UserSearchParams) => Promise<any>;
  setIsSearching: (value: boolean) => void;
  setSearchResult: (result: any) => void;
  clearSearch: () => void;
  searchById: (userId: string) => Promise<any>;
}

const buildQuery = (params?: UserSearchParams): string => {
  const query = new URLSearchParams();

  params?.page !== undefined && query.append("page", String(params.page));
  params?.limit !== undefined && query.append("limit", String(params.limit));
  params?.status !== undefined && query.append("status", String(params.status));
  params?.deviceId && query.append("deviceId", params.deviceId.trim());
  params?.account && query.append("account", params.account.trim());

  return query.toString();
};

export const useUserSearchStore = create<UserSearchStore>((set) => ({
  isSearching: false,
  searchResult: null,

  search: async (params?: UserSearchParams) => {
    set({ isSearching: true, searchResult: null });

    try {
      const queryString = buildQuery(params);
      const res = await fetch(`/api/search/users?${queryString}`);
      const data = await res.json();

      set({ searchResult: data });
      return data;
    } catch (error) {
      set({ searchResult: null });
      throw error;
    } finally {
    }
  },

  setIsSearching: (value) => set({ isSearching: value }),
  setSearchResult: (result) => set({ searchResult: result }),
  clearSearch: () => set({ searchResult: null, isSearching: false }),
  async searchById(userId) {
    await searchUser(userId)
  },
}));

const searchUser = async (userId: string) => {
  try {
    // const res = await getUserById(userId);
  } catch (error) {}
};
