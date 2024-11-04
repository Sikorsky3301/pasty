import React, { useCallback } from 'react';
import { Upload, AlertCircle } from 'lucide-react';
import { MAX_FILE_SIZE } from '../utils';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  error?: string;
}

export default function FileUpload({ onFileSelect, error }: FileUploadProps) {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file && file.size <= MAX_FILE_SIZE) {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && file.size <= MAX_FILE_SIZE) {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="w-full max-w-xl p-8 bg-white rounded-xl shadow-lg"
    >
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-4 text-lg font-medium text-gray-900">
          Drag and drop your file here
        </p>
        <p className="mt-2 text-sm text-gray-500">or</p>
        <label className="mt-4 inline-block">
          <input
            type="file"
            className="hidden"
            onChange={handleChange}
            accept="*/*"
          />
          <span className="px-4 py-2 rounded-md bg-blue-500 text-white cursor-pointer hover:bg-blue-600 transition-colors">
            Browse Files
          </span>
        </label>
        <p className="mt-2 text-sm text-gray-500">Maximum file size: 50MB</p>
        {error && (
          <div className="mt-4 flex items-center justify-center text-red-500 gap-2">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
}