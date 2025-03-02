// import fs from 'fs';
// import path from 'path';
// import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
// import ffmpeg from 'fluent-ffmpeg';
// import { promisify } from 'util';

// // Set the ffmpeg path
// ffmpeg.setFfmpegPath(ffmpegInstaller.path);

// // Promisify fs functions
// const fsUnlink = promisify(fs.unlink);
// const fsAccess = promisify(fs.access);

// /**
//  * Utility functions for audio file processing
//  * 
//  * Note: These functions are for demonstration purposes to show how to work with raw audio data.
//  * For production use, consider using more robust audio processing libraries.
//  */

// /**
//  * Check if a file exists
//  * 
//  * @param filePath Path to check
//  * @returns Boolean indicating if file exists
//  */
// async function fileExists(filePath: string): Promise<boolean> {
//   try {
//     await fsAccess(filePath, fs.constants.F_OK);
//     return true;
//   } catch {
//     return false;
//   }
// }

// /**
//  * Converts an audio file to raw data with specific characteristics:
//  * - Sample Rate: 44100 Hz
//  * - Channels: Mono (1 channel)
//  * - Bit Depth and Format: Signed 16-bit PCM in little endian byte order
//  * 
//  * @param inputFilePath Path to the input audio file
//  * @param outputFilePath Path where the raw data will be saved
//  * @returns Promise resolving to the path of the saved raw data file
//  */
// export function convertAudioToRaw(inputFilePath: string, outputFilePath?: string): Promise<string> {
//   return new Promise((resolve, reject) => {
//     // If no output path is provided, create one based on the input path
//     if (!outputFilePath) {
//       const dir = path.dirname(inputFilePath);
//       const basename = path.basename(inputFilePath, path.extname(inputFilePath));
//       outputFilePath = path.join(dir, `${basename}.raw`);
//     }
    
//     console.log(`Converting ${inputFilePath} to raw audio...`);
    
//     ffmpeg(inputFilePath)
//       .noVideo()               // Ignore any video streams
//       .audioChannels(1)        // Convert to mono (1 channel)
//       .audioFrequency(44100)   // Set sample rate to 44100 Hz
//       .format('s16le')         // Signed 16-bit PCM, little endian
//       .on('error', (err) => {
//         console.error('Error during audio conversion:', err);
//         reject(err);
//       })
//       .on('end', () => {
//         console.log(`Audio conversion complete: ${outputFilePath}`);
//         resolve(outputFilePath);
//       })
//       .save(outputFilePath);
//   });
// }

// /**
//  * Converts raw audio data to base64 string for API requests
//  * 
//  * @param rawFilePath Path to the raw audio file
//  * @returns Base64 encoded string of the raw audio data
//  */
// export function rawToBase64(rawFilePath: string): string {
//   const fileBuffer = fs.readFileSync(rawFilePath);
//   return fileBuffer.toString('base64');
// }

// /**
//  * Reads raw audio data from a file and sends it to the Shazam API
//  * 
//  * @param rawFilePath Path to the raw audio file
//  * @returns Promise resolving to the API response
//  */
// export async function identifySongFromRawFile(rawFilePath: string): Promise<any> {
//   // Convert the raw file to base64
//   const base64Data = rawToBase64(rawFilePath);
//   console.log('File converted to base64', base64Data);
  
//   // Import node-fetch
//   const nodeFetch = await import('node-fetch').then(mod => mod.default);
  
//   // Create the options for the API request
//   const url = 'https://shazam.p.rapidapi.com/songs/v2/detect?timezone=America%2FChicago&locale=en-US';
//   const options = {
//     method: 'POST',
//     headers: {
//       'x-rapidapi-key': '6d397837cdmsh54a1be6c030b593p15d4a2jsn466652ad5426',
//       'x-rapidapi-host': 'shazam.p.rapidapi.com',
//       'Content-Type': 'text/plain'
//     },
//     body: base64Data
//   };
  
//   // Send the request
//   const response = await nodeFetch(url, options);
  
//   if (!response.ok) {
//     throw new Error(`API request failed with status ${response.status}`);
//   }
  
//   return await response.json();
// }

// /**
//  * Complete function that processes an audio file and identifies the song
//  * - Converts the audio to the required raw format
//  * - Sends it to the Shazam API
//  * - Returns the identification result
//  * 
//  * @param audioFilePath Path to the audio file (mp3, wav, etc.)
//  * @returns Promise resolving to the identification result
//  */
// export async function identifySongFromAudioFile(audioFilePath: string): Promise<any> {
//   try {
//     // Create temporary file path for raw audio
//     const tempDir = path.dirname(audioFilePath);
//     const tempRawPath = path.join(tempDir, `temp_${Date.now()}.raw`);
    
//     // Convert audio to raw format
//     const rawFilePath = await convertAudioToRaw(audioFilePath, tempRawPath);
    
//     try {
//       // Identify the song
//       const result = await identifySongFromRawFile(rawFilePath);
      
//       // Clean up temporary file
//       if (await fileExists(rawFilePath)) {
//         await fsUnlink(rawFilePath);
//       }
      
//       return result;
//     } catch (error) {
//       // Clean up temporary file even if there's an error
//       if (await fileExists(rawFilePath)) {
//         await fsUnlink(rawFilePath);
//       }
//       throw error;
//     }
//   } catch (error) {
//     console.error('Error identifying song from audio file:', error);
//     throw error;
//   }
// }
