import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary/config';

export async function POST(request: NextRequest) {
  try {
    const { publicIds } = await request.json();

    if (!publicIds || !Array.isArray(publicIds)) {
      return NextResponse.json(
        { success: false, error: 'Public IDs array is required' },
        { status: 400 }
      );
    }

    // Delete images from Cloudinary
    const result = await cloudinary.api.delete_resources(publicIds);

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('Error deleting multiple images:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
