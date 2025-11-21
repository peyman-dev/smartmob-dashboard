import { create } from "zustand";

interface IStoreProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isMenuOpen: boolean) => void;
  toggleMenu: () => void;
}

export const useSidebarStore = create<IStoreProps>((set, get) => ({
  isMenuOpen: false,
  setIsMenuOpen: (status) =>
    set({
      isMenuOpen: status,
    }),
  toggleMenu: () => {
    const currentStatus = get().isMenuOpen;
    set({
      isMenuOpen: !currentStatus,
    });
  },
}));
