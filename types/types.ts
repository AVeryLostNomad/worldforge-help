export interface Item {
  id: number;
  name: string;
  coords: number[];
  slotType: string;
  slot: string;
  quality: string;
  requiredLevel: number;
  itemLevel: number;
  binding: string;
  zone: string;
  damage?: {
    min: number;
    max: number;
    damageType: string;
    speed: number;
    damagePerSecond: number;
  };
  primaryStats?: Record<string, number>;
  secondaryStats?: Record<string, string | number>;
  classRestrictions?: string[];
  descriptions?: Array<{
    name?: string;
    cooldown?: string;
    description?: string;
  }>;
}

export interface PaginatedResponse {
  items: Item[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export enum OptionType {
  Zone = 'zone',
  Quality = 'quality',
  SlotType = 'slotType',
  ItemType = 'itemType',
  Slot = 'slot',
  PrimaryStats = 'primaryStats',
  ItemLevel = 'itemLevel',
  RequiredLevel = 'requiredLevel',
  DPS = 'dps',
  Speed = 'speed',
}

export type Filter = InFilters | RangeFilter;

type InFilters = {
  type: OptionType.Zone | OptionType.Quality | OptionType.SlotType | OptionType.ItemType | OptionType.Slot | OptionType.PrimaryStats;
  in: string[];
};

export type RangeFilter = {
  type: OptionType.ItemLevel | OptionType.RequiredLevel | OptionType.DPS | OptionType.Speed;
  min: number;
  max: number;
};