import { motion } from 'framer-motion';
import { Brain, GraduationCap } from 'lucide-react';

interface ModeToggleProps {
  mode: 'practice' | 'test';
  setMode: (m: 'practice' | 'test') => void;
}

export default function ModeToggle({ mode, setMode }: ModeToggleProps) {
  return (
    <div className="flex justify-center my-8">
      <div className="glass-effect p-1.5 rounded-2xl flex items-center gap-2 relative shadow-lg">
        <button
          onClick={() => setMode('practice')}
          className={`relative z-10 flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors ${mode === 'practice' ? 'text-white' : 'text-zinc-400 hover:text-white'}`}
        >
          <Brain className="w-5 h-5" /> Practice Mode
        </button>
        <button
          onClick={() => setMode('test')}
          className={`relative z-10 flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors ${mode === 'test' ? 'text-white' : 'text-zinc-400 hover:text-white'}`}
        >
          <GraduationCap className="w-5 h-5" /> Test Mode
        </button>
        
        {/* Animated Background Pill */}
        <motion.div
          animate={{ x: mode === 'practice' ? 0 : '100%' }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="absolute left-1.5 w-[calc(50%-0.6rem)] h-[calc(100%-0.75rem)] bg-white/10 rounded-xl"
        />
      </div>
    </div>
  );
}
