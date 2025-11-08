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
        MIN((data->'damage'->>'speed')::numeric) as min_speed,
        MAX((data->'damage'->>'speed')::numeric) as max_speed
      FROM items
      WHERE data->'damage'->>'speed' IS NOT NULL
    `;

    const minSpeed = result?.min_speed ? parseFloat(result.min_speed) : 0;
    const maxSpeed = result?.max_speed ? parseFloat(result.max_speed) : 0;

    return NextResponse.json({ min: minSpeed, max: maxSpeed });
  } catch (error) {
    console.error('Error fetching speed range:', error);
    return NextResponse.json({ error: 'Failed to fetch speed range' }, { status: 500 });
  }
}

