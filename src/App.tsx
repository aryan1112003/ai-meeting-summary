import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { SummaryView } from './components/Summary';
import { Loader2, Mic, Github, Linkedin } from 'lucide-react';
import type { Summary, UploadState } from './types';
import { generateSummary } from './lib/gemini';

function App() {
  const [uploadState, setUploadState] = useState<UploadState>({
    progress: 0,
    status: 'idle'
  });
  const [summary, setSummary] = useState<Summary | null>(null);

  const handleFileSelect = async (file: File) => {
    try {
      setUploadState({ status: 'uploading', progress: 0 });
      
      const interval = setInterval(() => {
        setUploadState(prev => ({
          ...prev,
          progress: Math.min(prev.progress + 10, 90)
        }));
      }, 200);

      const mockTranscript = "Let's plan the Q2 marketing strategy. We need to focus on social media presence and content marketing. John will handle the social media calendar, and Sarah will create blog posts. We should aim to increase engagement by 25% by the end of Q2.";
      
      setUploadState(prev => ({ ...prev, status: 'processing' }));
      clearInterval(interval);

      const summary = await generateSummary(mockTranscript);
      setSummary({ ...summary, transcript: mockTranscript });
      setUploadState({ status: 'complete', progress: 100 });
    } catch (error) {
      setUploadState({
        status: 'error',
        progress: 0,
        error: 'Failed to process the file. Please try again.'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-12">
          <div className="flex items-center space-x-3 mb-4 sm:mb-0">
            <Mic className="w-8 h-8 text-purple-400" />
            <h1 className="text-2xl font-bold">AI Meeting Summary</h1>
          </div>
          <div className="flex items-center space-x-4">
            <a 
              href="https://github.com/aryan1112003" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gray-400 hover:text-purple-400 transition-colors"
            >
              <Github className="w-5 h-5" />
              <span className="text-sm">@aryan1112003</span>
            </a>
            <a 
              href="https://www.linkedin.com/in/aryan-acharya-9b939b316/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gray-400 hover:text-purple-400 transition-colors"
            >
              <Linkedin className="w-5 h-5" />
              <span className="text-sm">Aryan Acharya</span>
            </a>
          </div>
        </div>

        <div className="space-y-8">
          <FileUpload 
            onFileSelect={handleFileSelect}
            disabled={uploadState.status === 'uploading' || uploadState.status === 'processing'}
          />

          {(uploadState.status === 'uploading' || uploadState.status === 'processing') && (
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-3">
                <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
                <span className="text-gray-300">
                  {uploadState.status === 'uploading' ? 'Uploading' : 'Processing'} your recording...
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadState.progress}%` }}
                />
              </div>
            </div>
          )}

          {uploadState.status === 'error' && (
            <div className="text-red-400 text-center">
              {uploadState.error}
            </div>
          )}

          {summary && uploadState.status === 'complete' && (
            <SummaryView data={summary} />
          )}
        </div>

        {/* Footer with watermark and copyright */}
        <footer className="mt-16 pt-8 border-t border-gray-800">
          <div className="flex flex-col sm:flex-row items-center justify-between text-gray-400 text-sm">
            <div className="flex items-center space-x-4 mb-4 sm:mb-0">
              <a 
                href="https://github.com/aryan1112003" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 hover:text-purple-400 transition-colors"
              >
                <Github className="w-5 h-5" />
                <span>@aryan1112003</span>
              </a>
              <a 
                href="https://www.linkedin.com/in/aryan-acharya-9b939b316/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 hover:text-purple-400 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
                <span>Aryan Acharya</span>
              </a>
            </div>
            <div className="text-center sm:text-right">
              <p>© {new Date().getFullYear()} Aryan Acharya. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;