// app/api/detect-song/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import fetch from 'node-fetch';
import FormData from 'form-data';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audioFile') as File;
    
    if (!audioFile) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
    }
    
    // Save the file temporarily
    const bytes = await audioFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Create a temporary file path
    const tempFilePath = join('/tmp', `${uuidv4()}-${audioFile.name}`);
    await writeFile(tempFilePath, new Uint8Array(bytes));
    
    // Prepare the form data for the Shazam API
    const data = new FormData();
    data.append('audioFile', fs.createReadStream(tempFilePath));
    
    // Make the request to Shazam API
    const url = 'https://shazam-api-audio-recognition-for-songs-music-metadata.p.rapidapi.com/detect_audio_by_post';
    const options = {
      method: 'POST',
      headers: {
        'x-rapidapi-key': process.env.RAPID_API_KEY || '6d397837cdmsh54a1be6c030b593p15d4a2jsn466652ad5426',
        'x-rapidapi-host': 'shazam-api-audio-recognition-for-songs-music-metadata.p.rapidapi.com',
        ...data.getHeaders(),
      },
      body: data,
    };
    
    const response = await fetch(url, options);
    const result = await response.json();
    
    // Clean up the temporary file
    fs.unlinkSync(tempFilePath);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error processing audio:', error);
    return NextResponse.json(
      { error: 'Failed to process audio file', details: String(error) },
      { status: 500 }
    );
  }
}