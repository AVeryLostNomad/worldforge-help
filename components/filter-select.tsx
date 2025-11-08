import { OptionType } from "@/types";
import { MultiSelect, MultiSelectOption } from "./ui/multi-select";
import { useEffect, useState } from "react";
import { useBrowseStore } from "@/app/store";

interface FilterSelectProps {
  type: OptionType;
}

export const FilterSelect = (props: FilterSelectProps) => {
  const [options, setOptions] = useState<MultiSelectOption[]>([]);
  const setFilters = useBrowseStore((state) => state.setFilters);
  const forceSearch = useBrowseStore((state) => state.forceSearch);

  useEffect(() => {
    const process = async () => {
      const res = await fetch('/api/options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: props.type
        }),
      });
      const response = await res.json();
      setOptions(response);
    };
    process();
  }, []);

  return (
    <MultiSelect
      searchable
      options={options}
      placeholder="Filter Zones"
      className="border-2 bg-secondary"
      autoSize
      onValueChange={function (value: string[]): void {
        switch (props.type) {
          case OptionType.Zone:
            setFilters((prev) => {
              const newFilters = { ...prev };
              if (value && value.length > 0) {
                newFilters[OptionType.Zone] = {
                  type: OptionType.Zone,
                  in: value
                };
              } else {
                delete newFilters[OptionType.Zone];
              }
              return newFilters;
            });
            break;
        }
        forceSearch();
      }}
    />
  );
};