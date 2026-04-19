import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Bot, Link as LinkIcon, CheckCircle, XCircle, AlertTriangle, ExternalLink, Download, Globe, Shield } from "lucide-react";

interface BotStatus {
  status: string;
  username: string;
  configured: boolean;
}

export default function App() {
  const [status, setStatus] = useState<BotStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/status")
      .then((res) => res.json())
      .then((data) => {
        setStatus(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch status:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 font-sans text-white selection:bg-white selection:text-indigo-600 overflow-x-hidden">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto flex justify-between items-center p-6 lg:px-12 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
            <Download className="w-6 h-6 text-indigo-600" strokeWidth={2.5} />
          </div>
          <span className="text-2xl font-black tracking-tight uppercase">MediaBot<span className="text-indigo-200">DL</span></span>
        </div>
        <div className="flex gap-4 md:gap-6 items-center">
          <span className="bg-white/20 px-4 py-1.5 rounded-full text-xs md:text-sm font-semibold backdrop-blur-md border border-white/10 uppercase tracking-wider">v1.0.0</span>
          <div className="hidden md:flex gap-6 items-center">
            <a href="#" className="text-white font-medium opacity-80 hover:opacity-100 transition-opacity">Docs</a>
            <button 
              disabled={!status?.configured}
              onClick={() => status?.username && window.open(`https://t.me/${status.username}`, "_blank")}
              className="bg-white text-indigo-600 px-6 py-2 rounded-full font-bold shadow-xl hover:scale-105 transition-transform disabled:opacity-50 disabled:scale-100 cursor-pointer disabled:cursor-not-allowed"
            >
              Get Bot
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 lg:px-12 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content Left */}
          <div className="space-y-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.05] drop-shadow-sm uppercase">
                One Bot.<br/>Every Media.<br/>Zero Limits.
              </h1>
              <p className="text-lg text-indigo-100 leading-relaxed max-w-md font-medium">
                The most powerful media downloader for Telegram. Powered by our high-speed Vercel API. Supports TikTok, Instagram, YouTube, and 50+ other platforms instantly.
              </p>
            </motion.div>
            
            {/* CTA & Status */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <button 
                disabled={!status?.configured}
                onClick={() => status?.username && window.open(`https://t.me/${status.username}`, "_blank")}
                className="bg-blue-400 hover:bg-blue-500 px-10 py-5 rounded-2xl text-white font-bold text-xl shadow-2xl flex items-center gap-3 transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:hover:bg-blue-400 disabled:hover:translate-y-0"
              >
                <Bot className="w-7 h-7" />
                Launch Bot
              </button>
              
              <div className="flex flex-col">
                <span className="text-xs font-bold opacity-70 uppercase tracking-[0.2em]">Engine Status</span>
                <span className={`flex items-center gap-2 font-bold tracking-tight ${status?.configured ? 'text-green-300' : 'text-amber-300'}`}>
                  <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${status?.configured ? 'bg-green-400' : 'bg-amber-400'}`}></span>
                  {status?.status || "INITIALIZING..."}
                </span>
              </div>
            </div>

            {/* API Config Box */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-2xl p-6 font-mono text-sm space-y-3 shadow-inner"
            >
              <div className="flex items-center gap-2 border-b border-white/10 pb-3 mb-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                <span className="ml-2 text-indigo-200 uppercase text-[10px] font-bold tracking-[0.1em]">Endpoint Configuration</span>
              </div>
              <div className="space-y-1 text-[13px]">
                <p className="text-pink-300">GET <span className="text-white">https://allmedia-dl.vercel.app/download</span></p>
                <p className="text-indigo-300">?url=<span className="text-green-300">{"{media_link}"}</span></p>
                <p className="text-white/40 italic mt-4">// Status: {status?.configured ? "ACTIVE" : "PENDING_TOKEN"}</p>
              </div>
              
              {!status?.configured && (
                <div className="mt-4 p-3 bg-amber-500/20 border border-amber-500/30 rounded-lg text-amber-200 text-xs font-semibold leading-snug">
                  REQUIRED: Add <span className="bg-amber-500/30 px-1 rounded text-white">TELEGRAM_BOT_TOKEN</span> to your secrets to activate the bot.
                </div>
              )}
            </motion.div>
          </div>

          {/* Right Column: Phone Mockup */}
          <div className="relative flex justify-center py-10">
            <div className="w-72 h-[580px] bg-slate-950 rounded-[3rem] border-[10px] border-slate-900 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] relative overflow-hidden ring-1 ring-white/10">
              {/* Dynamic Lens Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-slate-900 rounded-b-2xl z-20"></div>
              
              {/* Phone Content */}
              <div className="h-full flex flex-col bg-[#0f172a]">
                {/* Status Bar */}
                <div className="h-10 w-full flex justify-between items-center px-8 pt-4 pb-2 z-10">
                  <span className="text-[11px] font-bold text-white">9:41</span>
                  <div className="flex gap-1.5 items-center">
                    <Shield className="w-3 h-3 text-white/40" />
                    <div className="w-4 h-2 bg-white/40 rounded-sm"></div>
                  </div>
                </div>
                
                {/* Bot Header */}
                <div className="p-4 border-b border-white/5 bg-slate-900/80 backdrop-blur flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center text-[11px] font-black shadow-lg">AD</div>
                  <div>
                    <p className="text-[12px] font-bold text-white tracking-tight">AllMedia DL Bot</p>
                    <p className="text-[10px] text-green-400 font-bold uppercase tracking-wider">online</p>
                  </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 p-4 space-y-4 overflow-y-auto font-sans">
                  <div className="bg-slate-800 p-3 rounded-2xl rounded-tl-sm text-[12px] text-white/90 max-w-[90%] shadow-sm leading-relaxed">
                    👋 Welcome! Send me any media link from TikTok, Instagram, or YouTube to start.
                  </div>
                  
                  <div className="bg-indigo-600 p-3 rounded-2xl rounded-tr-sm text-[12px] text-white font-medium ml-auto max-w-[85%] shadow-md">
                    https://tiktok.com/@joy/video/73...
                  </div>

                  <div className="bg-slate-800 p-3 rounded-2xl rounded-tl-sm text-[11px] max-w-[90%] shadow-sm border border-white/5">
                    <div className="w-full h-28 bg-slate-700/50 rounded-xl mb-3 flex items-center justify-center overflow-hidden border border-white/5">
                      <motion.div 
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      >
                        <Globe className="w-8 h-8 text-white/20" />
                      </motion.div>
                    </div>
                    <p className="text-white font-bold flex items-center gap-1 mb-2">
                       ✅ Processing Link...
                    </p>
                    <div className="mt-2 py-1.5 px-3 bg-indigo-500/20 border border-indigo-500/30 rounded-lg text-indigo-400 font-black uppercase text-[9px] tracking-widest text-center shadow-inner">
                      Download HD (8.4 MB)
                    </div>
                  </div>
                </div>

                {/* Input Bar */}
                <div className="p-3 bg-slate-900 border-t border-white/5 flex items-center gap-2">
                  <div className="flex-1 h-9 bg-slate-800 rounded-full px-4 flex items-center text-[11px] text-white/40 ring-1 ring-white/5 shadow-inner italic">Write message...</div>
                  <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center shadow-lg active:scale-90 transition-transform">
                    <ExternalLink className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Badges */}
            <motion.div 
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute -right-8 top-1/4 bg-white text-slate-900 p-5 rounded-2xl shadow-2xl flex items-center gap-4 border border-indigo-100"
            >
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center text-2xl shadow-inner">
                🚀
              </div>
              <div className="flex flex-col">
                <p className="text-sm font-black uppercase tracking-tight">Ultra Fast</p>
                <p className="text-[11px] font-bold opacity-40 uppercase tracking-widest">1.2s avg latency</p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="absolute -left-12 bottom-1/4 bg-white text-slate-900 p-5 rounded-2xl shadow-2xl flex items-center gap-4 border border-indigo-100"
            >
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl shadow-inner font-bold">
                ✨
              </div>
              <div className="flex flex-col">
                <p className="text-sm font-black uppercase tracking-tight">High Quality</p>
                <p className="text-[11px] font-bold opacity-40 uppercase tracking-widest">4K HQ Processing</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Dynamic Footer / Trusted By */}
        <div className="mt-16 border-t border-white/10 pt-12 flex flex-col md:flex-row justify-between items-center gap-8 opacity-60">
          <span className="text-xs font-black uppercase tracking-[0.4em] text-center">Engineered with Precision / Connected Platforms</span>
          <div className="flex flex-wrap justify-center gap-8 md:gap-12 font-black text-lg md:text-2xl tracking-tighter italic">
            <span>TIKTOK</span>
            <span>INSTAGRAM</span>
            <span>YOUTUBE</span>
            <span>TWITTER</span>
            <span>FACEBOOK</span>
          </div>
        </div>
      </main>

      {/* Actual Footer */}
      <footer className="p-10 text-center opacity-40 text-[10px] font-bold uppercase tracking-[0.3em]">
        &copy; 2026 MediaBot DL / All rights preserved
      </footer>
    </div>
  );
}
