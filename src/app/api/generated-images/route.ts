import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const images = await db.generatedImage.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20 // Limit to last 20 images
    });

    return NextResponse.json({ images });
  } catch (error) {
    console.error('Error fetching generated images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch generated images' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { prompt, imageData, userId } = await request.json();

    if (!prompt || !imageData || !userId) {
      return NextResponse.json({ 
        error: 'Prompt, image data, and user ID are required' 
      }, { status: 400 });
    }

    const generatedImage = await db.generatedImage.create({
      data: {
        prompt,
        imageData,
        userId
      }
    });

    return NextResponse.json({ generatedImage });
  } catch (error) {
    console.error('Error saving generated image:', error);
    return NextResponse.json(
      { error: 'Failed to save generated image' },
      { status: 500 }
    );
  }
}