import { describe, it, expect } from 'vitest';
import { pipeline } from "@xenova/transformers";

import { fetchItems } from '@/lib/db';
import { Filter, OptionType } from '@/types';

describe('fetchItems (server)', () => {
  it('returns items and pagination structure', async () => {
    const result = await fetchItems(1, 2, '');
    expect(result).toBeDefined();
    expect(Array.isArray(result.items)).toBe(true);
    expect(result.items.length).toBeGreaterThan(0);
    expect(typeof result.totalCount).toBe('number');
    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(2);
    expect(result.totalPages).toBeGreaterThanOrEqual(1);
  });

  it('accepts a search query without throwing', async () => {
    const result = await fetchItems(1, 1, 'Mul');
    expect(result.page).toBeGreaterThanOrEqual(1);
    expect(result.items.length).toBeGreaterThan(0);
  });

  it('supports embeddings search', async () => {
    const extractor = await pipeline("feature-extraction", "Supabase/gte-small");
    const output = await extractor('Windsong', { pooling: "mean", normalize: true });

    const result = await fetchItems(1, 1, '', Array.from(output.data) as number[]);
    expect(result.page).toBeGreaterThanOrEqual(1);
    expect(result.items.length).toBeGreaterThan(0);
    expect(result.items[0].name).toBe('Windsong Totem');
  });

  it('fetchDistinctOptions returns zones as expected', async () => {
    // We import fetchDistinctOptions directly to test its result for the "zone" type
    // Since the test environment may not support absolute imports, we use a dynamic import
    const { fetchDistinctOptions } = await import('@/lib/db');
    const zoneOptions = await fetchDistinctOptions(OptionType.Zone);

    expect(zoneOptions).toBeDefined();
    expect(Array.isArray(zoneOptions)).toBe(true);
    expect(zoneOptions.length).toBeGreaterThan(0);
  });

  it('filters items by secondary stat "mana"', async () => {
    // Filter on "mana" secondary stat
    const filters = [{
      type: OptionType.SecondaryStats,
      in: ['mana']
    } as Filter];
    const result = await fetchItems(1, 10, '', undefined, filters);

    expect(result.items.length).toBeGreaterThan(0);

    // All items should have a "mana" key in secondaryStats object
    for (const item of result.items) {
      expect(item.secondaryStats).toBeDefined();
      expect(Object.keys(item.secondaryStats!)).toContain('mana');
    }
  });
});
