import { NextResponse } from 'next/server';
import { fetchItems } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const page = Number.parseInt(String(body.page ?? '1'), 10) || 1;
    const pageSize = 50;
    const searchQuery = String(body.searchQuery ?? '');
    const advancedSearch = body.advancedSearch ?? false;

    if (advancedSearch) {
      // Search based on name filter and other filters
      const data = await fetchItems(page, pageSize, searchQuery);
      return NextResponse.json(data);
    }

    let embeddings: number[] | undefined = undefined;
    if (searchQuery && searchQuery.trim().length > 0) {
      const { pipeline } = await import('@xenova/transformers');
      const pipe = await pipeline('feature-extraction', 'Supabase/gte-small');
      const embedding = await pipe(searchQuery, { pooling: 'mean', normalize: true });
      embeddings = Array.from(embedding.data);
    }

    const data = await fetchItems(page, pageSize, '', embeddings);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching items:', error);
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 });
  }
}

