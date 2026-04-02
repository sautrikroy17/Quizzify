"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import UploadBox from "@/components/UploadBox";
import ModeToggle from "@/components/ModeToggle";
import Timer from "@/components/Timer";
import QuizCard from "@/components/QuizCard";
import ResultScreen from "@/components/ResultScreen";

interface Question {
  question: string;
  options: string[];
  answer: string;
  topic: string;
}

export default function ForgePage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [mode, setMode] = useState<'practice' | 'test'>('practice');
  const [useTimer, setUseTimer] = useState(false);
  const [timerLength, setTimerLength] = useState<number>(600); // Default 10 mins
  
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | 'mixed'>('medium');

  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [quizFinished, setQuizFinished] = useState(false);

  const extractTextFromPdf = async (file: File): Promise<string> => {
    // Polyfill ReadableStream async iteration for Safari < 16.4 which throws "undefined is not a function near '...t of e...'"
    if (typeof ReadableStream !== 'undefined' && !(ReadableStream.prototype as any)[Symbol.asyncIterator]) {
      (ReadableStream.prototype as any)[Symbol.asyncIterator] = async function* () {
        const reader = this.getReader();
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) return;
            yield value;
          }
        } finally {
          reader.releaseLock();
        }
      };
    }

    // We strictly use pdfjs-dist 3.11.174 which natively supports older platforms (Safari 14+)
    const pdfjsLib = await import('pdfjs-dist');
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(" ");
      fullText += pageText + "\n";
    }
    return fullText;
  };

  const handleGenerate = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setQuestions(null);
    setAnswers({});
    setQuizFinished(false);

    try {
      let extractedText = "";
      // Handle the extraction locally in browser first
      if (file.type === "application/pdf") {
        extractedText = await extractTextFromPdf(file);
      } else if (file.type === "text/plain") {
        extractedText = await file.text();
      } else {
        throw new Error("Unsupported file type. Please upload a PDF or TXT.");
      }

      if (!extractedText.trim()) throw new Error("Could not extract any text from the document.");

      // Truncate to save payload size (Gemini won't read past a certain token limit anyway)
      const sanitizedText = extractedText.slice(0, 150000); 

      const formData = new FormData();
      formData.append("text", sanitizedText);
      formData.append("count", questionCount.toString());
      formData.append("difficulty", difficulty);

      const res = await fetch("/api/generate", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setQuestions(data.questions);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAnswer = (qIndex: number, option: string) => {
    if (mode === 'practice' && answers[qIndex]) return;
    if (quizFinished) return;
    setAnswers(prev => ({ ...prev, [qIndex]: option }));
  };

  const calculateScore = () => {
    if (!questions) return 0;
    return questions.reduce((acc, q, i) => acc + (answers[i] === q.answer ? 1 : 0), 0);
  };

  const extractWeakTopics = () => {
    if (!questions) return [];
    const weakTopics = new Set<string>();
    questions.forEach((q, i) => {
      if (answers[i] !== q.answer) {
        weakTopics.add(q.topic || 'General Concepts');
      }
    });
    return Array.from(weakTopics);
  };

  const submitTest = async () => {
    setQuizFinished(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Save to Database asynchronously
    if (questions) {
      fetch('/api/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          score: calculateScore(),
          total: questions.length,
          mode,
          difficulty,
          weakTopics: extractWeakTopics()
        })
      }).catch(console.error);
    }
  };

  const resetAll = () => {
    setFile(null);
    setQuestions(null);
    setAnswers({});
    setQuizFinished(false);
    setError(null);
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden pb-20">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/10 blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 pt-16 relative z-10">
        <header className="text-center mb-6">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black mb-4 tracking-tight text-white leading-tight"
          >
            Forge a Custom Assessment
          </motion.h1>
        </header>

        <AnimatePresence mode="wait">
          {!questions && !quizFinished && (
            <motion.div key="setup" exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }}>
              <ModeToggle mode={mode} setMode={setMode} />
              
              {mode === 'test' && (
                <div className="max-w-2xl mx-auto mb-6 flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5 shadow-lg">
                  <span className="text-zinc-300 font-medium ml-2">Enforce Timer?</span>
                  <div className="flex gap-2">
                    {[5, 10, 15].map(mins => (
                      <button 
                        key={mins}
                        onClick={() => { setUseTimer(true); setTimerLength(mins * 60); }}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${useTimer && timerLength === mins * 60 ? 'bg-primary text-white shadow-[0_0_15px_rgba(79,172,254,0.3)]' : 'bg-transparent text-zinc-400 hover:bg-white/10'}`}
                      >
                        {mins}m
                      </button>
                    ))}
                    <button 
                      onClick={() => setUseTimer(false)}
                      className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${!useTimer ? 'bg-white/10 text-white' : 'bg-transparent text-zinc-400 hover:bg-white/10'}`}
                    >
                      None
                    </button>
                  </div>
                </div>
              )}

              <UploadBox 
                file={file} 
                loading={loading} 
                questionCount={questionCount}
                difficulty={difficulty}
                onFileSelect={setFile} 
                onSetQuestionCount={setQuestionCount}
                onSetDifficulty={setDifficulty}
                onGenerate={handleGenerate} 
              />

              {error && (
                <div className="max-w-2xl mx-auto mt-6 glass-effect border-red-500/30 bg-red-500/10 text-red-400 p-4 rounded-xl text-center font-medium">
                  {error}
                </div>
              )}
            </motion.div>
          )}

          {questions && !quizFinished && (
            <motion.div key="quiz" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto">
              <div className="flex justify-between items-center mb-8 bg-white/5 p-4 rounded-2xl border border-white/5 backdrop-blur-md">
                <h2 className="text-xl font-bold text-white tracking-tight ml-2">
                  {mode === 'practice' ? 'Practice Session' : 'Active Assessment'} <span className="text-primary mx-2">•</span> {difficulty.toUpperCase()}
                </h2>
                {mode === 'test' && useTimer && (
                  <Timer durationSeconds={timerLength} onTimeUp={submitTest} isActive={!quizFinished} />
                )}
              </div>

              {questions.map((q, idx) => (
                <QuizCard 
                  key={idx} index={idx} question={q} mode={mode}
                  selectedOption={answers[idx] || null}
                  onSelect={(opt) => handleSelectAnswer(idx, opt)}
                  showCorrections={false}
                />
              ))}

              {mode === 'test' && (
                <motion.button 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  onClick={submitTest}
                  className="w-full mt-8 py-5 rounded-xl font-black text-xl text-white bg-gradient-brand hover:shadow-[0_0_30px_rgba(79,172,254,0.4)] transition-all transform hover:-translate-y-1"
                >
                  Submit Assessment
                </motion.button>
              )}
              
              {mode === 'practice' && Object.keys(answers).length === questions.length && (
                <motion.button 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  onClick={submitTest}
                  className="w-full mt-8 py-5 rounded-xl font-bold text-lg text-white glass-effect border border-primary/30 hover:bg-white/5 transition-colors"
                >
                  View Final Results
                </motion.button>
              )}
            </motion.div>
          )}

          {quizFinished && questions && (
            <motion.div key="results" className="max-w-3xl mx-auto">
              <ResultScreen score={calculateScore()} total={questions.length} onReset={resetAll} weakTopics={extractWeakTopics()} />
              
              <div className="mt-16">
                <h3 className="text-2xl font-bold text-white mb-8 border-b border-white/10 pb-4">Assessment Review</h3>
                {questions.map((q, idx) => (
                  <QuizCard 
                    key={`review-${idx}`} index={idx} question={q} mode={'test'}
                    selectedOption={answers[idx] || null}
                    onSelect={() => {}} showCorrections={true}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
