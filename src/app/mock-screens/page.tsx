"use client";
import React from 'react';

export default function MockScreens() {
  return (
    <div className="min-h-screen bg-[#09090b] text-white p-10 flex flex-col gap-20 font-sans">
      
      {/* Input Screen Mock - Quiz Card */}
      <div id="input-mock" className="max-w-2xl mx-auto w-full">
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <div className="flex justify-between items-center mb-8">
            <span className="text-zinc-400 font-medium tracking-wider text-sm uppercase">Question 3 of 10</span>
            <span className="bg-zinc-800 text-zinc-300 px-3 py-1 rounded-full text-xs font-bold font-mono">08:42</span>
          </div>
          
          <h2 className="text-2xl font-semibold mb-8 leading-relaxed">
            Which principle of Object-Oriented Programming ensures that sensitive data like the correct option index is hidden from the external interface?
          </h2>
          
          <div className="space-y-4">
            <button className="w-full text-left p-4 rounded-xl border border-zinc-800 bg-zinc-800/50 hover:bg-zinc-800 transition-colors text-zinc-300">
              A) Inheritance
            </button>
            <button className="w-full text-left p-4 rounded-xl border-2 border-emerald-500 bg-emerald-500/10 transition-colors text-emerald-400 font-medium flex justify-between items-center shadow-[0_0_15px_rgba(16,185,129,0.1)]">
              <span>B) Encapsulation</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            </button>
            <button className="w-full text-left p-4 rounded-xl border border-zinc-800 bg-zinc-800/50 hover:bg-zinc-800 transition-colors text-zinc-300">
              C) Polymorphism
            </button>
            <button className="w-full text-left p-4 rounded-xl border border-zinc-800 bg-zinc-800/50 hover:bg-zinc-800 transition-colors text-zinc-300">
              D) Abstraction
            </button>
          </div>
          
          <div className="mt-8 flex justify-end">
            <button className="bg-white text-black px-6 py-2 rounded-full font-medium hover:bg-zinc-200 transition-colors">
              Next Question →
            </button>
          </div>
        </div>
      </div>

      {/* Output Screen Mock - Result Screen */}
      <div id="output-mock" className="max-w-3xl mx-auto w-full">
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10 shadow-2xl text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-500"></div>
          
          <div className="w-32 h-32 mx-auto rounded-full border-4 border-zinc-800 flex items-center justify-center mb-6 relative">
             <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-zinc-800"
                strokeWidth="3"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-emerald-500"
                strokeDasharray="90, 100"
                strokeWidth="3"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="text-center">
              <span className="text-4xl font-bold text-white">90<span className="text-xl text-zinc-400">%</span></span>
            </div>
          </div>
          
          <h2 className="text-3xl font-bold mb-2">Exceptional Work!</h2>
          <p className="text-zinc-400 mb-8">You scored 9 out of 10 points on "Object-Oriented Design Principles".</p>
          
          <div className="bg-zinc-950 rounded-2xl p-6 text-left border border-zinc-800/50 mb-8">
            <h3 className="text-sm uppercase tracking-wider text-zinc-500 font-semibold mb-4">Adaptive Insights</h3>
            <div className="flex items-center gap-3 text-amber-400/90 bg-amber-400/10 p-4 rounded-xl border border-amber-500/20">
              <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              <div>
                <p className="font-medium text-amber-500">Topic to Review: Runtime Polymorphism</p>
                <p className="text-sm text-amber-500/70 mt-1">You missed 1 question related to this concept. Consider revising virtual functions and dynamic dispatch.</p>
              </div>
            </div>
          </div>
          
          <button className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-zinc-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            View Global Leaderboard
          </button>
        </div>
      </div>
      
      {/* Output Screen Mock - Leaderboard */}
      <div id="leaderboard-mock" className="max-w-4xl mx-auto w-full">
         <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-zinc-800 bg-zinc-900/50">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                Global Leaderboard
              </h2>
              <p className="text-zinc-400 mt-2">Rankings update in real-time based on test scores and difficulty multipliers.</p>
            </div>
            
            <div className="divide-y divide-zinc-800/50">
              {/* Rank 1 */}
              <div className="flex items-center justify-between p-6 bg-yellow-500/5 hover:bg-zinc-800/50 transition-colors">
                <div className="flex items-center gap-6">
                  <div className="w-10 text-center font-bold text-xl text-yellow-500">#1</div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold text-lg shadow-[0_0_15px_rgba(234,179,8,0.3)]">KR</div>
                    <div>
                      <h3 className="font-bold text-lg">Krish</h3>
                      <p className="text-xs text-zinc-400 font-mono mt-1">24 Assessments Completed</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-2xl font-bold text-white tracking-tight">4,850</div>
                  <div className="text-xs uppercase tracking-wider text-zinc-500 font-bold mt-1">Total Score</div>
                </div>
              </div>
              
              {/* Rank 2 */}
              <div className="flex items-center justify-between p-6 bg-zinc-400/5 hover:bg-zinc-800/50 transition-colors">
                <div className="flex items-center gap-6">
                  <div className="w-10 text-center font-bold text-xl text-zinc-400">#2</div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-zinc-400 to-zinc-600 flex items-center justify-center text-white font-bold text-lg">AL</div>
                    <div>
                      <h3 className="font-bold text-lg">Alex</h3>
                      <p className="text-xs text-zinc-400 font-mono mt-1">18 Assessments Completed</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-2xl font-bold text-white tracking-tight">3,200</div>
                  <div className="text-xs uppercase tracking-wider text-zinc-500 font-bold mt-1">Total Score</div>
                </div>
              </div>
              
              {/* Rank 3 */}
              <div className="flex items-center justify-between p-6 bg-orange-700/5 hover:bg-zinc-800/50 transition-colors">
                <div className="flex items-center gap-6">
                  <div className="w-10 text-center font-bold text-xl text-orange-400">#3</div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-700 flex items-center justify-center text-white font-bold text-lg">SA</div>
                    <div>
                      <h3 className="font-bold text-lg">Sarah</h3>
                      <p className="text-xs text-zinc-400 font-mono mt-1">15 Assessments Completed</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-2xl font-bold text-white tracking-tight">2,950</div>
                  <div className="text-xs uppercase tracking-wider text-zinc-500 font-bold mt-1">Total Score</div>
                </div>
              </div>
              
              {/* You */}
              <div className="flex items-center justify-between p-6 bg-blue-500/10 border-t border-b border-blue-500/20 relative">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
                <div className="flex items-center gap-6">
                  <div className="w-10 text-center font-bold text-xl text-zinc-500">#4</div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">ME</div>
                    <div>
                      <h3 className="font-bold text-lg text-blue-100">You</h3>
                      <p className="text-xs text-blue-300/70 font-mono mt-1">14 Assessments Completed</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-2xl font-bold text-blue-100 tracking-tight">2,840</div>
                  <div className="text-xs uppercase tracking-wider text-blue-400/80 font-bold mt-1">Total Score</div>
                </div>
              </div>
            </div>
         </div>
      </div>
      
    </div>
  );
}
