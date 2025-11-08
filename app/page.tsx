"use client";

import { useState, useEffect } from "react";
import { ItemFilters, type FilterState } from "@/components/item-filters";
import { ItemsTable } from "@/components/items-table";
import { Pagination } from "@/components/pagination";
import { Input } from "@/components/ui/input";
import { Search, Loader2, SettingsIcon } from "lucide-react";
import { useBrowseStore } from "./store";
import { Toggle } from "@/components/ui/toggle";
import { MultiSelect } from "@/components/ui/multi-select";
import { FilterSelect } from "@/components/filter-select";
import { ItemLevelFilter } from "@/components/item-level-filter";
import { RequiredLevelFilter } from "@/components/required-level-filter";
import { DPSFilter } from "@/components/dps-filter";
import { SpeedFilter } from "@/components/speed-filter";
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
  const needsSearch = useBrowseStore((state) => state.needsSearch);
  const forceSearch = useBrowseStore((state) => state.forceSearch);
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
      const filters = useBrowseStore.getState().filters;

      const allFilters = [...Object.values(filters)];

      const res = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page: currentPage,
          searchQuery: useBrowseStore.getState().searchQuery,
          advancedSearch: advSearch,
          filters: advSearch ? allFilters : []
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
    forceSearch();
  }, [searchQuery, advancedSearch]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    forceSearch();
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Worldforged Help</h1>
          <p className="text-muted-foreground">{
            `Browse worldforged items. ${advancedSearch ? 'Click the search mode button to return to simple english search.' : 'Click the search mode button to go to advanced filter search.'}`
          }</p>
        </div>

        <div className="mb-6">
          <div className="relative flex-row flex gap-2 w-full">
            <Toggle
              pressed={advancedSearch ?? false}
              onPressedChange={(checked) => setAdvancedSearch(checked)}
              variant="outline"
              className="h-10 px-4 gap-2 border-input bg-background shadow-xs data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:border-primary data-[state=off]:hover:bg-accent data-[state=off]:hover:text-accent-foreground transition-all"
            >
              <SettingsIcon className="h-4 w-4" />
              <span className="text-sm font-medium">
                {advancedSearch ? 'Advanced Search' : 'Basic Search'}
              </span>
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

        {/* Filters */}
        {advancedSearch && (
          <div className="mb-6 flex flex-row gap-4 flex-wrap">
            <FilterSelect type={OptionType.Zone} />
            <FilterSelect type={OptionType.Quality} />
            <FilterSelect type={OptionType.SlotType} />
            <FilterSelect type={OptionType.ItemType} />
            <FilterSelect type={OptionType.Slot} />
            <FilterSelect type={OptionType.PrimaryStats} />
            <FilterSelect type={OptionType.SecondaryStats} />
            <ItemLevelFilter />
            <RequiredLevelFilter />
            <DPSFilter />
            <SpeedFilter />
          </div>
        )}

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
