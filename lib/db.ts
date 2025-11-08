'use server';

import { Filter, OptionType, PaginatedResponse } from '@/types';
import { neon } from '@neondatabase/serverless';

export async function fetchDistinctOptions(type: OptionType): Promise<{ label: string, value: string; }[]> {
  const connectionString = process.env.NEON_DATABASE_URL;
  if (!connectionString) {
    throw new Error('Missing NEON_DATABASE_URL (or DATABASE_URL) environment variable');
  }
  const sql = neon(connectionString);

  switch (type) {
    case OptionType.Zone:
      const zones = await sql`
        SELECT DISTINCT data->>'zone' as name
        FROM items
        ORDER BY name ASC
      `;
      return zones
        .map((zone) => zone.name)
        .filter((name): name is string => name !== undefined && !!name)
        .map((name) => ({
          label: name,
          value: name
        }));
    case OptionType.Quality:
      const qualities = await sql`
        SELECT DISTINCT data->>'quality' as name
        FROM items
        ORDER BY name ASC
      `;
      return qualities
        .map((quality) => quality.name)
        .filter((name): name is string => name !== undefined && !!name)
        .map((name) => ({
          label: name,
          value: name
        }));
    case OptionType.SlotType:
      const slotTypes = await sql`
        SELECT DISTINCT data->>'slotType' as name
        FROM items
        ORDER BY name ASC
      `;
      return slotTypes
        .map((slotType) => slotType.name)
        .filter((name): name is string => name !== undefined && !!name)
        .map((name) => ({
          label: name,
          value: name
        }));
    case OptionType.ItemType:
      const itemTypes = await sql`
        SELECT DISTINCT data->>'itemType' as name
        FROM items
        ORDER BY name ASC
      `;
      return itemTypes
        .map((itemType) => itemType.name)
        .filter((name): name is string => name !== undefined && !!name)
        .map((name) => ({
          label: name,
          value: name
        }));
    case OptionType.Slot:
      const slots = await sql`
        SELECT DISTINCT data->>'slot' as name
        FROM items
        ORDER BY name ASC
      `;
      return slots
        .map((slot) => slot.name)
        .filter((name): name is string => name !== undefined && !!name)
        .map((name) => ({
          label: name,
          value: name
        }));
    default:
      throw new Error(`Unsupported option type: ${type}`);
      return [];
  }
}

export async function fetchItems(page = 1,
  pageSize = 50,
  searchQuery = '',
  embeddings: number[] | undefined = undefined,
  filters: Filter[] = []
): Promise<PaginatedResponse> {
  const connectionString = process.env.NEON_DATABASE_URL;
  if (!connectionString) {
    throw new Error('Missing NEON_DATABASE_URL (or DATABASE_URL) environment variable');
  }
  const sql = neon(connectionString);
  const offset = (page - 1) * pageSize;

  const wheres = [];
  if (searchQuery) {
    wheres.push(`data->>'name' ILIKE '%${searchQuery}%'`);
  }

  if (filters && filters.length > 0) {
    filters.forEach((filter) => {
      if ('in' in filter && filter.in && filter.in.length > 0) {
        switch (filter.type) {
          case OptionType.Zone:
            wheres.push(`data->>'zone' IN ('${filter.in.join("','")}')`);
            break;
          case OptionType.Quality:
            wheres.push(`data->>'quality' IN ('${filter.in.join("','")}')`);
            break;
          case OptionType.SlotType:
            wheres.push(`data->>'slotType' IN ('${filter.in.join("','")}')`);
            break;
          case OptionType.ItemType:
            wheres.push(`data->>'itemType' IN ('${filter.in.join("','")}')`);
            break;
          case OptionType.Slot:
            wheres.push(`data->>'slot' IN ('${filter.in.join("','")}')`);
            break;
        }
      } else if ('min' in filter && 'max' in filter) {
        switch (filter.type) {
          case OptionType.ItemLevel:
            wheres.push(`(data->>'itemLevel')::int >= ${filter.min} AND (data->>'itemLevel')::int <= ${filter.max}`);
            break;
          case OptionType.RequiredLevel:
            wheres.push(`(data->>'requiredLevel')::int >= ${filter.min} AND (data->>'requiredLevel')::int <= ${filter.max}`);
            break;
          case OptionType.DPS:
            wheres.push(`(data->'damage'->'damagePerSecond')::numeric >= ${filter.min} AND (data->'damage'->'damagePerSecond')::numeric <= ${filter.max} AND data->'damage'->'damagePerSecond' IS NOT NULL`);
            break;
          case OptionType.Speed:
            wheres.push(`(data->'damage'->'speed')::numeric >= ${filter.min} AND (data->'damage'->'speed')::numeric <= ${filter.max} AND data->'damage'->'speed' IS NOT NULL`);
            break;
        }
      }
    });
  }

  const whereClause = wheres.length > 0 ? sql.unsafe(`WHERE ${wheres.join(' AND ')}`) : sql``;

  const embeddingSelect = embeddings ? sql.unsafe(`, embedding <-> '[${embeddings.join(',')}]' as distance`) : sql``;
  const embeddingOrder = embeddings ? sql`distance,` : sql``;

  const items = await sql`
    SELECT * ${embeddingSelect}
    FROM items
    ${whereClause}
    ORDER BY ${embeddingOrder} data->>'name' ASC, data->>'itemLevel' ASC
    LIMIT ${pageSize}
    OFFSET ${offset}
  `;

  const [{ count }] = await sql`
    SELECT COUNT(*) FROM items
    ${whereClause}
  `;

  const totalPages = Math.ceil(parseInt(count, 10) / pageSize);

  const toReturn = {
    items: items.map((item) => item.data),
    totalCount: parseInt(count, 10),
    page,
    pageSize,
    totalPages,
  };
  return toReturn;
}