import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const searchHistory = await db.searchHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 30 // Limit to last 30 searches
    });

    return NextResponse.json({ searchHistory });
  } catch (error) {
    console.error('Error fetching search history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch search history' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { query, results, userId } = await request.json();

    if (!query || !results || !userId) {
      return NextResponse.json({ 
        error: 'Query, results, and user ID are required' 
      }, { status: 400 });
    }

    const searchRecord = await db.searchHistory.create({
      data: {
        query,
        results: JSON.stringify(results), // Store results as JSON string
        userId
      }
    });

    return NextResponse.json({ searchRecord });
  } catch (error) {
    console.error('Error saving search history:', error);
    return NextResponse.json(
      { error: 'Failed to save search history' },
      { status: 500 }
    );
  }
}