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
- Integration with Shazam API (simulated for demo purposes)

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

In a production environment, you would need to:

1. Sign up for a RapidAPI account
2. Subscribe to the Shazam API
3. Use your API key in the `.env.local` file
4. Implement proper server-side API routes to protect your API key

## Notes

This demo uses simulated API responses for demonstration purposes. In a production application, you would implement actual API calls to the Shazam service.