import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileAudio } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export function FileUpload({ onFileSelect, disabled }: FileUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles[0]) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.m4a'],
      'video/*': ['.mp4', '.webm']
    },
    disabled,
    maxFiles: 1
  });

  return (
    <div
      {...getRootProps()}
      className={`relative border-2 border-dashed rounded-lg p-12 transition-colors
        ${isDragActive 
          ? 'border-purple-500 bg-purple-50/10' 
          : 'border-gray-600 hover:border-purple-500'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center text-center space-y-4">
        {isDragActive ? (
          <Upload className="w-12 h-12 text-purple-500" />
        ) : (
          <FileAudio className="w-12 h-12 text-gray-400" />
        )}
        <div className="space-y-2">
          <p className="text-xl font-medium text-gray-300">
            Drop your meeting recording here
          </p>
          <p className="text-sm text-gray-400">
            or click to select a file (MP3, WAV, MP4)
          </p>
        </div>
      </div>
    </div>
  );
}