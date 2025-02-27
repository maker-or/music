"use client";

import Image from 'next/image';
import { Calendar, Disc, Music, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SongResult } from '@/lib/types';

interface SongDetailsProps {
  song: SongResult;
}

export function SongDetails({ song }: SongDetailsProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-primary/5 pb-0">
        <CardTitle className="text-2xl font-bold">Song Identified</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0">
            {song.albumArt ? (
              <div className="relative w-48 h-48 rounded-md overflow-hidden shadow-md">
                <Image
                  src={song.albumArt}
                  alt={`${song.album} cover`}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-48 h-48 bg-secondary flex items-center justify-center rounded-md">
                <Disc className="h-16 w-16 text-muted-foreground" />
              </div>
            )}
          </div>
          
          <div className="flex-1 space-y-4">
            <div>
              <h3 className="text-3xl font-bold tracking-tight">{song.title}</h3>
              <p className="text-xl text-muted-foreground">{song.artist}</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Disc className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Album:</span>
                <span className="text-sm text-muted-foreground">{song.album || 'Unknown'}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Released:</span>
                <span className="text-sm text-muted-foreground">{formatDate(song.releaseDate)}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Music className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Genre:</span>
                <span className="text-sm text-muted-foreground">{song.genre || 'Unknown'}</span>
              </div>
              
              {song.label && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Label:</span>
                  <span className="text-sm text-muted-foreground">{song.label}</span>
                </div>
              )}
            </div>
            
            {song.lyrics && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Lyrics Preview</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-line line-clamp-4">
                  {song.lyrics}
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}