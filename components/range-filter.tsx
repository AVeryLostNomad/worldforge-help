"use client";

import { useEffect, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { useBrowseStore } from "@/app/store";
import { OptionType } from "@/types";

interface RangeFilterProps {
  optionType: OptionType.RequiredLevel | OptionType.DPS | OptionType.Speed;
  apiEndpoint: string;
  label: string;
  step?: number;
  formatValue?: (value: number) => string;
}

export function RangeFilter({
  optionType,
  apiEndpoint,
  label,
  step = 1,
  formatValue = (v) => v.toString()
}: RangeFilterProps) {
  const [minRange, setMinRange] = useState<number>(0);
  const [maxRange, setMaxRange] = useState<number>(0);
  const [minValue, setMinValue] = useState<number>(0);
  const [maxValue, setMaxValue] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const filters = useBrowseStore((state) => state.filters);
  const setFilters = useBrowseStore((state) => state.setFilters);
  const forceSearch = useBrowseStore((state) => state.forceSearch);

  // Fetch range on mount
  useEffect(() => {
    const fetchRange = async () => {
      try {
        const res = await fetch(apiEndpoint);
        const data = await res.json();
        const min = data.min ?? 0;
        const max = data.max ?? 0;
        setMinRange(min);
        setMaxRange(max);
      } catch (error) {
        console.error(`Error fetching ${label} range:`, error);
      } finally {
        setLoading(false);
      }
    };
    fetchRange();
  }, [apiEndpoint, label]);

  // Initialize values from filters or defaults
  useEffect(() => {
    if (maxRange === 0 && minRange === 0) return; // Wait for range to be loaded

    const filter = filters[optionType];
    if (filter && filter.type === optionType && 'min' in filter && 'max' in filter) {
      setMinValue(filter.min);
      setMaxValue(filter.max);
    } else {
      setMinValue(minRange);
      setMaxValue(maxRange);
    }
  }, [filters, optionType, minRange, maxRange]);

  const handleValueChange = ([min, max]: number[]) => {
    setMinValue(min);
    setMaxValue(max);

    // If range is at default (minRange and maxRange), remove the filter
    if (min === minRange && max === maxRange) {
      setFilters((prev) => {
        const newFilters = { ...prev };
        delete newFilters[optionType];
        return newFilters;
      });
    } else {
      // Otherwise, set the filter
      setFilters((prev) => ({
        ...prev,
        [optionType]: {
          type: optionType,
          min,
          max,
        },
      }));
    }

    // Trigger fetch
    forceSearch();
  };

  if (loading || maxRange === 0) {
    return null;
  }

  return (
    <div className="space-y-2 min-w-[200px]">
      <label className="text-sm font-medium text-foreground">
        {label}: {formatValue(minValue)} - {formatValue(maxValue)}
      </label>
      <div className="pt-2">
        <Slider
          min={minRange}
          max={maxRange}
          step={step}
          value={[minValue, maxValue]}
          onValueChange={handleValueChange}
          className="w-full"
        />
      </div>
    </div>
  );
}

