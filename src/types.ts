export interface Summary {
  text: string;
  actionItems: string[];
  date: string;
  transcript?: string; // Add transcript to the summary interface
}

export interface TranscriptResponse {
  text: string;
  summary: Summary;
}

export interface UploadState {
  progress: number;
  status: 'idle' | 'uploading' | 'processing' | 'complete' | 'error';
  error?: string;
}

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}