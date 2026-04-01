import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Circle } from 'lucide-react';

interface QuizCardProps {
  question: { question: string; options: string[]; answer: string };
  index: number;
  mode: 'practice' | 'test';
  selectedOption: string | null;
  onSelect: (opt: string) => void;
  showCorrections: boolean;
}

export default function QuizCard({ question, index, mode, selectedOption, onSelect, showCorrections }: QuizCardProps) {
  const isPrac = mode === 'practice';
  // In practice mode, we show verification immediately upon selection. 
  // In test mode, we only show it when 'showCorrections' is forced to true at the very end.
  const isVerified = (isPrac && selectedOption !== null) || showCorrections;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}
      className="glass-effect rounded-2xl p-8 mb-6 relative overflow-hidden"
    >
      <h3 className="text-xl font-bold text-white mb-6 leading-relaxed">
        <span className="text-primary mr-2 font-black">{index + 1}.</span> 
        {question.question}
      </h3>
      
      <div className="flex flex-col gap-3">
        {question.options.map((opt, i) => {
          const isSelected = selectedOption === opt;
          const isCorrect = opt === question.answer;
          
          let btnState = "border-white/10 hover:border-white/30 hover:bg-white/5 text-zinc-300";
          let Icon = isSelected ? Circle : Circle; // Default minimal indicator
          
          if (isVerified) {
            if (isCorrect) {
              btnState = "border-emerald-500/50 bg-emerald-500/10 text-emerald-300";
              Icon = CheckCircle2;
            } else if (isSelected) {
              btnState = "border-red-500/50 bg-red-500/10 text-red-300";
              Icon = XCircle;
            }
          } else if (isSelected) {
            btnState = "border-primary bg-primary/20 text-white shadow-[0_0_15px_rgba(79,172,254,0.15)]";
            Icon = CheckCircle2;
          }

          return (
            <button
              key={i}
              disabled={isVerified} // Lock interactions once verified
              onClick={() => onSelect(opt)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex justify-between items-center group ${btnState}`}
            >
              <span className="font-medium pr-4">{opt}</span>
              <Icon className={`w-5 h-5 flex-shrink-0 ${isVerified && isCorrect ? 'text-emerald-400' : isVerified && isSelected && !isCorrect ? 'text-red-400' : isSelected ? 'text-primary' : 'text-zinc-600 group-hover:text-zinc-400'}`} />
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
