import React, { useState } from 'react';
import { Clock, Download, Share2, CheckCircle, AlertCircle } from 'lucide-react';
import type { SharedFile, DownloadProgress } from '../types';
import { formatFileSize, downloadFile } from '../utils/fileHelpers';

interface FileViewerProps {
  file: SharedFile;
  onClose: () => void;
}

export function FileViewer({ file, onClose }: FileViewerProps) {
  const [downloadProgress, setDownloadProgress] = useState<DownloadProgress>({
    started: false,
    finished: false,
    error: null
  });

  const handleDownload = async () => {
    setDownloadProgress({ started: true, finished: false, error: null });
    
    try {
      await downloadFile(file.data, file.name);
      setDownloadProgress({ started: true, finished: true, error: null });
    } catch (error) {
      setDownloadProgress({
        started: true,
        finished: true,
        error: 'Failed to download file. Please try again.'
      });
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(file.code);
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  };

  return (
    <div className="w-full max-w-xl p-8 bg-white rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">File Shared!</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Share Code:</p>
          <div className="flex items-center justify-between mt-1">
            <code className="text-lg font-mono font-bold text-indigo-600">
              {file.code}
            </code>
            <button
              onClick={handleCopyCode}
              className="p-2 text-gray-500 hover:text-indigo-600 transition-colors"
              title="Copy share code"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800">{file.name}</p>
              <p className="text-sm text-gray-500">
                {formatFileSize(file.size)}
              </p>
              {downloadProgress.error && (
                <p className="text-sm text-red-500 mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {downloadProgress.error}
                </p>
              )}
              {downloadProgress.finished && !downloadProgress.error && (
                <p className="text-sm text-green-500 mt-1 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Download complete
                </p>
              )}
            </div>
            <button
              onClick={handleDownload}
              disabled={downloadProgress.started && !downloadProgress.finished}
              className={`p-3 rounded-lg transition-colors ${
                downloadProgress.started && !downloadProgress.finished
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'text-gray-500 hover:text-indigo-600 hover:bg-indigo-50'
              }`}
              title="Download file"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex items-center text-sm text-gray-500">
          <Clock className="w-4 h-4 mr-1" />
          {new Date(file.createdAt).toLocaleString()}
        </div>
      </div>
    </div>
  );
}