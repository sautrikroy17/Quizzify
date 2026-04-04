"use client";

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, File, Loader2 } from 'lucide-react';

interface UploadBoxProps {
  file: File | null;
  loading: boolean;
  questionCount: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed';
  onFileSelect: (file: File) => void;
  onSetQuestionCount: (count: number) => void;
  onSetDifficulty: (diff: 'easy' | 'medium' | 'hard' | 'mixed') => void;
  onGenerate: () => void;
}

const ACCEPTED_TYPES = [
  'application/pdf',
  'text/plain',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
  'application/vnd.ms-powerpoint', // .ppt (legacy)
];

const ACCEPTED_EXTENSIONS = '.pdf,.txt,.pptx,.ppt';

export default function UploadBox({ file, loading, questionCount, difficulty, onFileSelect, onSetQuestionCount, onSetDifficulty, onGenerate }: UploadBoxProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (selectedFile: File) => {
    if (selectedFile.size > 70 * 1024 * 1024) {
      alert("Please select a document smaller than 70 MB.");
      return;
    }
    const isPPTX =
      selectedFile.name.toLowerCase().endsWith('.pptx') ||
      selectedFile.name.toLowerCase().endsWith('.ppt') ||
      ACCEPTED_TYPES.includes(selectedFile.type);
    if (!isPPTX && selectedFile.type !== 'application/pdf' && selectedFile.type !== 'text/plain') {
      alert("Unsupported file type. Please upload a PDF, PPTX, or TXT file.");
      return;
    }
    onFileSelect(selectedFile);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) handleFile(dropped);
  };

  // Click anywhere on the drop zone to open the file picker
  const handleZoneClick = () => {
    inputRef.current?.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="glass-effect rounded-3xl p-8 max-w-2xl mx-auto mt-6"
    >
      {/* Drop zone — entire area is clickable */}
      <div
        onClick={handleZoneClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-8 cursor-pointer text-center mb-6 transition-all duration-300 select-none
          ${isDragging
            ? 'border-primary/80 bg-primary/10 scale-[1.01]'
            : 'border-white/10 hover:border-primary/50 bg-white/5 hover:bg-primary/5'
          }`}
      >
        {/* Hidden file input — triggered by clicking anywhere in the zone */}
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_EXTENSIONS}
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          className="hidden"
        />

        {/* Content — pointer-events-none so clicks pass through to the container div */}
        <div className="pointer-events-none">
          {file ? (
            <div className="flex flex-col items-center gap-3">
              <File className="w-12 h-12 text-primary" />
              <span className="text-lg font-medium text-white">{file.name}</span>
              <span className="text-sm text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
              <span className="text-xs text-primary/70 mt-1">Click anywhere to change file</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className={`p-4 bg-white/5 rounded-full transition-transform duration-300 ${isDragging ? 'scale-110' : ''}`}>
                <Upload className={`w-8 h-8 transition-colors duration-300 ${isDragging ? 'text-primary' : 'text-neutral-400'}`} />
              </div>
              <p className="text-neutral-300 text-lg font-medium">
                {isDragging ? 'Drop it here!' : 'Click anywhere here to upload'}
              </p>
              <p className="text-neutral-500 text-sm">or drag & drop · PDF, PPTX, or TXT · Max 70MB</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">Number of Questions</label>
          <div className="flex gap-2">
            {[5, 10, 15, 20].map(num => (
              <button
                key={num} onClick={() => onSetQuestionCount(num)}
                className={`flex-1 py-2 rounded-lg font-medium text-sm transition-all ${questionCount === num ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white/5 text-zinc-400 hover:bg-white/10 border border-white/5'}`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">Difficulty</label>
          <div className="flex gap-2">
            {(['easy', 'medium', 'hard', 'mixed'] as const).map(diff => (
              <button
                key={diff} onClick={() => onSetDifficulty(diff)}
                className={`flex-1 py-2 rounded-lg font-medium text-sm transition-all capitalize ${difficulty === diff ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white/5 text-zinc-400 hover:bg-white/10 border border-white/5'}`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>
      </div>

      <motion.button
        whileHover={file && !loading ? { scale: 1.02 } : {}}
        whileTap={file && !loading ? { scale: 0.98 } : {}}
        disabled={!file || loading}
        onClick={onGenerate}
        className="w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-brand hover:bg-gradient-brand-hover shadow-[0_0_20px_rgba(79,172,254,0.3)] disabled:shadow-none text-white"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" /> Forging Knowledge...
          </span>
        ) : "Forge Quiz ✨"}
      </motion.button>
    </motion.div>
  );
}
