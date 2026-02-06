
import React from 'react';
import { Check, X, Crown, Zap, Globe, Activity } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants/translations';

interface PricingPageProps {
  language: Language;
  onUpgrade: () => void;
  isLoggedIn: boolean;
  onLoginRequest: () => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ language, onUpgrade, isLoggedIn, onLoginRequest }) => {
  const t = TRANSLATIONS[language];

  const handleAction = () => {
    if (isLoggedIn) onUpgrade();
    else onLoginRequest();
  };

  return (
    <div className="w-full h-full overflow-y-auto bg-slate-50 dark:bg-[#0b1120] p-4 md:p-12 transition-colors duration-300">
      <div className="max-w-5xl mx-auto pb-16">
        
        <div className="text-center mb-12 md:mb-20 space-y-4 pt-8 md:pt-0">
           <h1 className="text-3xl md:text-6xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
             Digital <span className="text-indigo-600 dark:text-indigo-400">Excellence</span>
           </h1>
           <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-base md:text-xl font-light">
             {t.premiumDesc}
           </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-stretch justify-center max-w-4xl mx-auto">
           
           <div className="w-full md:flex-1 p-8 rounded-[2.5rem] bg-white dark:bg-[#1e293b] border border-gray-100 dark:border-white/5 flex flex-col shadow-sm hover:shadow-xl transition-all duration-300">
             <div className="mb-8">
                <div className="w-14 h-14 bg-gray-100 dark:bg-white/5 rounded-2xl flex items-center justify-center mb-6">
                   <Globe className="w-7 h-7 text-slate-500" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{t.priceFree}</h3>
                <p className="text-slate-500 text-sm font-medium">{t.priceFreeDesc}</p>
             </div>
             
             <div className="text-4xl font-extrabold text-slate-900 dark:text-white mb-8">$0</div>
             
             <div className="flex-1 space-y-5 mb-10">
               <FeatureItem text="5 AI Builds per 24 Hours" active={true} icon={<Activity className="w-4 h-4 text-amber-500" />} />
               <FeatureItem text="Download Source Code" active={true} />
               <FeatureItem text="Github Repository Sync" active={true} />
               <FeatureItem text="File Explorer Access" active={true} />
               <FeatureItem text="Priority Processing" active={false} />
             </div>

             <button disabled className="w-full py-4 rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-400 font-bold text-sm uppercase tracking-widest cursor-not-allowed">
               {t.priceStarterActive}
             </button>
           </div>

           <div className="w-full md:flex-1 p-8 rounded-[2.5rem] bg-slate-900 dark:bg-black border border-indigo-500/30 flex flex-col relative shadow-2xl shadow-indigo-500/20 transform md:scale-110 z-10">
             <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
             
             <div className="mb-8 relative z-10">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-600/30">
                   <Crown className="w-7 h-7 text-white" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-2xl font-bold text-white">{t.priceEnterprise}</h3>
                  <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter">{t.priceRecommended}</span>
                </div>
                <p className="text-indigo-200 text-sm font-medium">{t.priceEnterpriseDesc}</p>
             </div>

             <div className="flex items-baseline gap-1 mb-8 relative z-10">
                <div className="text-5xl font-extrabold text-white tracking-tighter">{t.premiumPrice}</div>
                <div className="text-indigo-300 font-medium text-sm">{t.premiumPeriod}</div>
             </div>
             
             <div className="flex-1 space-y-5 mb-10 relative z-10">
               <FeatureItem text="Unlimited AI Builds" active={true} dark icon={<Zap className="w-4 h-4 text-yellow-400 fill-yellow-400" />} />
               <FeatureItem text="Full File Explorer & Editor" active={true} dark />
               <FeatureItem text="Unlimited Downloads & Sync" active={true} dark />
               <FeatureItem text="Priority AI Processing" active={true} dark />
               <FeatureItem text="24/7 Dedicated Support" active={true} dark />
             </div>

             <button 
               onClick={handleAction}
               className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:scale-[1.02] active:scale-95 text-white font-bold text-sm md:text-base uppercase tracking-widest shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-3"
             >
               <Zap className="w-5 h-5 fill-white" />
               {t.premiumBtn}
             </button>
           </div>

        </div>
      </div>
    </div>
  );
};

const FeatureItem = ({ text, active, dark, icon }: { text: string, active: boolean, dark?: boolean, icon?: React.ReactNode }) => (
  <div className={`flex items-center gap-3 text-sm ${active ? (dark ? 'text-white' : 'text-slate-700 dark:text-slate-200') : 'text-slate-400 dark:text-slate-600'}`}>
    <div className={`p-1 rounded-full shrink-0 ${active ? 'bg-green-500/20 text-green-500' : 'bg-gray-100 dark:bg-white/5 text-gray-400'}`}>
      {active ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
    </div>
    <div className="flex items-center gap-2">
      {icon}
      <span className={`${!active ? 'line-through' : ''} font-medium`}>{text}</span>
    </div>
  </div>
);
