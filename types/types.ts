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
  ItemLevel = 'itemLevel',
}

export type Filter = InFilters | RangeFilter;

type InFilters = {
  type: OptionType.Zone | OptionType.Quality;
  in: string[];
};

export type RangeFilter = {
  type: OptionType.ItemLevel;
  min: number;
  max: number;
};