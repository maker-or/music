'use client'
import { useState } from 'react';
import { CheckCircle, Loader2, Music, Upload, XCircle } from 'lucide-react';

export default function AudioRecognition() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setError('')
      setSuccess(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select an audio file');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append('audioFile', file);
      
      const response = await fetch(
        'https://shazam-api-audio-recognition-for-songs-music-metadata.p.rapidapi.com/detect_audio_by_post',
        {
          method: 'POST',
          headers: {
            'x-rapidapi-key': '6d397837cdmsh54a1be6c030b593p15d4a2jsn466652ad5426',
            'x-rapidapi-host': 'shazam-api-audio-recognition-for-songs-music-metadata.p.rapidapi.com',
          },
          body: formData,
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to detect song');
      }
      
      const data = await response.json();
      setResult(data);
      setSuccess(true);
    } catch (err) {
      setError('Error detecting song. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2">
      <Music className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Audio Recognition</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="border rounded-md p-4 flex flex-col items-center justify-center gap-2 border-dashed">
          <label htmlFor="audio-upload" className="cursor-pointer flex flex-col items-center justify-center space-y-2">
            {file ? (
              <div className="text-green-500 flex items-center space-x-2">
                 <CheckCircle className="h-6 w-6"/>
                 <p className="text-sm">File Selected: {file.name}</p>
              </div>
            ) : (
              <>
                <Upload className="h-10 w-10 text-gray-500" />
                <p className="text-sm text-gray-600">
                  Drag and drop an MP3 file here, or click to select a file
                </p>
              </>
            )}
            <input 
              type="file" 
              id="audio-upload"
              accept="audio/mp3" 
              onChange={handleFileChange} 
              className="hidden"
            />
          </label>
        </div>
        
        <button 
          type="submit" 
          disabled={!file || loading}
          className="w-full bg-blue-500 text-white px-4 py-3 rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
            <Loader2 className="h-4 w-4 animate-spin"/>
            Processing...</>
          ) : (
            <>
            <Music className="h-4 w-4" />
            Detect Song</>
          )}
        </button>
      </form>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error! </strong>
          <span className="block sm:inline">{error}</span>
          <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
          <XCircle className="h-6 w-6"/>
          </span>
        </div>
      )}
      
      {success && result && result.result && (
        <div className="bg-gray-100 p-6 border rounded-md shadow-md">
           <div className="flex items-center space-x-2 mb-4">
            <CheckCircle className="h-6 w-6 text-green-500" />
            <h2 className="text-xl font-semibold text-green-500">Song Detected!</h2>
          </div>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <img 
                src={result.result.images.coverarthq} 
                alt={result.result.title} 
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
            <div className="md:w-2/3 space-y-4">
              <h2 className="text-2xl font-bold text-black">{result.result.title}</h2>
              <p className="text-lg text-gray-600">{result.result.subtitle}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.result.metadata.map((meta: any, index: number) => (
                  <div key={index} className="bg-white p-3 text-black rounded-md shadow">
                    <h3 className="font-semibold  text-sm">{meta.title}</h3>
                    <p className="text-sm ">{meta.text}</p>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-wrap gap-4">
                {result.result.providers.map((provider: any, index: number) => (
                  <a 
                    key={index} 
                    href={provider.uri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-black text-white px-4 py-2 rounded-md flex items-center hover:bg-gray-800 transition-colors"
                  >
                    {provider.caption}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
