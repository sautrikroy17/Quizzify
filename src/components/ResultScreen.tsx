import { motion } from 'framer-motion';
import { Target, RotateCcw } from 'lucide-react';

interface ResultScreenProps {
  score: number;
  total: number;
  onReset: () => void;
  weakTopics?: string[];
}

export default function ResultScreen({ score, total, onReset, weakTopics = [] }: ResultScreenProps) {
  const percentage = Math.round((score / total) * 100);
  
  // Dynamic messaging
  let message = "You successfully forged through all questions.";
  if (percentage >= 90) message = "Exceptional performance! Outstanding mastery.";
  else if (percentage >= 70) message = "Great job! You have a solid grasp of this.";
  else if (percentage < 50) message = "Keep studying! You'll master this soon.";

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, y: 20 }} 
      animate={{ opacity: 1, scale: 1, y: 0 }} 
      className="glass-effect rounded-[2rem] p-10 max-w-lg mx-auto text-center mt-12 shadow-2xl relative overflow-hidden"
    >
      {/* Decorative gradient orb */}
      <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/20 rounded-full blur-[80px]" />
      <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px]" />

      <div className="relative z-10">
        <div className="w-24 h-24 rounded-full bg-gradient-brand mx-auto flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(79,172,254,0.4)]">
          <Target className="w-10 h-10 text-white" />
        </div>
        
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 mb-3">
          Quiz Complete
        </h2>
        <p className="text-zinc-400 mb-10 text-lg">{message}</p>
        
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 mb-10 text-left">
          <div className="flex justify-between items-end mb-4">
            <div>
              <p className="text-sm text-zinc-500 mb-1 font-medium uppercase tracking-wider">Final Score</p>
              <p className="text-3xl font-black text-white">{score} <span className="text-zinc-500 text-xl font-medium">/ {total}</span></p>
            </div>
            <p className="text-right text-lg text-primary font-mono font-bold align-bottom">{percentage}%</p>
          </div>
          <div className="w-full bg-black/40 rounded-full h-4 overflow-hidden border border-white/5 shadow-inner">
            <motion.div 
              initial={{ width: 0 }} animate={{ width: `${percentage}%` }} transition={{ duration: 1.5, delay: 0.3, type: "spring" }}
              className="bg-gradient-brand h-full rounded-full relative"
            >
              <div className="absolute inset-0 bg-white/20 w-full h-full animate-pulse" />
            </motion.div>
          </div>
        </div>

        {weakTopics.length > 0 && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 mb-10 text-left">
            <h4 className="text-red-400 font-bold mb-3 flex items-center gap-2">
              <Target className="w-4 h-4" /> Recommended Focus Areas
            </h4>
            <div className="flex flex-wrap gap-2">
              {weakTopics.map(topic => (
                <span key={topic} className="px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-300 rounded-lg text-sm font-medium">
                  {topic}
                </span>
              ))}
            </div>
          </div>
        )}

        <button 
          onClick={onReset} 
          className="group relative overflow-hidden flex items-center justify-center gap-2 w-full py-4 rounded-xl font-bold bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300 text-white shadow-lg focus:ring-2 focus:ring-primary/50 outline-none"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent group-hover:-translate-x-full duration-[1.5s] ease-in-out translate-x-full" />
          <RotateCcw className="w-5 h-5 group-hover:-rotate-180 transition-transform duration-500" /> 
          Forge Another Quiz
        </button>
      </div>
    </motion.div>
  );
}
