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
        MIN((data->'damage'->>'damagePerSecond')::numeric) as min_dps,
        MAX((data->'damage'->>'damagePerSecond')::numeric) as max_dps
      FROM items
      WHERE data->'damage'->>'damagePerSecond' IS NOT NULL
    `;

    const minDPS = result?.min_dps ? parseFloat(result.min_dps) : 0;
    const maxDPS = result?.max_dps ? parseFloat(result.max_dps) : 0;

    return NextResponse.json({ min: minDPS, max: maxDPS });
  } catch (error) {
    console.error('Error fetching DPS range:', error);
    return NextResponse.json({ error: 'Failed to fetch DPS range' }, { status: 500 });
  }
}

