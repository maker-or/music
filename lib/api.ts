import { SongResult, ShazamResponse } from './types';

/**
 * Identifies a song from an audio file using the Shazam API
 * @param file The audio file to identify
 * @returns A promise that resolves to the song details or null if not found
 */
export async function identifySong(file: File): Promise<SongResult> {
  try {
    // Create form data to send the file
    const formData = new FormData();
    formData.append('audio', file, file.name);
    
    // Send the file to our API route
    const response = await fetch('/api/identify', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "We couldn't identify this song. Please try a different audio clip.");
    }
    
    const data = await response.json();
    
    // If no track was found
    if (!data.track) {
      throw new Error("We couldn't identify this song. Please try a different audio clip.");
    }
    
    return processSongData(data);
  } catch (error) {
    console.error('Error identifying song:', error);
    throw error;
  }
}

/**
 * Process the Shazam API response into our application's format
 */
function processSongData(response: ShazamResponse): SongResult {
  const { track } = response;
  
  // Extract metadata
  let genre = '';
  let releaseDate = '';
  let label = '';
  let lyrics = '';
  
  if (track.sections) {
    for (const section of track.sections) {
      if (section.type === 'SONG' && section.metadata) {
        for (const meta of section.metadata) {
          if (meta.title === 'Released') {
            releaseDate = meta.text;
          } else if (meta.title === 'Label') {
            label = meta.text;
          } else if (meta.title === 'Genre') {
            genre = meta.text;
          }
        }
      } else if (section.type === 'LYRICS' && section.text) {
        lyrics = section.text.join('\n');
      }
    }
  }
  
  // If no release date was found in metadata, use the releasedate field
  if (!releaseDate && track.releasedate) {
    releaseDate = track.releasedate;
  }
  
  // If no genre was found in metadata, use the genres field
  if (!genre && track.genres?.primary) {
    genre = track.genres.primary;
  }
  
  return {
    title: track.title,
    artist: track.subtitle,
    album: track.sections?.find(s => s.type === 'SONG')?.metadata?.find(m => m.title === 'Album')?.text,
    releaseDate: releaseDate || new Date().toISOString(),
    genre: genre,
    albumArt: track.images?.coverarthq,
    label: label,
    lyrics: lyrics,
    isrc: track.isrc,
  };
}