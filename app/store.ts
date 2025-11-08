import { Item } from '@/types';
import { create } from 'zustand';

interface BrowseStore {
  loading: boolean;
  setLoading: (loading: boolean) => void;

  searchQuery: string;
  setSearchQuery: (searchQuery: string) => void;

  currentPage: number;
  setCurrentPage: (currentPage: number) => void;

  items: Item[];
  setItems: (items: Item[]) => void;

  advancedSearch?: boolean;
  setAdvancedSearch: (advancedSearch: boolean) => void;

  totalCount: number;
  setTotalCount: (totalCount: number) => void;
  totalPages: number;
  setTotalPages: (totalPages: number) => void;
}

export const useBrowseStore = create<BrowseStore>((set) => ({
  searchQuery: '',
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  currentPage: 1,
  setCurrentPage: (currentPage) => set({ currentPage }),
  items: [],
  setItems: (items) => set({ items }),
  totalCount: 0,
  setTotalCount: (totalCount) => set({ totalCount }),
  totalPages: 0,
  setTotalPages: (totalPages) => set({ totalPages }),
  loading: false,
  setLoading: (loading) => set({ loading }),
  advancedSearch: false,
  setAdvancedSearch: (advancedSearch) => set({ advancedSearch }),
}));