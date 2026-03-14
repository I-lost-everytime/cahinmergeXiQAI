"use client";

import { useEffect, useState, useRef } from "react";

export default function Home() {
  const [logs, setLogs] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [totalYield, setTotalYield] = useState(0);
  const [autoScroll, setAutoScroll] = useState(true);
  const feedEndRef = useRef<HTMLDivElement>(null);

  const [trendData, setTrendData] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDecoder, setShowDecoder] = useState<Record<string, boolean>>({});
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);

  useEffect(() => {
    // Generate static trend data on mount to avoid hydration mismatch
    setTrendData([...Array(12)].map(() => Math.random() * 100));
  }, []);

  // --- VOICE OF THE PRINCE (TTS) ---
  const speak = (text: string) => {
    if (typeof window === 'undefined') return;
    window.speechSynthesis.cancel(); // Stop current speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9; // Slightly slower for 'authority'
    utterance.pitch = 0.8; // Deeper voice
    window.speechSynthesis.speak(utterance);
  };

  const fetchPulse = async () => {
    if (isLoading || !isConnected) return;
    setIsLoading(true);
    try {
      const response = await fetch('/api/feed');
      const action = await response.json();
      
      if (!action || action.error) {
        throw new Error(action?.error || "Invalid response from Swarm");
      }

      const newLog = action;
      setLogs(prev => [...prev, newLog]);
      setTotalYield(prev => prev + (newLog.pnlImpact || 0));
      
      // Automatic Voice Narrative (Defensive check)
      if (newLog.narrative && isVoiceEnabled) {
        speak(newLog.narrative);
      }
    } catch (error) {
      console.error('Pulse failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (autoScroll) {
      feedEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs, autoScroll]);

  return (
    <main className="min-h-screen bg-[#050506] text-[#f4f4f5] flex flex-col overflow-hidden selection:bg-white/10 font-sans tracking-tight">
      {/* Dynamic CSS for Neural Scanner */}
      <style jsx global>{`
        @keyframes scan {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 0.5; }
          100% { transform: translateY(100%); opacity: 0; }
        }
        .neural-line {
          animation: scan 3s linear infinite;
        }
      `}</style>

      {/* --- PREMIUM TOP BAR --- */}
      <div className="h-16 border-b border-white/[0.03] flex justify-between items-center px-10 bg-[#050506]/80 backdrop-blur-xl z-30">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-4">
             <div className={`w-2.5 h-2.5 rounded-full transition-all duration-700 ${isConnected ? 'bg-[#00ff41] shadow-[0_0_15px_rgba(0,255,65,0.6)]' : 'bg-zinc-700'}`} />
             <span className="text-xs font-semibold tracking-widest uppercase opacity-40">System_Status</span>
             <span className={`text-xs font-bold uppercase tracking-widest ${isConnected ? 'text-white' : 'text-zinc-600'}`}>{isConnected ? 'Active' : 'Standby'}</span>
          </div>
          <div className="h-4 w-px bg-white/5" />
          <div className="text-[10px] font-bold tracking-[0.3em] uppercase opacity-20 hidden md:block">
             THE_NIGERIAN_PRINCE // Autonomous_v7.0
          </div>
        </div>
        
        <div className="flex gap-8 items-center">
            <div className="flex items-center gap-4">
               <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Voice_Narrative</span>
               <button 
                 onClick={() => setIsVoiceEnabled(!isVoiceEnabled)} 
                 className={`w-10 h-5 rounded-full relative transition-all duration-500 border border-white/5 ${isVoiceEnabled ? 'bg-[#00ff41]' : 'bg-zinc-900'}`}
               >
                 <div className={`absolute top-0.5 w-4 h-4 rounded-full transition-all duration-500 ${isVoiceEnabled ? 'left-5.5 bg-black' : 'left-0.5 bg-zinc-700'}`} />
               </button>
            </div>

            <div className="h-4 w-px bg-white/5" />

            <div className="flex items-center gap-4">
               <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Auto_Scroll</span>
               <button 
                 onClick={() => setAutoScroll(!autoScroll)} 
                 className={`w-10 h-5 rounded-full relative transition-all duration-500 border border-white/5 ${autoScroll ? 'bg-white' : 'bg-zinc-900'}`}
               >
                 <div className={`absolute top-0.5 w-4 h-4 rounded-full transition-all duration-500 ${autoScroll ? 'left-5.5 bg-black' : 'left-0.5 bg-zinc-700'}`} />
               </button>
            </div>
            <button 
              onClick={() => setIsConnected(!isConnected)} 
              className={`text-xs font-black px-10 h-10 rounded-full transition-all duration-500 hover:scale-105 active:scale-95 shadow-2xl ${
                isConnected 
                  ? 'text-red-500 border border-red-500/20 hover:bg-red-500/5' 
                  : 'bg-white text-black hover:bg-zinc-200'
              }`}
            >
               {isConnected ? 'TERMINATE SWARM' : 'INITIALIZE'}
            </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* --- LEFT SIDEBAR (The Stats) --- */}
        <aside className="w-96 border-r border-white/5 bg-[#080809] flex flex-col z-20">
          <div className="p-12 border-b border-white/5">
             <div className="flex items-center gap-3 mb-10">
                <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center">
                   <span className="text-black text-xs font-black italic">P</span>
                </div>
                <div>
                   <h1 className="text-xl font-bold tracking-tighter text-white">THE_NIGERIAN<span className="opacity-30">_PRINCE</span></h1>
                   <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-[0.2em]">Alpha HQ</p>
                </div>
             </div>
             
             <div className="space-y-10">
                <div className="group">
                   <p className="text-[10px] text-zinc-600 font-bold uppercase mb-3 tracking-widest group-hover:text-zinc-400 transition-colors">Session Yield</p>
                   <div className="relative">
                      <p className="text-5xl font-medium text-white tabular-nums tracking-tighter drop-shadow-2xl">
                        <span className="opacity-20 mr-2">$</span>{totalYield.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </p>
                      {/* Trend Line Visual */}
                      <div className="mt-4 flex items-end gap-1 h-8 opacity-20">
                         {trendData.map((height, i) => (
                           <div key={i} className="flex-1 bg-white rounded-t-full" style={{ height: `${height}%` }} />
                         ))}
                      </div>
                   </div>
                </div>
                
                <div className="grid grid-cols-2 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/5">
                   <div className="p-6 bg-[#080809] hover:bg-white/[0.02] transition-colors text-center border-r border-white/5">
                      <p className="text-[9px] text-zinc-500 uppercase mb-2 font-bold tracking-widest">Averted</p>
                      <p className="text-2xl font-semibold text-red-500">{logs.filter(l => l.module === 'PHANTOM_AUDITOR').length}</p>
                   </div>
                   <div className="p-6 bg-[#080809] hover:bg-white/[0.02] transition-colors text-center">
                    <p className="text-[9px] text-zinc-500 uppercase mb-2 font-bold tracking-widest">Trades</p>
                    <p className="text-2xl font-semibold text-blue-500">{logs.filter(l => l.module === 'LEVIATHAN').length}</p>
                 </div>
              </div>

              {/* NETWORK PULSE MAP */}
              <div className="mt-12">
                 <p className="text-[9px] text-zinc-600 font-bold uppercase mb-4 tracking-widest px-1">Network_Nodes</p>
                 <div className="grid grid-cols-4 gap-2">
                    {['Ethereum', 'Solana', 'Bitcoin', 'Arbitrum', 'Base', 'Optimism', 'Polygon', 'Avalanche'].map((net) => {
                      const isActive = logs[logs.length - 1]?.inputEvent.chain === net.toLowerCase();
                      return (
                        <div key={net} className={`aspect-square rounded-lg border flex flex-col items-center justify-center transition-all duration-700 ${
                          isActive 
                            ? 'bg-white border-white shadow-[0_0_40px_rgba(255,255,255,0.8)] scale-110 z-10' 
                            : 'bg-zinc-900 border-white/5 opacity-40'
                        }`}>
                           <div className={`w-2 h-2 rounded-full mb-1 ${isActive ? 'bg-black animate-ping' : 'bg-white/20'}`} />
                           <span className={`text-[7px] font-black uppercase tracking-tighter ${isActive ? 'text-black' : 'text-zinc-600'}`}>{net.slice(0, 3)}</span>
                        </div>
                      );
                    })}
                  </div>
               </div>
            </div>
            {/* End p-12 container */}
         </div>

          <div className="flex-1 flex flex-col overflow-hidden">
             <div className="p-10 pb-4 flex justify-between items-center group">
                <h2 className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Multichain_Signals</h2>
                <div className="h-1 w-1 bg-[#00ff41] rounded-full animate-pulse shadow-[0_0_10px_rgba(0,255,65,0.8)]" />
             </div>
             <div className="flex-1 overflow-y-auto px-10 space-y-6 pb-16 scrollbar-hide opacity-50 hover:opacity-100 transition-opacity">
                {logs.map((log, i) => (
                  <div key={log.id || i} className="text-[10px] border-l-2 border-zinc-800 pl-6 py-1 leading-relaxed group hover:border-white/20 transition-all">
                    <div className="flex justify-between items-center text-zinc-500 mb-1">
                       <span className="font-black uppercase tracking-tighter">{log.inputEvent.chain}</span>
                       <span className="text-[8px] font-medium opacity-0 group-hover:opacity-100 transition-opacity">#{log.inputEvent.events?.[0]?.transaction_hash?.slice(0, 4)}</span>
                    </div>
                    <div className={log.inputEvent.events?.[0]?.status === 'failed' ? 'text-red-500/50' : 'text-[#00ff41]/50'}>
                      {log.inputEvent.events?.[0]?.status?.toUpperCase()}
                    </div>
                  </div>
                ))}
                <div ref={feedEndRef} />
             </div>
          </div>
        </aside>

        {/* --- MAIN STAGE --- */}
        <section className="flex-1 bg-[#050506] p-12 overflow-y-auto relative bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.02)_0%,transparent_70%)]">
           {/* THE PULSE BUTTON (Luxurious Interface) */}
           {isConnected && (
             <div className="sticky top-0 z-40 flex justify-center mb-20">
                <button 
                  onClick={fetchPulse}
                  disabled={isLoading}
                  className={`group relative flex items-center justify-center min-w-[340px] h-24 rounded-3xl transition-all duration-700 overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] ${
                    isLoading 
                      ? 'bg-zinc-900 border border-white/5 opacity-80 cursor-not-allowed scale-95' 
                      : 'bg-white hover:scale-105 active:scale-95'
                  }`}
                >
                   {isLoading && (
                     <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#00ff41] to-transparent neural-line z-10" />
                   )}
                   <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                   
                   {isLoading ? (
                     <div className="flex flex-col items-center gap-3">
                        <div className="flex gap-2">
                           <div className="w-2 h-2 rounded-full bg-white animate-bounce" />
                           <div className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:0.2s]" />
                           <div className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:0.4s]" />
                        </div>
                        <span className="text-white text-[10px] font-black uppercase tracking-[0.5em] animate-pulse">Neural Sync In Progress</span>
                     </div>
                   ) : (
                     <div className="flex items-center gap-8">
                        <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center transform group-hover:rotate-[360deg] transition-transform duration-1000">
                           <div className="w-3 h-3 bg-[#00ff41] rounded-full animate-ping" />
                        </div>
                        <div className="text-left">
                           <span className="block text-black text-sm font-black uppercase tracking-[0.3em] leading-none mb-1">Pulse Intelligence</span>
                           <span className="text-black/40 text-[10px] font-bold uppercase tracking-widest leading-none">Activate Neural Scan_</span>
                        </div>
                     </div>
                   )}
                </button>
             </div>
           )}

           {!isConnected && logs.length === 0 && (
             <div className="h-full flex flex-col items-center justify-center">
                <div className="w-48 h-48 border border-white/[0.03] rounded-full flex items-center justify-center relative mb-12 overflow-hidden group">
                   <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-1000" />
                   <div className="text-white/10 text-8xl font-thin tracking-tighter">?</div>
                </div>
                <h2 className="text-sm font-bold tracking-[1.2em] uppercase opacity-20 animate-pulse">Awaiting Neural Uplink</h2>
             </div>
           )}

           <div className="max-w-4xl mx-auto space-y-32">
             {[...logs].reverse().map((log) => (
               <article key={log.id} className="relative group animate-in fade-in slide-in-from-bottom-12 duration-[1500ms]">
                  
                  {/* Module Tag */}
                  <div className="flex justify-center mb-12">
                     <span className={`px-10 py-3 rounded-full text-[11px] font-black uppercase tracking-[0.5em] border backdrop-blur-xl shadow-[0_20px_40px_rgba(0,0,0,0.5)] transition-all duration-700 ${
                        log.module === 'PHANTOM_AUDITOR' 
                          ? 'border-red-500/30 text-red-100 bg-red-600/20' 
                          : 'border-blue-500/30 text-blue-100 bg-blue-600/20'
                     }`}>
                        {log.module.replace('_', ' ')}
                     </span>
                  </div>

                  {log.narrative && (
                     <div className="text-center mb-20 max-w-3xl mx-auto relative">
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-white/5 text-[120px] font-black leading-none pointer-events-none uppercase italic">PRIOR_</div>
                        <p className="text-4xl font-medium text-white tracking-tighter leading-[1.15] drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)] font-serif italic antialiased relative z-10">
                          "{log.narrative}"
                        </p>
                     </div>
                  )}

                  <div className="bg-[#0c0c0d] border border-white/[0.03] rounded-[48px] overflow-hidden flex flex-col shadow-[0_100px_120px_-50px_rgba(0,0,0,0.9)] group-hover:border-white/[0.1] transition-all duration-700 hover:-translate-y-2">
                     <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/[0.03]">
                        {/* Logic */}
                        <div className="p-14">
                           <div className="flex items-center gap-3 mb-10">
                              <div className="h-1 w-8 bg-zinc-800 rounded-full" />
                              <h3 className="text-[11px] text-zinc-600 font-black uppercase tracking-[0.3em]">Agent reasoning</h3>
                           </div>
                           <p className="text-base text-zinc-400 leading-relaxed font-medium">
                             {log.reasoning}
                           </p>
                        </div>
                        {/* Audit */}
                        {log.governance && (
                          <div className={`p-14 transition-colors duration-1000 ${log.governance.status === 'PASSED' ? 'bg-[#00ff41]/[0.015]' : 'bg-red-400/[0.03]'}`}>
                             <div className="flex justify-between items-center mb-10">
                                <h4 className="text-[11px] text-zinc-600 font-black uppercase tracking-[0.3em]">Governance Audit</h4>
                                <div className="flex items-center gap-3 bg-black/40 px-4 py-1.5 rounded-full border border-white/5 shadow-inner">
                                   <div className={`w-1.5 h-1.5 rounded-full ${log.governance.riskScore > 50 ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-[#00ff41] shadow-[0_0_10px_rgba(0,255,65,0.5)]'}`} />
                                   <span className="text-[12px] font-black text-white tabular-nums">{log.governance.riskScore}% <span className="opacity-30">RISK</span></span>
                                </div>
                             </div>
                             <p className="text-[12px] text-zinc-500 font-medium italic mb-12 leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                                {log.governance.reasoning}
                             </p>
                             <div className={`inline-flex items-center gap-4 px-8 py-3 rounded-2xl border transition-all duration-700 ${
                               log.governance.status === 'PASSED' 
                                 ? 'border-[#00ff41]/30 text-[#00ff41] bg-[#00ff41]/10 shadow-[0_10px_30px_rgba(0,255,65,0.1)]' 
                                 : 'border-red-500/30 text-red-400 bg-red-400/10 shadow-[0_10px_30px_rgba(239,68,68,0.1)]'
                             } text-[10px] font-black tracking-[0.4em] uppercase`}>
                                {log.governance.status} BY CFO
                             </div>
                          </div>
                        )}
                     </div>

                     {/* Action Bar (Futuristic High-Density) */}
                     {log.status === 'EXECUTED' && (
                       <div className="p-10 bg-white/[0.02] border-t border-white/[0.03] flex items-center justify-between gap-12 group/action">
                          <div className="flex flex-col gap-2 flex-1 min-w-0">
                             <span className="text-[9px] text-zinc-500 font-black uppercase tracking-[0.3em] group-hover/action:text-zinc-300 transition-colors">Target_Entity</span>
                             <span className="text-[13px] font-bold text-white/50 font-mono truncate tracking-tight">{log.executionPayload.to}</span>
                          </div>
                          
                          <div className="flex items-center gap-14">
                             <div className="text-right whitespace-nowrap">
                                <p className="text-[9px] text-zinc-500 font-black uppercase tracking-[0.3em] mb-2">Alpha Yield</p>
                                <p className="text-3xl font-bold text-white tracking-tighter tabular-nums drop-shadow-2xl">
                                  <span className="opacity-20 mr-1">+</span>${Number(log.pnlImpact).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                </p>
                             </div>
                             
                             <div className="flex gap-4">
                                <button 
                                  onClick={() => setShowDecoder(prev => ({ ...prev, [log.id]: !prev[log.id] }))}
                                  className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 border ${
                                    showDecoder[log.id] 
                                      ? 'bg-white border-white text-black' 
                                      : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10 hover:border-white/20'
                                  }`}
                                  title="Decode Bytecode"
                                >
                                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>
                                </button>
                                
                                <button
                                  onClick={async () => {
                                    try {
                                      if (typeof window === 'undefined' || !(window as any).ethereum) throw new Error("Initialize Wallet Connector");
                                      const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
                                      await (window as any).ethereum.request({
                                        method: 'eth_sendTransaction',
                                        params: [{
                                          from: accounts[0],
                                          to: log.executionPayload.to,
                                          data: log.executionPayload.data,
                                          value: log.executionPayload.value || "0x0",
                                          gas: log.executionPayload.gas || "0x5208", 
                                        }]
                                      });
                                    } catch (err: any) {
                                      console.error(err);
                                    }
                                  }}
                                  className="group/btn relative px-12 h-14 bg-white rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.03] active:scale-95 shadow-[0_20px_40px_rgba(255,255,255,0.1)]"
                                >
                                   <div className="absolute inset-0 bg-blue-600 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />
                                   <span className="relative z-10 text-[10px] font-black uppercase tracking-[0.4em] text-black group-hover/btn:text-white">EXECUTE_</span>
                                </button>
                             </div>
                          </div>
                       </div>
                     )}

                     {/* REVEALED DECODER SECTION */}
                     {showDecoder[log.id] && (
                        <div className="px-14 py-10 bg-black/60 border-t border-white/[0.03] animate-in slide-in-from-top-4 duration-700">
                           <div className="flex items-center gap-4 mb-6">
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                              <span className="text-[10px] font-bold text-blue-500/80 uppercase tracking-widest">Neural_Payload_Decryption</span>
                           </div>
                           <p className="text-[13px] text-zinc-400 font-mono leading-relaxed bg-white/[0.02] p-6 rounded-2xl border border-white/5 italic">
                              {log.decodedPayload}
                           </p>
                        </div>
                     )}
                  </div>
               </article>
             ))}
           </div>
           
           {/* Bottom Gradient Overlay */}
           <div className="fixed bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#050506] via-[#050506]/80 to-transparent pointer-events-none z-10" />
        </section>
      </div>
    </main>
  );
}
