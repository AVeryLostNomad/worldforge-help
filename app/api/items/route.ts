import { NextResponse } from 'next/server';
import { fetchItems } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const page = Number.parseInt(String(body.page ?? '1'), 10) || 1;
    const pageSize = 50;
    const searchQuery = String(body.searchQuery ?? '');
    const embeddings = body.embeddings ? body.embeddings : undefined;

    const data = await fetchItems(page, pageSize, searchQuery, embeddings);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching items:', error);
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 });
  }
}

