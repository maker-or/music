import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import os from 'os';
//import { convertAudioToRaw, rawToBase64, identifySongFromAudioFile } from '@/app/utils/audio-converter';

// Shazam API configuration
const SHAZAM_API_KEY = '6d397837cdmsh54a1be6c030b593p15d4a2jsn466652ad5426';
const SHAZAM_API_HOST = 'shazam.p.rapidapi.com';

export const dynamic = 'force-dynamic';

// Helper function to save file to temp directory
// async function saveFileToDisk(file: File): Promise<string> {
//   const data = await file.arrayBuffer();
//   const buffer = Buffer.from(data);
//   const uint8Array = new Uint8Array(buffer);
//   const tempDir = os.tmpdir();
//   const filePath = path.join(tempDir, `audio_${Date.now()}.mp3`);
  
//   fs.writeFileSync(filePath, uint8Array);
//   return filePath;
// }

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
    
    console.log("Received file:", audioFile.name, "type:", audioFile.type, "size:", audioFile.size);
    
    // Save the file to disk with a timestamp to avoid name conflicts
    //const filePath = await saveFileToDisk(audioFile);
   // console.log("File saved to:", filePath);
    
    try {
      // Process the audio file and identify the song all in one step
      console.log("Converting audio and identifying song...");
      //const result = await identifySongFromAudioFile(filePath);
      
      console.log("Song identification result received");
      
      // Clean up the temporary file
      // try {
      //   fs.unlinkSync(filePath);
      // } catch (err) {
      //   console.error("Error deleting temporary file:", err);
      // }
      
      // Process the result to make it more user-friendly
     // const processedResult = processShazamResult(result);
      
      //return NextResponse.json(processedResult);
    } catch (error) {
      console.error('Error with Shazam API request:', error);
      return NextResponse.json(
        { error: 'Error with Shazam API request', details: error instanceof Error ? error.message : String(error) },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// Helper function to process the Shazam API result
function processShazamResult(result: any) {
  // Check if there's no match
  if (!result || !result.matches || result.matches.length === 0) {
    return {
      identified: false,
      message: "No track was identified",
      rawResult: result
    };
  }
  
  // Extract the track information from the v2 API response
  const track = result.track || {};
  
  return {
    identified: true,
    song: {
      title: track.title || "Unknown Title",
      artist: track.subtitle || "Unknown Artist",
      album: track.sections?.find((s: any) => s.type === 'SONG')?.metadata?.find((m: any) => m.title === 'Album')?.text,
      releaseDate: track.releasedate || "Unknown",
      genre: track.genres?.primary || "Unknown",
      albumArt: track.images?.coverarthq,
      lyrics: track.sections?.find((s: any) => s.type === 'LYRICS')?.text?.join('\n'),
    },
    rawResult: result
  };
}
