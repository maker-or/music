"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Music, Upload, AlertCircle } from 'lucide-react';
import Image from 'next/image';

export function SongIdentifier() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
      setResult(null);
      setStatus(null);
    }
  };

  const identifySong = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setStatus("Uploading file...");
    
    try {
      // Create form data
      const formData = new FormData();
      formData.append('audio', file);
      
      setStatus("Sending to server...");
      
      // Send request to our API
      const response = await fetch('/api/identify', {
        method: 'POST',
        body: formData,
      });
      
      setStatus("Processing response...");
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to identify song');
      }
      
      const data = await response.json();
      setResult(data);
      setStatus("Song identification complete!");
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error:', err);
      setStatus("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="border-2 border-dashed rounded-lg p-6 text-center">
            <input 
              type="file" 
              accept=".mp3,.wav,.m4a,audio/mpeg,audio/wav,audio/x-m4a" 
              onChange={handleFileChange}
              className="hidden"
              id="file-upload-main"
              disabled={loading}
            />
            <label 
              htmlFor="file-upload-main" 
              className="cursor-pointer flex flex-col items-center justify-center"
            >
              <div className="mb-3 p-3 rounded-full bg-primary/10">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <p className="text-sm font-medium mb-1">
                {file ? file.name : "Click to upload an audio file"}
              </p>
              <p className="text-xs text-muted-foreground">
                MP3, WAV, or M4A (max 10MB)
              </p>
              {file && (
                <p className="mt-2 text-xs text-muted-foreground">
                  {file.type || 'unknown type'}, {Math.round(file.size / 1024)} KB
                </p>
              )}
            </label>
          </div>
          
          {status && (
            <div className="text-sm text-center text-muted-foreground">
              {status}
            </div>
          )}
          
          {error && (
            <div className="p-4 bg-destructive/10 text-destructive rounded-md flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}
          
          <Button 
            onClick={identifySong}
            disabled={!file || loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Identifying...
              </>
            ) : (
              <>
                <Music className="mr-2 h-4 w-4" />
                Identify Song
              </>
            )}
          </Button>
          
          {result && result.identified && (
            <div className="mt-6 p-4 bg-muted rounded-md">
              <div className="flex flex-col md:flex-row gap-6">
                {result.song.albumArt && (
                  <div className="flex-shrink-0">
                    <div className="relative w-32 h-32 md:w-40 md:h-40 overflow-hidden rounded-md shadow-md">
                      <Image 
                        src={result.song.albumArt} 
                        alt={`${result.song.title} album art`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                )}
                
                <div className="flex-grow">
                  <h2 className="text-2xl font-bold">{result.song.title}</h2>
                  <p className="text-lg text-muted-foreground mb-2">{result.song.artist}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm mt-4">
                    {result.song.album && (
                      <div>
                        <span className="font-medium">Album:</span> {result.song.album}
                      </div>
                    )}
                    
                    {result.song.releaseDate && result.song.releaseDate !== "Unknown" && (
                      <div>
                        <span className="font-medium">Released:</span> {result.song.releaseDate}
                      </div>
                    )}
                    
                    {result.song.genre && result.song.genre !== "Unknown" && (
                      <div>
                        <span className="font-medium">Genre:</span> {result.song.genre}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {result.song.lyrics && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-2">Lyrics</h3>
                  <div className="p-4 bg-background rounded-md max-h-60 overflow-y-auto whitespace-pre-line text-sm">
                    {result.song.lyrics}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {result && !result.identified && (
            <div className="mt-6 p-4 bg-muted rounded-md">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-5 w-5 text-amber-500" />
                <h3 className="font-semibold">No song identified</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                The audio clip couldn't be matched to any song. Try with a different clip or ensure the audio is clear and contains music.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}