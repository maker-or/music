# SongID - Music Identification App

A Next.js application that allows users to identify songs by uploading audio files.

## Features

- Upload audio files (.mp3, .wav, .m4a) to identify songs
- View detailed song information including:
  - Track name
  - Artist
  - Album
  - Release date
  - Genre
  - Album artwork

## Technical Implementation

- Built with Next.js and TypeScript
- Responsive UI using Tailwind CSS and shadcn/ui components
- File validation and error handling
- Integration with Shazam API using raw audio data converted to base64

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file with your Shazam API key:
   ```
   NEXT_PUBLIC_SHAZAM_API_KEY=your-api-key
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## API Integration

The application uses the Shazam song detection API, which requires:

1. Audio data converted to raw format with specific characteristics:
   - Sample Rate: 44100 Hz
   - Channels: Mono (1 channel)
   - Bit Depth and Format: Signed 16-bit PCM in little endian byte order
2. The raw data converted to base64 string
3. Sending the base64 string in the request body as plain text

### Working with Raw Audio Files

#### Converting Audio to Raw Format Using Audacity

1. Download and install [Audacity](https://www.audacityteam.org/download/)
2. Open Audacity
3. To convert an existing audio file:
   - Select File > Import > Audio (NOT "Open")
   - Choose your audio file (.mp3, .wav, etc.)
4. Convert to mono if needed:
   - If the audio has multiple channels, select the audio track
   - Go to "Tracks" menu > "Mix" > "Mix Stereo to Mono"
5. Set the sample rate:
   - Go to "Tracks" menu > "Resample..." and set to 44100 Hz
6. Export as raw data:
   - Select File > Export > Export Audio
   - Choose "Other uncompressed files" from the format dropdown
   - Select "Header: RAW (header-less)" 
   - Encoding: "Signed 16-bit PCM"
   - Byte order: "Little-endian"
   - Save the file with a .raw extension

#### Testing with the Command Line Script

The application includes a command-line script for testing raw audio conversion and song identification:

```bash
# Install dependencies first
npm install

# Run the test script with any audio file (it will convert to the correct format)
node scripts/test-raw-audio.js path/to/your/audio.mp3
```

#### Using Raw Audio with the API

The application includes utility functions in `app/utils/audio-converter.ts` for working with raw audio files:

```typescript
// Convert an audio file to raw format with proper specifications
await convertAudioToRaw(inputFilePath, outputFilePath);

// Convert a raw audio file to base64 for API requests
rawToBase64(rawFilePath);

// Send a raw audio file to the Shazam API
await identifySongFromRawFile(rawFilePath);

// Process an audio file end-to-end (convert to raw, send to API)
await identifySongFromAudioFile(audioFilePath);
```

## Notes

When recording audio for song identification:
1. Use high-quality recordings with minimal background noise
2. Record at least 5-10 seconds of the song
3. Make sure the audio is in mono format (single channel)
4. For best results, record the chorus or most distinctive part of the song