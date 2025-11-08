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
      SELECT 
        MIN((data->>'requiredLevel')::int) as min_required_level,
        MAX((data->>'requiredLevel')::int) as max_required_level
      FROM items
      WHERE data->>'requiredLevel' IS NOT NULL
    `;

    const minRequiredLevel = result?.min_required_level ? parseInt(result.min_required_level, 10) : 0;
    const maxRequiredLevel = result?.max_required_level ? parseInt(result.max_required_level, 10) : 0;

    return NextResponse.json({ min: minRequiredLevel, max: maxRequiredLevel });
  } catch (error) {
    console.error('Error fetching required level range:', error);
    return NextResponse.json({ error: 'Failed to fetch required level range' }, { status: 500 });
  }
}

