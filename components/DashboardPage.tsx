import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants/translations';
import { ArrowRight, Code, Zap, Globe, Cpu, Layers, Sparkles, Activity } from 'lucide-react';

interface DashboardPageProps {
  language: Language;
  onNavigate: (page: 'builder' | 'learn') => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ language, onNavigate }) => {
  const t = TRANSLATIONS[language];
  const [activeUsers, setActiveUsers] = useState(2450);

  // Simulate real-time fluctuating user count
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveUsers(prev => {
        const change = Math.floor(Math.random() * 20) - 8; // Random change between -8 and +12
        return prev + change;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full overflow-y-auto bg-slate-50 dark:bg-[#0b1120] transition-colors duration-300">
      
      {/* Hero Section */}
      <div className="relative min-h-[85vh] flex items-center justify-center overflow-hidden py-12 md:py-0">
        {/* Abstract Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-indigo-500/20 rounded-full blur-[80px] md:blur-[120px] animate-pulse-slow"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 md:w-96 md:h-96 bg-violet-500/20 rounded-full blur-[80px] md:blur-[120px] animate-pulse-slow delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] dark:opacity-20"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Sparkles className="w-3 h-3" />
            <span>Gemini 3.0 Engine Active</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-7xl font-display font-bold text-slate-900 dark:text-white mb-6 leading-tight tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
            {t.dashHeroTitle.split(' ').map((word: string, i: number) => (
              <span key={i} className={i === 1 ? "text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-500" : ""}>
                {word} 
              </span>
            ))}
          </h1>

          <p className="text-base sm:text-lg md:text-2xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8 md:mb-10 font-light leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            {t.dashHeroDesc}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300 w-full sm:w-auto">
            <button 
              onClick={() => onNavigate('builder')}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-bold text-base md:text-lg shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-105 transition-all flex items-center justify-center gap-3"
            >
              <Zap className="w-5 h-5 fill-white" />
              {t.dashBtnStart}
            </button>
            <button 
              onClick={() => onNavigate('learn')}
              className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-white/5 text-slate-700 dark:text-white border border-gray-200 dark:border-white/10 rounded-xl font-bold text-base md:text-lg hover:bg-gray-50 dark:hover:bg-white/10 transition-all flex items-center justify-center gap-3"
            >
              <Code className="w-5 h-5" />
              {t.dashBtnLearn}
            </button>
          </div>

          {/* Stats */}
          <div className="mt-16 md:mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-4xl mx-auto border-t border-gray-200 dark:border-white/10 pt-10 animate-in fade-in duration-1000 delay-500">
            <div>
              <div className="text-2xl md:text-4xl font-bold text-slate-900 dark:text-white mb-1">10k+</div>
              <div className="text-[10px] md:text-xs text-slate-500 uppercase tracking-wider font-semibold">{t.dashStat1}</div>
            </div>
            
            {/* Live User Stat */}
            <div className="relative group">
              <div className="flex items-center justify-center gap-2 mb-1">
                 <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                 </span>
                 <div className="text-2xl md:text-4xl font-bold text-slate-900 dark:text-white tabular-nums">
                    {activeUsers.toLocaleString()}
                 </div>
              </div>
              <div className="text-[10px] md:text-xs text-slate-500 uppercase tracking-wider font-semibold">{t.dashStat2}</div>
            </div>

            <div>
              <div className="text-2xl md:text-4xl font-bold text-slate-900 dark:text-white mb-1">1M+</div>
              <div className="text-[10px] md:text-xs text-slate-500 uppercase tracking-wider font-semibold">{t.dashStat3}</div>
            </div>
             <div>
              <div className="text-2xl md:text-4xl font-bold text-slate-900 dark:text-white mb-1">99.9%</div>
              <div className="text-[10px] md:text-xs text-slate-500 uppercase tracking-wider font-semibold">{t.dashStat4}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Highlight Section */}
      <div className="py-16 md:py-20 px-6 bg-white dark:bg-[#0f172a] relative z-10">
        <div className="max-w-6xl mx-auto">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              <div className="p-6 md:p-8 rounded-3xl bg-slate-50 dark:bg-[#1e293b] border border-gray-100 dark:border-white/5 hover:-translate-y-2 transition-transform duration-300">
                <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6">
                  <Cpu className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-3">{t.featCoreTitle}</h3>
                <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                   {t.featCoreDesc}
                </p>
              </div>
              
              <div className="p-6 md:p-8 rounded-3xl bg-slate-50 dark:bg-[#1e293b] border border-gray-100 dark:border-white/5 hover:-translate-y-2 transition-transform duration-300">
                <div className="w-12 h-12 bg-violet-500/10 rounded-2xl flex items-center justify-center mb-6">
                  <Layers className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-3">{t.featSimTitle}</h3>
                <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                   {t.featSimDesc}
                </p>
              </div>

              <div className="p-6 md:p-8 rounded-3xl bg-slate-50 dark:bg-[#1e293b] border border-gray-100 dark:border-white/5 hover:-translate-y-2 transition-transform duration-300">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6">
                  <Globe className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-3">{t.featLangTitle}</h3>
                <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                   {t.featLangDesc}
                </p>
              </div>
           </div>
        </div>
      </div>

    </div>
  );
};