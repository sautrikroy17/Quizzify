import { useEffect, useState } from 'react';
import { Timer as TimerIcon } from 'lucide-react';

export default function Timer({ durationSeconds, onTimeUp, isActive }: { durationSeconds: number; onTimeUp: () => void; isActive: boolean }) {
  const [timeLeft, setTimeLeft] = useState(durationSeconds);

  useEffect(() => {
    if (!isActive) return;
    
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp, isActive]);

  const mins = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const secs = (timeLeft % 60).toString().padStart(2, '0');

  return (
    <div className={`glass-effect px-5 py-2 rounded-full flex items-center gap-2 font-mono text-xl ${timeLeft < 60 ? 'text-red-400 animate-pulse border-red-500/50' : 'text-white'}`}>
      <TimerIcon className="w-5 h-5" /> {mins}:{secs}
    </div>
  );
}
