import React, { useCallback, useState } from 'react';
import { Upload, AlertCircle } from 'lucide-react';
import { validateFileSize, formatFileSize, MAX_FILE_SIZE } from '../utils/fileHelpers';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  isUploading: boolean;
}

export function FileUploader({ onFileSelect, isUploading }: FileUploaderProps) {
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const validateAndUpload = useCallback((file: File) => {
    const validation = validateFileSize(file);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }
    setError(null);
    onFileSelect(file);
  }, [onFileSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) validateAndUpload(file);
  }, [validateAndUpload]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) validateAndUpload(file);
  }, [validateAndUpload]);

  return (
    <div className="w-full max-w-xl p-8 bg-white rounded-xl shadow-lg">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
          isDragging
            ? 'border-indigo-400 bg-indigo-50'
            : 'border-gray-300 hover:bg-gray-50'
        }`}
      >
        <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className={`w-12 h-12 mb-4 ${isUploading ? 'text-indigo-400 animate-bounce' : 'text-gray-400'}`} />
            <p className="mb-2 text-xl text-gray-500">
              {isUploading ? 'Uploading...' : 'Drop your file here'}
            </p>
            <p className="text-sm text-gray-400">
              or click to select a file
            </p>
            <p className="mt-2 text-xs text-gray-400">
              Maximum file size: {formatFileSize(MAX_FILE_SIZE)}
            </p>
          </div>
          <input
            type="file"
            className="hidden"
            onChange={handleChange}
            disabled={isUploading}
          />
        </label>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 rounded-lg flex items-start">
          <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
}