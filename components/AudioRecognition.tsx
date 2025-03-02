'use client'
import { useState } from 'react';

export default function AudioRecognition() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
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
    
    try {
      // Direct API call (note: this exposes your API key in client code)
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
    } catch (err) {
      setError('Error detecting song. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Audio Recognition</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2">
            Upload MP3 File:
            <input 
              type="file" 
              accept="audio/mp3" 
              onChange={handleFileChange} 
              className="block mt-1 border p-2"
            />
          </label>
        </div>
        
        <button 
          type="submit" 
          disabled={!file || loading}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
        >
          {loading ? 'Processing...' : 'Detect Song'}
        </button>
      </form>
      
      {error && <p className="text-red-500 mt-4">{error}</p>}
      
      {result && result.result && (
        <div className="mt-6 p-4 border rounded flex flex-col md:flex-row">
          <div className="md:w-1/3 mb-4 md:mr-6">
            <img 
              src={result.result.images.coverarthq} 
              alt={result.result.title} 
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
          <div className="md:w-2/3">
            <h2 className="text-2xl font-bold mb-2">{result.result.title}</h2>
            <p className="text-lg text-gray-600 mb-4">{result.result.subtitle}</p>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              {result.result.metadata.map((meta: any, index: number) => (
                <div key={index} className="bg-gray-100 p-3 rounded">
                  <h3 className="font-semibold text-sm text-black">{meta.title}</h3>
                  <p className="text-sm text-black">{meta.text}</p>
                </div>
              ))}
            </div>
            
            <div className="flex space-x-4">
              {result.result.providers.map((provider: any, index: number) => (
                <a 
                  key={index} 
                  href={provider.uri} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-black  px-4 py-2 rounded flex items-center"
                >
                  {/* <img 
                    src={provider.images.default} 
                    alt={provider.name} 
                    className="w-6 h-6 mr-2"
                  /> */}
                  {provider.caption}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}