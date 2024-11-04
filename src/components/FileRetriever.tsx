import React, { useState } from 'react';
import { Search } from 'lucide-react';
import type { SharedFile } from '../types';

interface FileRetrieverProps {
  onCodeSubmit: (code: string) => SharedFile | null;
}

export function FileRetriever({ onCodeSubmit }: FileRetrieverProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = onCodeSubmit(code);
    if (!result) {
      setError('File not found. Please check the code and try again.');
    }
  };

  return (
    <div className="w-full max-w-xl p-8 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Retrieve Shared File
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="code"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Enter Share Code
          </label>
          <div className="relative">
            <input
              type="text"
              id="code"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter the share code..."
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-indigo-600"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </form>
    </div>
  );
}