import { SongIdentifier } from '@/components/song-identifier';
import Link from 'next/link';
import AudioRecognition from '../components/AudioRecognition';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* <div className="container mx-auto px-4 py-12 max-w-4xl">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-2">SongID</h1>
          <p className="text-muted-foreground text-lg">
            Upload an audio clip to identify the song
          </p>
          <div className="mt-4 flex justify-center gap-4">
            <Link href="/test" className="text-primary hover:underline">
              Try Test Page
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link href="/record" className="text-primary hover:underline">
              Record Audio
            </Link>
          </div>
        </header>
        
        <SongIdentifier />
        
        <footer className="mt-16 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} SongID. All rights reserved.</p>
        </footer>
      </div> */}

<AudioRecognition />

    </main>
  );
}