import { PaginatedResponse } from '@/types';
import { neon } from '@neondatabase/serverless';

/**
 * Dummy async function to fetch paginated items from PostgreSQL
 *
 * TODO: Replace with actual PostgreSQL connection using:
 * - @neondatabase/serverless for Neon
 * - @supabase/supabase-js for Supabase
 * - pg for standard PostgreSQL
 */
export async function fetchItems(page = 1, pageSize = 50, searchQuery = ''): Promise<PaginatedResponse> {
  const sql = neon('postgresql://anonymous@ep-quiet-voice-a4ykcsol-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require');
  const offset = (page - 1) * pageSize;

  const wheres = [];
  if (searchQuery) {
    wheres.push(`LOWER(data->>'name') LIKE LOWER('%${searchQuery}%')`);
  }

  const whereClause = wheres.length > 0 ? `WHERE ${wheres.join(' AND ')}` : '';

  const items = await sql`
    SELECT * FROM items
    ${whereClause}
    ORDER BY data->>'name'
    LIMIT ${pageSize}
    OFFSET ${offset}
  `;

  const [{ count }] = await sql`
    SELECT COUNT(*) FROM items
    ${whereClause}
  `;

  const totalPages = Math.ceil(count / pageSize);

  return {
    items: items.map((item) => item.data),
    totalCount: count,
    page,
    pageSize,
    totalPages,
  };
}