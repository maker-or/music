"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Loader2, Music, Upload, CheckCircle, AlertCircle, Info } from 'lucide-react';
import Link from 'next/link';

export default function TestPage() {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError(null);
    setStatus("Uploading file...");
    
    try {
      // Create form data
      const formData = new FormData();
      formData.append('audio', file);
      
      console.log("Sending file:", file.name, "type:", file.type, "size:", file.size);
      setStatus("Sending file to server...");
      
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
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="h-6 w-6" />
            Test Audio Identification
          </CardTitle>
          <CardDescription>
            Upload an audio file to test the Shazam API integration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6 bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-500" />
            <AlertTitle>About Raw Audio Data</AlertTitle>
            <AlertDescription className="text-sm">
              This app uses the Shazam API which works best with raw audio data. For optimal results:
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Make sure your audio is mono (single channel)</li>
                <li>Use high-quality recordings with minimal background noise</li>
                <li>Record 5-10 seconds of the most distinctive part of the song</li>
                <li>See the README for instructions on creating raw audio files with Audacity</li>
              </ul>
            </AlertDescription>
          </Alert>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <input 
                type="file" 
                accept=".mp3,.wav,.m4a,audio/mpeg,audio/wav,audio/x-m4a" 
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                disabled={loading}
              />
              <label 
                htmlFor="file-upload" 
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
            
            {status && !error && !loading && (
              <Alert className="bg-primary/10 text-primary border-primary">
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Status</AlertTitle>
                <AlertDescription>{status}</AlertDescription>
              </Alert>
            )}
            
            {loading && (
              <Alert className="bg-primary/10 text-primary border-primary">
                <Loader2 className="h-4 w-4 animate-spin" />
                <AlertTitle>Processing</AlertTitle>
                <AlertDescription>{status}</AlertDescription>
              </Alert>
            )}
            
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <Button 
              type="submit" 
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
          </form>
          
          {result && (
            <div className="mt-6 p-4 bg-muted rounded-md">
              <h3 className="font-semibold mb-2">API Response:</h3>
              <pre className="text-xs overflow-auto max-h-96 p-4 bg-background rounded">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
          
          <div className="text-center mt-4">
            <Link href="/record" className="text-primary hover:underline text-sm">
              Try recording audio instead
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
