"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { X } from "lucide-react"

export interface FilterState {
  slotType?: string
  slot?: string
  quality?: string
  requiredLevel?: { min: number; max: number }
  itemLevel?: { min: number; max: number }
  binding?: string
}

interface ItemFiltersProps {
  filters: FilterState
  onFilterChange: (filters: FilterState) => void
  availableFilters: {
    slotTypes: string[]
    slots: string[]
    qualities: string[]
    requiredLevels: number[]
    itemLevels: number[]
    bindings: string[]
  }
}

export function ItemFilters({ filters, onFilterChange, availableFilters }: ItemFiltersProps) {
  const updateFilter = (key: keyof FilterState, value: string | { min: number; max: number } | undefined) => {
    onFilterChange({ ...filters, [key]: value })
  }

  const clearFilter = (key: keyof FilterState) => {
    const newFilters = { ...filters }
    delete newFilters[key]
    onFilterChange(newFilters)
  }

  const clearAllFilters = () => {
    onFilterChange({})
  }

  const activeFilterCount = Object.keys(filters).length

  const minRequiredLevel = Math.min(...availableFilters.requiredLevels)
  const maxRequiredLevel = Math.max(...availableFilters.requiredLevels)
  const minItemLevel = Math.min(...availableFilters.itemLevels)
  const maxItemLevel = Math.max(...availableFilters.itemLevels)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Filters</h2>
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear all ({activeFilterCount})
          </Button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Slot Type Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Slot Type</label>
          <Select
            value={filters.slotType || "all"}
            onValueChange={(value) => updateFilter("slotType", value === "all" ? undefined : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All slot types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All slot types</SelectItem>
              {availableFilters.slotTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Slot Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Slot</label>
          <Select
            value={filters.slot || "all"}
            onValueChange={(value) => updateFilter("slot", value === "all" ? undefined : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All slots" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All slots</SelectItem>
              {availableFilters.slots.map((slot) => (
                <SelectItem key={slot} value={slot}>
                  {slot}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Quality Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Quality</label>
          <Select
            value={filters.quality || "all"}
            onValueChange={(value) => updateFilter("quality", value === "all" ? undefined : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All qualities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All qualities</SelectItem>
              {availableFilters.qualities.map((quality) => (
                <SelectItem key={quality} value={quality}>
                  {quality}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Required Level: {filters.requiredLevel?.min ?? minRequiredLevel} -{" "}
            {filters.requiredLevel?.max ?? maxRequiredLevel}
          </label>
          <div className="pt-2">
            <Slider
              min={minRequiredLevel}
              max={maxRequiredLevel}
              step={1}
              value={[filters.requiredLevel?.min ?? minRequiredLevel, filters.requiredLevel?.max ?? maxRequiredLevel]}
              onValueChange={([min, max]) => {
                if (min === minRequiredLevel && max === maxRequiredLevel) {
                  updateFilter("requiredLevel", undefined)
                } else {
                  updateFilter("requiredLevel", { min, max })
                }
              }}
              className="w-full"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Item Level: {filters.itemLevel?.min ?? minItemLevel} - {filters.itemLevel?.max ?? maxItemLevel}
          </label>
          <div className="pt-2">
            <Slider
              min={minItemLevel}
              max={maxItemLevel}
              step={1}
              value={[filters.itemLevel?.min ?? minItemLevel, filters.itemLevel?.max ?? maxItemLevel]}
              onValueChange={([min, max]) => {
                if (min === minItemLevel && max === maxItemLevel) {
                  updateFilter("itemLevel", undefined)
                } else {
                  updateFilter("itemLevel", { min, max })
                }
              }}
              className="w-full"
            />
          </div>
        </div>

        {/* Binding Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Binding</label>
          <Select
            value={filters.binding || "all"}
            onValueChange={(value) => updateFilter("binding", value === "all" ? undefined : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All bindings" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All bindings</SelectItem>
              {availableFilters.bindings.map((binding) => (
                <SelectItem key={binding} value={binding}>
                  {binding}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active Filters */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.slotType && (
            <Badge variant="secondary" className="gap-1">
              Slot Type: {filters.slotType}
              <button onClick={() => clearFilter("slotType")} className="ml-1 hover:text-foreground">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.slot && (
            <Badge variant="secondary" className="gap-1">
              Slot: {filters.slot}
              <button onClick={() => clearFilter("slot")} className="ml-1 hover:text-foreground">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.quality && (
            <Badge variant="secondary" className="gap-1">
              Quality: {filters.quality}
              <button onClick={() => clearFilter("quality")} className="ml-1 hover:text-foreground">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.requiredLevel && (
            <Badge variant="secondary" className="gap-1">
              Level: {filters.requiredLevel.min}-{filters.requiredLevel.max}
              <button onClick={() => clearFilter("requiredLevel")} className="ml-1 hover:text-foreground">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.itemLevel && (
            <Badge variant="secondary" className="gap-1">
              iLvl: {filters.itemLevel.min}-{filters.itemLevel.max}
              <button onClick={() => clearFilter("itemLevel")} className="ml-1 hover:text-foreground">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.binding && (
            <Badge variant="secondary" className="gap-1">
              Binding: {filters.binding}
              <button onClick={() => clearFilter("binding")} className="ml-1 hover:text-foreground">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
