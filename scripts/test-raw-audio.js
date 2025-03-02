#!/usr/bin/env node

/**
 * Test script for demonstrating how to use raw audio files with the Shazam API
 * 
 * Usage:
 * node test-raw-audio.js <path-to-audio-file>
 * 
 * The script will convert the audio file to proper raw format and send it to the Shazam API
 */

const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');

// Set the ffmpeg path
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

// Shazam API configuration
const SHAZAM_API_KEY = '6d397837cdmsh54a1be6c030b593p15d4a2jsn466652ad5426';
const SHAZAM_API_HOST = 'shazam.p.rapidapi.com';

// Check for command line arguments
if (process.argv.length < 3) {
  console.error('Please provide a path to an audio file');
  console.error('Usage: node test-raw-audio.js <path-to-audio-file>');
  process.exit(1);
}

// Get the file path from command line arguments
const audioFilePath = process.argv[2];

// Check if file exists
if (!fs.existsSync(audioFilePath)) {
  console.error(`File not found: ${audioFilePath}`);
  process.exit(1);
}

/**
 * Convert audio file to raw format with specific characteristics:
 * - Sample Rate: 44100 Hz
 * - Channels: Mono (1 channel)
 * - Bit Depth and Format: Signed 16-bit PCM in little endian byte order
 * 
 * @param {string} inputFilePath - Path to the input audio file
 * @param {string} [outputFilePath] - Path where the raw data will be saved
 * @returns {Promise<string>} - Path to the saved raw file
 */
function convertAudioToRaw(inputFilePath, outputFilePath) {
  return new Promise((resolve, reject) => {
    // If no output path is provided, create one based on the input path
    if (!outputFilePath) {
      const dir = path.dirname(inputFilePath);
      const basename = path.basename(inputFilePath, path.extname(inputFilePath));
      outputFilePath = path.join(dir, `${basename}.raw`);
    }
    
    console.log(`Converting ${inputFilePath} to raw audio...`);
    
    ffmpeg(inputFilePath)
      .noVideo()               // Ignore any video streams
      .audioChannels(1)        // Convert to mono (1 channel)
      .audioFrequency(44100)   // Set sample rate to 44100 Hz
      .format('s16le')         // Signed 16-bit PCM, little endian
      .on('error', (err) => {
        console.error('Error during audio conversion:', err);
        reject(err);
      })
      .on('end', () => {
        console.log(`Audio conversion complete: ${outputFilePath}`);
        resolve(outputFilePath);
      })
      .save(outputFilePath);
  });
}

/**
 * Convert raw audio data to base64 string
 * 
 * @param {string} rawFilePath - Path to the raw audio file
 * @returns {string} - Base64 encoded string
 */
function rawToBase64(rawFilePath) {
  const fileBuffer = fs.readFileSync(rawFilePath);
  return fileBuffer.toString('base64');
}

/**
 * Identify a song using the Shazam API
 * 
 * @param {string} base64Data - Base64 encoded audio data
 * @returns {Promise<object>} - API response
 */
async function identifySong(base64Data) {
  const url = 'https://shazam.p.rapidapi.com/songs/v2/detect?timezone=America%2FChicago&locale=en-US';
  const options = {
    method: 'POST',
    headers: {
      'x-rapidapi-key': SHAZAM_API_KEY,
      'x-rapidapi-host': SHAZAM_API_HOST,
      'Content-Type': 'text/plain'
    },
    body: base64Data
  };

  try {
    console.log('Sending request to Shazam API...');
    const response = await fetch(url, options);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error with Shazam API request:', error);
    throw error;
  }
}

/**
 * Format the song identification result
 * 
 * @param {object} result - API response
 * @returns {object} - Formatted result
 */
function formatResult(result) {
  if (!result || !result.matches || result.matches.length === 0) {
    return {
      identified: false,
      message: "No track was identified",
      rawResult: result
    };
  }
  
  const track = result.track || {};
  
  return {
    identified: true,
    song: {
      title: track.title || "Unknown Title",
      artist: track.subtitle || "Unknown Artist",
      album: track.sections?.find(s => s.type === 'SONG')?.metadata?.find(m => m.title === 'Album')?.text,
      releaseDate: track.releasedate || "Unknown",
      genre: track.genres?.primary || "Unknown"
    }
  };
}

/**
 * Clean up temporary files
 * 
 * @param {string} filePath - Path to file to delete
 */
function cleanupFile(filePath) {
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
      console.log(`Cleaned up temporary file: ${filePath}`);
    } catch (err) {
      console.error(`Error deleting file ${filePath}:`, err);
    }
  }
}

// Main execution
async function main() {
  let rawFilePath = null;
  
  try {
    console.log(`Processing audio file: ${audioFilePath}`);
    
    // Create a temporary raw file path
    const tempDir = path.dirname(audioFilePath);
    const tempRawPath = path.join(tempDir, `temp_${Date.now()}.raw`);
    
    // Convert audio to raw format with specific characteristics
    rawFilePath = await convertAudioToRaw(audioFilePath, tempRawPath);
    
    // Convert raw audio to base64
    const base64Data = rawToBase64(rawFilePath);
    console.log('File converted to base64, first 50 chars:', base64Data.substring(0, 50) + '...');
    
    // Send the base64 data to the Shazam API
    const result = await identifySong(base64Data);
    
    // Format and display the result
    const formattedResult = formatResult(result);
    console.log('\nResult:');
    console.log(JSON.stringify(formattedResult, null, 2));
    
    // Clean up
    cleanupFile(rawFilePath);
    
  } catch (error) {
    console.error('Error:', error.message);
    
    // Clean up even if there's an error
    if (rawFilePath) {
      cleanupFile(rawFilePath);
    }
    
    process.exit(1);
  }
}

main();
