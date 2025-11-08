"use client";

import { useEffect, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { useBrowseStore } from "@/app/store";
import { OptionType } from "@/types";

export function ItemLevelFilter() {
  const [maxItemLevel, setMaxItemLevel] = useState<number>(0);
  const [minValue, setMinValue] = useState<number>(0);
  const [maxValue, setMaxValue] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const filters = useBrowseStore((state) => state.filters);
  const setFilters = useBrowseStore((state) => state.setFilters);
  const forceSearch = useBrowseStore((state) => state.forceSearch);

  // Fetch max item level on mount
  useEffect(() => {
    const fetchMaxItemLevel = async () => {
      try {
        const res = await fetch('/api/item-level-range');
        const data = await res.json();
        const max = data.max ?? 0;
        setMaxItemLevel(max);
      } catch (error) {
        console.error('Error fetching max item level:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMaxItemLevel();
  }, []);

  // Initialize values from filters or defaults
  useEffect(() => {
    if (maxItemLevel === 0) return; // Wait for maxItemLevel to be loaded

    const itemLevelFilter = filters[OptionType.ItemLevel];
    if (itemLevelFilter && itemLevelFilter.type === OptionType.ItemLevel) {
      setMinValue(itemLevelFilter.min);
      setMaxValue(itemLevelFilter.max);
    } else {
      setMinValue(0);
      setMaxValue(maxItemLevel);
    }
  }, [filters, maxItemLevel]);

  const handleValueChange = ([min, max]: number[]) => {
    setMinValue(min);
    setMaxValue(max);

    // If range is at default (0 and max), remove the filter
    if (min === 0 && max === maxItemLevel) {
      setFilters((prev) => {
        const newFilters = { ...prev };
        delete newFilters[OptionType.ItemLevel];
        return newFilters;
      });
    } else {
      // Otherwise, set the filter
      setFilters((prev) => ({
        ...prev,
        [OptionType.ItemLevel]: {
          type: OptionType.ItemLevel,
          min,
          max,
        },
      }));
    }

    // Trigger fetch
    forceSearch();
  };

  if (loading || maxItemLevel === 0) {
    return null;
  }

  return (
    <div className="space-y-2 min-w-[200px]">
      <label className="text-sm font-medium text-foreground">
        Item Level: {minValue} - {maxValue}
      </label>
      <div className="pt-2">
        <Slider
          min={0}
          max={maxItemLevel}
          step={1}
          value={[minValue, maxValue]}
          onValueChange={handleValueChange}
          className="w-full"
        />
      </div>
    </div>
  );
}

