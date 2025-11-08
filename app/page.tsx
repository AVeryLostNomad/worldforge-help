"use client";

import { useState, useEffect } from "react";
import { ItemFilters, type FilterState } from "@/components/item-filters";
import { ItemsTable } from "@/components/items-table";
import { Pagination } from "@/components/pagination";
import { Input } from "@/components/ui/input";
import { Search, Loader2, SettingsIcon } from "lucide-react";
import { useBrowseStore } from "./store";
import { Toggle } from "@/components/ui/toggle";
import MultipleSelector from "@/components/ui/multiple-selector";
import { MultiSelect } from "@/components/ui/multi-select";
import { FilterSelect } from "@/components/filter-select";
import { OptionType } from "@/types";

export default function Home() {
  const searchQuery = useBrowseStore((state) => state.searchQuery);
  const setSearchQuery = useBrowseStore((state) => state.setSearchQuery);

  const currentPage = useBrowseStore((state) => state.currentPage);
  const setCurrentPage = useBrowseStore((state) => state.setCurrentPage);
  const items = useBrowseStore((state) => state.items);
  const setItems = useBrowseStore((state) => state.setItems);
  const totalCount = useBrowseStore((state) => state.totalCount);
  const setTotalCount = useBrowseStore((state) => state.setTotalCount);
  const totalPages = useBrowseStore((state) => state.totalPages);
  const setTotalPages = useBrowseStore((state) => state.setTotalPages);
  const loading = useBrowseStore((state) => state.loading);
  const setLoading = useBrowseStore((state) => state.setLoading);
  const [needsSearch, setNeedsSearch] = useState<number>(0);
  const advancedSearch = useBrowseStore((state) => state.advancedSearch);
  const setAdvancedSearch = useBrowseStore((state) => state.setAdvancedSearch);

  // Load filter options on mount
  // useEffect(() => {
  //   async function loadFilters() {
  //     const options = await getFilterOptions()
  //     setAvailableFilters(options)
  //   }
  //   loadFilters()
  // }, [])

  // Load items when page changes
  useEffect(() => {
    const searchDebounce = setTimeout(async () => {
      setLoading(true);

      const advSearch = useBrowseStore.getState().advancedSearch;

      const res = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page: currentPage,
          searchQuery: useBrowseStore.getState().searchQuery,
          advancedSearch: advSearch
        }),
      });
      const response = await res.json();
      setItems(response.items);
      setTotalCount(response.totalCount);
      setTotalPages(response.totalPages);
      setLoading(false);
    }, 150);

    return () => clearTimeout(searchDebounce);
  }, [needsSearch]);

  useEffect(() => {
    setNeedsSearch((prev) => prev + 1);
  }, [searchQuery]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setNeedsSearch((prev) => prev + 1);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Equipment Browser</h1>
          <p className="text-muted-foreground">Browse and filter equipment items from the Badlands zone</p>
        </div>

        <div className="mb-6">
          <div className="relative flex-row flex gap-2 w-full">
            <Toggle
              pressed={advancedSearch ?? false}
              onPressedChange={(checked) => setAdvancedSearch(checked)}
              className="data-[state=on]:bg-green-400 data-[state=off]:bg-green-100/50"
            >
              <SettingsIcon />
              {advancedSearch ? 'Advanced Search' : 'Basic Search'}
            </Toggle>
            <div className="relative grow">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder={advancedSearch ? "Filter items by name..." : "Search for items in plain english..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* Filters - Currently not functional with pagination */}
        <div className="mb-6 opacity-50 pointer-events-none">
          <FilterSelect type={OptionType.Zone} />
        </div>

        {/* Results Count */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading items...
              </span>
            ) : (
              <>
                Showing {(currentPage - 1) * 50 + 1}-{Math.min(currentPage * 50, totalCount)} of {totalCount} items
              </>
            )}
          </p>
          {totalPages > 1 && (
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          )}
        </div>

        {/* Items Table */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <ItemsTable items={items} />
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          </div>
        )}
      </div>
    </div>
  );
}
