'use server';

import { PaginatedResponse } from '@/types';
import { neon } from '@neondatabase/serverless';

export async function fetchItems(page = 1, pageSize = 50, searchQuery = '', embeddings: number[] | undefined = undefined): Promise<PaginatedResponse> {
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