"use client";

import { useState, useRef } from 'react';
import { Music, Upload, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { identifySong } from '@/lib/api';
import { SongResult } from '@/lib/types';
import { SongDetails } from '@/components/song-details';

export function SongIdentifier() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [songResult, setSongResult] = useState<SongResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setError(null);
    setSongResult(null);
    
    if (!selectedFile) return;
    
    // Validate file type
    const validTypes = ['.mp3', '.wav', '.m4a', 'audio/mpeg', 'audio/wav', 'audio/x-m4a'];
    const fileType = selectedFile.type;
    const fileExtension = selectedFile.name.substring(selectedFile.name.lastIndexOf('.'));
    
    if (!validTypes.some(type => type === fileType || type === fileExtension)) {
      setError('Please upload a valid audio file (.mp3, .wav, or .m4a)');
      return;
    }
    
    // Validate file size (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File size exceeds 10MB limit');
      return;
    }
    
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    setError(null);
    
    try {
      // Start progress animation
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + Math.random() * 10;
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 300);
      
      // Identify song
      const result = await identifySong(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      if (!result) {
        throw new Error('Could not identify the song');
      }
      
      setSongResult(result);
      toast({
        title: "Song identified!",
        description: `We found "${result.title}" by ${result.artist}`,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while identifying the song');
      toast({
        variant: "destructive",
        title: "Identification failed",
        description: err instanceof Error ? err.message : 'An error occurred while identifying the song',
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const resetForm = () => {
    setFile(null);
    setSongResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-8">
      {!songResult && (
        <Card className="border-dashed border-2">
          <CardContent className="p-6">
            <div 
              className="flex flex-col items-center justify-center py-12 text-center cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".mp3,.wav,.m4a,audio/mpeg,audio/wav,audio/x-m4a"
                className="hidden"
                disabled={isUploading}
              />
              
              <div className="mb-4 rounded-full bg-primary/10 p-4">
                <Music className="h-10 w-10 text-primary" />
              </div>
              
              {file ? (
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium">{file.name}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6" 
                    onClick={(e) => {
                      e.stopPropagation();
                      resetForm();
                    }}
                    disabled={isUploading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <h3 className="text-lg font-semibold mb-1">Upload an audio file</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Drag and drop or click to browse
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Supports MP3, WAV, M4A (max 10MB)
                  </p>
                </>
              )}
              
              {error && (
                <p className="text-sm text-destructive mt-2">{error}</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      
      {isUploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Identifying song...</span>
            <span className="text-sm text-muted-foreground">{Math.round(uploadProgress)}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}
      
      <div className="flex justify-center gap-4">
        {!songResult && (
          <Button 
            onClick={handleUpload} 
            disabled={!file || isUploading}
            className="w-full sm:w-auto"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Identify Song
              </>
            )}
          </Button>
        )}
        
        {songResult && (
          <Button 
            variant="outline" 
            onClick={resetForm}
            className="w-full sm:w-auto"
          >
            Identify Another Song
          </Button>
        )}
      </div>
      
      {songResult && <SongDetails song={songResult} />}
    </div>
  );
}