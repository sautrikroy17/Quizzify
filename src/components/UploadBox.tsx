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

export default function UploadBox({ file, loading, questionCount, difficulty, onFileSelect, onSetQuestionCount, onSetDifficulty, onGenerate }: UploadBoxProps) {
  const handleFile = (selectedFile: File) => {
    // 70MB limit requested by user
    if (selectedFile.size > 70 * 1024 * 1024) {
      alert("Please select a document smaller than 70 MB.");
      return;
    }
    onFileSelect(selectedFile);
  };

  const handleDrag = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
      className="glass-effect rounded-3xl p-8 max-w-2xl mx-auto mt-6"
    >
      <div 
        onDragOver={handleDrag} onDrop={handleDrop}
        className="relative border-2 border-dashed border-white/10 hover:border-primary/50 bg-white/5 hover:bg-primary/5 transition-all duration-300 rounded-2xl p-8 cursor-pointer group text-center mb-6"
      >
        <input 
          type="file" accept=".pdf,.txt" 
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        {file ? (
          <div className="flex flex-col items-center gap-3">
            <File className="w-12 h-12 text-primary" />
            <span className="text-lg font-medium text-white">{file.name}</span>
            <span className="text-sm text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 bg-white/5 rounded-full group-hover:scale-110 transition-transform">
              <Upload className="w-8 h-8 text-neutral-400 group-hover:text-primary transition-colors" />
            </div>
            <p className="text-neutral-300 text-lg">Click to upload or drag & drop</p>
            <p className="text-neutral-500 text-sm">PDF or Document (Max 70MB)</p>
          </div>
        )}
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
            {['easy', 'medium', 'hard', 'mixed'].map(diff => (
              <button 
                key={diff} onClick={() => onSetDifficulty(diff as any)}
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
