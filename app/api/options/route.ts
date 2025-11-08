import { fetchDistinctOptions } from '@/lib/db';
import { OptionType } from '@/types';
import { NextResponse } from 'next/server';


export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const type = body.type ?? '';

    if (!type) {
      return NextResponse.json({ error: 'Type is required' }, { status: 400 });
    }

    if (!Object.values(OptionType).includes(type)) {
      return NextResponse.json({ error: 'Invalid option type' }, { status: 400 });
    }

    const options = await fetchDistinctOptions(type);
    return NextResponse.json(options);
  } catch (error) {
    console.error('Error fetching items:', error);
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 });
  }
}