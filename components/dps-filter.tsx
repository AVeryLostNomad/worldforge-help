"use client";

import { RangeFilter } from "./range-filter";
import { OptionType } from "@/types";

export function DPSFilter() {
  return (
    <RangeFilter
      optionType={OptionType.DPS}
      apiEndpoint="/api/dps-range"
      label="DPS"
      step={0.1}
      formatValue={(v) => v.toFixed(1)}
    />
  );
}

