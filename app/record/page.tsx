"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mic, Square, Music, AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function RecordPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [status, setStatus] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  const startRecording = async () => {
    try {
      setError(null);
      setAudioBlob(null);
      setAudioUrl(null);
      setResult(null);
      setStatus(null);
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mpeg' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioBlob(audioBlob);
        setAudioUrl(audioUrl);
        
        // Stop all tracks in the stream
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start recording');
      console.error('Error starting recording:', err);
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };
  
  const identifySong = async () => {
    if (!audioBlob) return;
    
    setLoading(true);
    setError(null);
    setStatus("Preparing audio file...");
    
    try {
      // Create a File object from the Blob
      const audioFile = new File([audioBlob], 'recording.mp3', { type: 'audio/mpeg' });
      
      // Create form data
      const formData = new FormData();
      formData.append('audio', audioFile);
      
      setStatus("Sending recording to server...");
      
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
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="h-6 w-6" />
            Record Audio for Identification
          </CardTitle>
          <CardDescription>
            Record a short audio clip to identify the song
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg">
            <div className="mb-4 p-4 rounded-full bg-primary/10">
              {isRecording ? (
                <Square className="h-8 w-8 text-destructive animate-pulse" />
              ) : (
                <Mic className="h-8 w-8 text-primary" />
              )}
            </div>
            
            <div className="text-center mb-4">
              <p className="text-sm font-medium mb-1">
                {isRecording ? 'Recording in progress...' : 'Ready to record'}
              </p>
              <p className="text-xs text-muted-foreground">
                {isRecording 
                  ? 'Capture 5-10 seconds of the song for best results' 
                  : 'Click the button below to start recording'}
              </p>
            </div>
            
            <div className="flex gap-4">
              {!isRecording ? (
                <Button 
                  onClick={startRecording}
                  disabled={loading}
                  variant="default"
                >
                  <Mic className="mr-2 h-4 w-4" />
                  Start Recording
                </Button>
              ) : (
                <Button 
                  onClick={stopRecording}
                  variant="destructive"
                >
                  <Square className="mr-2 h-4 w-4" />
                  Stop Recording
                </Button>
              )}
            </div>
          </div>
          
          {audioUrl && (
            <div className="p-4 border rounded-lg">
              <h3 className="text-sm font-medium mb-2">Recording Preview</h3>
              <audio src={audioUrl} controls className="w-full" />
              
              <Button 
                onClick={identifySong}
                disabled={loading || !audioBlob}
                className="mt-4 w-full"
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
            </div>
          )}
          
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
          
          {result && (
            <div className="p-4 bg-muted rounded-md">
              <h3 className="font-semibold mb-2">API Response:</h3>
              <pre className="text-xs overflow-auto max-h-96 p-4 bg-background rounded">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
          
          <div className="text-center">
            <Link href="/test" className="text-primary hover:underline text-sm">
              Try uploading an audio file instead
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
