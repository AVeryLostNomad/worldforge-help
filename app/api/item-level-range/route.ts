import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function GET() {
  try {
    const connectionString = process.env.NEON_DATABASE_URL;
    if (!connectionString) {
      throw new Error('Missing NEON_DATABASE_URL (or DATABASE_URL) environment variable');
    }
    const sql = neon(connectionString);

    const [result] = await sql`
      SELECT MAX((data->>'itemLevel')::int) as max_item_level
      FROM items
      WHERE data->>'itemLevel' IS NOT NULL
    `;

    const maxItemLevel = result?.max_item_level ? parseInt(result.max_item_level, 10) : 0;

    return NextResponse.json({ max: maxItemLevel });
  } catch (error) {
    console.error('Error fetching item level range:', error);
    return NextResponse.json({ error: 'Failed to fetch item level range' }, { status: 500 });
  }
}
