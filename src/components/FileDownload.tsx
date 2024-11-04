import React from 'react';
import { Download, FileIcon } from 'lucide-react';
import { SharedFile, formatBytes } from '../utils';

interface FileDownloadProps {
  file: SharedFile;
}

export default function FileDownload({ file }: FileDownloadProps) {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = file.data;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-xl p-8 bg-white rounded-xl shadow-lg">
      <div className="flex items-center gap-4">
        <FileIcon className="h-12 w-12 text-blue-500" />
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-900">{file.name}</h3>
          <p className="text-sm text-gray-500">{formatBytes(file.size)}</p>
        </div>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors"
        >
          <Download className="h-4 w-4" />
          Download
        </button>
      </div>
    </div>
  );
}