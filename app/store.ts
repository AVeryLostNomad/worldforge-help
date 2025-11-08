import { Filter, Item, OptionType, RangeFilter } from '@/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

  needsSearch: number;
  forceSearch: () => void;

  filters: { [key in OptionType]?: Filter; };
  setFilters: (filters:
    ({ [key in OptionType]: Filter; })
    | ((prev: { [key in OptionType]?: Filter; }) => ({ [key in OptionType]?: Filter; }))) => void;
}

export const useBrowseStore = create<BrowseStore>()(
  persist(
    (set) => ({
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

      filters: {},
      setFilters: (filters) => set((state) => ({
        filters: typeof filters === 'function'
          ? filters(state.filters) :
          filters
      })),

      needsSearch: 0,
      forceSearch: () => set((state) => ({ needsSearch: state.needsSearch + 1 })),
    }),
    {
      name: 'browse-store',
      partialize: (state) => ({
        advancedSearch: state.advancedSearch,
        filters: state.filters,
      }),
    }
  )
);