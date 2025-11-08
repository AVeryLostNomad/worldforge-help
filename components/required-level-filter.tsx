"use client";

import { RangeFilter } from "./range-filter";
import { OptionType } from "@/types";

export function RequiredLevelFilter() {
  return (
    <RangeFilter
      optionType={OptionType.RequiredLevel}
      apiEndpoint="/api/required-level-range"
      label="Required Level"
    />
  );
}

