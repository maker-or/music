import { NextRequest, NextResponse } from 'next/server';

// Shazam API configuration
const SHAZAM_API_KEY = process.env.NEXT_PUBLIC_SHAZAM_API_KEY;
const SHAZAM_API_HOST = 'shazam.p.rapidapi.com';


export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;
    
    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }
    
    // Convert the file to base64
    const buffer = await audioFile.arrayBuffer();
    const base64Audio = Buffer.from(buffer).toString('base64');
    
    // Make request to Shazam API
    const response = await fetch('https://shazam.p.rapidapi.com/songs/detect', {
      method: 'POST',
      headers: {
        'content-type': 'text/plain',
        'X-RapidAPI-Key': SHAZAM_API_KEY || '',
        'X-RapidAPI-Host': SHAZAM_API_HOST,
      },
      body: base64Audio,
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Shazam API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to identify song', details: errorData },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}