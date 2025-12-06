import { create } from "zustand";

type SearchParams = {
  page?: number;
  limit?: number;
  mode?: 0 | 1 | 2;
  status?: 0 | 1 | 2 | 3 | 4;
  user?: string;
  serviceId?: string | number;
  target?: string;
  targetId?: string | number;
  dateStart?: number;
  dateEnd?: number;
};

interface SearchStore {
  isSearching: boolean;
  searchResult: any;
  isPendingSearch: boolean,
  search: (params?: SearchParams) => Promise<any>;
  setIsSearching: (value: boolean) => void;
  setSearchResult: (result: any) => void;
  clearSearch: () => void;
}

const buildQuery = (params?: SearchParams): string => {
  const query = new URLSearchParams();

  params?.page !== undefined && query.append("page", String(params.page));
  params?.limit !== undefined && query.append("limit", String(params.limit));
  params?.mode !== undefined && query.append("mode", String(params.mode));
  params?.status !== undefined && query.append("status", String(params.status));
  params?.user && query.append("user", params.user);
  params?.serviceId !== undefined && query.append("serviceId", String(params.serviceId));
  params?.target && query.append("target", params.target);
  params?.targetId !== undefined && query.append("targetId", String(params.targetId));
  params?.dateStart !== undefined && query.append("dateStart", String(params.dateStart));
  params?.dateEnd !== undefined && query.append("dateEnd", String(params.dateEnd));

  return query.toString();
};

export const useSearchStore = create<SearchStore>((set) => ({
  isSearching: false,
  searchResult: null,
  isPendingSearch: false,

  search: async (params?: SearchParams) => {
    set({ isSearching: true, searchResult: null });

    try {
      set({ isPendingSearch: true})
      const queryString = buildQuery(params);
      const res = await fetch(`/api/search/orders?${queryString}`);
      const data = await res.json();
      console.log(data)
      set({ searchResult: data });
      return data;
    } catch (error) {
      set({ searchResult: null });
      throw error;
    } finally {
      set({ isPendingSearch: false})
    }
  },

  setIsSearching: (value) => set({ isSearching: value }),
  setSearchResult: (result) => set({ searchResult: result }),
  clearSearch: () => set({ searchResult: null, isSearching: false }),
}));