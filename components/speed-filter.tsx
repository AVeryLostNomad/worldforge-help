"use client";

import { RangeFilter } from "./range-filter";
import { OptionType } from "@/types";

export function SpeedFilter() {
  return (
    <RangeFilter
      optionType={OptionType.Speed}
      apiEndpoint="/api/speed-range"
      label="Speed"
      step={0.1}
      formatValue={(v) => v.toFixed(1)}
    />
  );
}

