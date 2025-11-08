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
}

export type Filter = ZoneFilter;

type ZoneFilter = {
  type: OptionType.Zone;
  in: string[];
};