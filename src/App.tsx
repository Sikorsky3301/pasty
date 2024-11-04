import React, { useState, useCallback } from 'react';
import { Share2, Search } from 'lucide-react';
import FileUpload from './components/FileUpload';
import FileDownload from './components/FileDownload';
import { SharedFile, FileStore } from './types';
import { generateCode, MAX_FILE_SIZE } from './utils';

const fileStore: FileStore = {};

function App() {
  const [activeFile, setActiveFile] = useState<SharedFile | null>(null);
  const [searchCode, setSearchCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileSelect = useCallback(async (file: File) => {
    try {
      if (file.size > MAX_FILE_SIZE) {
        throw new Error('File size exceeds 50MB limit');
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const code = generateCode();
        const sharedFile: SharedFile = {
          id: crypto.randomUUID(),
          name: file.name,
          size: file.size,
          type: file.type,
          data: e.target?.result as string,
          code,
          createdAt: Date.now(),
        };
        
        fileStore[code] = sharedFile;
        setActiveFile(sharedFile);
        setSuccess(`File uploaded! Share code: ${code}`);
        setError('');
      };
      
      reader.readAsDataURL(file);
    } catch (err) {
      setError((err as Error).message);
      setSuccess('');
    }
  }, []);

  const handleSearch = useCallback(() => {
    const file = fileStore[searchCode.toUpperCase()];
    if (file) {
      setActiveFile(file);
      setError('');
    } else {
      setError('File not found');
      setActiveFile(null);
    }
    setSuccess('');
  }, [searchCode]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Quick Share
          </h1>
          <p className="text-lg text-gray-600">
            Upload files and share them instantly with a simple code
          </p>
        </div>

        <div className="space-y-8">
          {!activeFile ? (
            <>
              <div className="flex justify-center mb-8">
                <div className="w-full max-w-xl">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter share code"
                      value={searchCode}
                      onChange={(e) => setSearchCode(e.target.value.toUpperCase())}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={handleSearch}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                      <Search className="h-4 w-4" />
                      Find File
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <FileUpload onFileSelect={handleFileSelect} error={error} />
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <FileDownload file={activeFile} />
              
              <div className="flex justify-center">
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
                  <Share2 className="h-4 w-4 text-gray-500" />
                  <span className="font-mono text-lg">{activeFile.code}</span>
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={() => {
                    setActiveFile(null);
                    setSearchCode('');
                    setSuccess('');
                  }}
                  className="text-blue-500 hover:text-blue-600 transition-colors"
                >
                  Share another file
                </button>
              </div>
            </div>
          )}

          {success && (
            <div className="flex justify-center">
              <div className="px-4 py-2 bg-green-100 text-green-700 rounded-md">
                {success}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;