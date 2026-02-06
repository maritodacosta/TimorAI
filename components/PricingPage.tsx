import React from 'react';
import { Check, X, Crown, Zap, Github, Folder, Download, Globe, Activity } from 'lucide-react';
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
    if (isLoggedIn) {
      onUpgrade();
    } else {
      onLoginRequest();
    }
  };

  return (
    <div className="w-full h-full overflow-y-auto bg-slate-50 dark:bg-[#0b1120] p-4 md:p-12 transition-colors duration-300">
      <div className="max-w-5xl mx-auto pb-12">
        
        {/* Header */}
        <div className="text-center mb-12 md:mb-16 space-y-4">
           <h1 className="text-3xl md:text-5xl font-display font-bold text-slate-900 dark:text-white px-2">
             Invest in your <span className="text-indigo-600 dark:text-indigo-400">Digital Future</span>
           </h1>
           <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-base md:text-lg px-4">
             {t.premiumDesc}
           </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
           
           {/* Free Tier */}
           <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-white/5 flex flex-col relative overflow-hidden group hover:border-indigo-500/20 transition-all duration-300 shadow-sm hover:shadow-md">
             <div className="mb-6">
                <div className="w-12 h-12 bg-gray-100 dark:bg-white/10 rounded-2xl flex items-center justify-center mb-4 text-slate-600 dark:text-slate-300">
                   <Globe className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{t.priceFree}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm">{t.priceFreeDesc}</p>
             </div>
             <div className="text-4xl font-bold text-slate-900 dark:text-white mb-6">$0</div>
             
             <div className="flex-1 space-y-4 mb-8">
               <FeatureItem text="5 AI Builds per 24 Hours" active={true} icon={<Activity className="w-4 h-4 text-amber-500" />} />
               <FeatureItem text="Download Source Code" active={true} />
               <FeatureItem text="Github Repository Sync" active={true} />
               <FeatureItem text="File Explorer Access" active={true} />
               <FeatureItem text="Basic Preview (Mobile/Desktop)" active={true} />
               <FeatureItem text="Priority Processing" active={false} />
             </div>

             <button disabled className="w-full py-3 rounded-xl bg-gray-100 dark:bg-white/5 text-slate-400 font-bold cursor-not-allowed text-sm">
               Current Plan
             </button>
           </div>

           {/* Enterprise Tier */}
           <div className="p-6 md:p-8 rounded-3xl bg-slate-900 dark:bg-black border border-indigo-500/30 flex flex-col relative overflow-hidden shadow-2xl shadow-indigo-500/20 transform md:scale-105">
             <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
             
             <div className="mb-6 relative z-10">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center mb-4 text-white shadow-lg shadow-indigo-500/30">
                   <Crown className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-white">{t.priceEnterprise}</h3>
                <p className="text-indigo-200 text-sm">{t.priceEnterpriseDesc}</p>
             </div>
             <div className="flex items-end gap-1 mb-2 relative z-10">
                <div className="text-5xl font-bold text-white tracking-tight">{t.premiumPrice}</div>
                <div className="text-indigo-300 font-medium mb-1.5">{t.premiumPeriod}</div>
             </div>
             <p className="text-xs text-indigo-400 font-medium mb-6 relative z-10">{t.premiumNote}</p>
             
             <div className="flex-1 space-y-4 mb-8 relative z-10">
               <FeatureItem text="Unlimited AI Builds (No Daily Limit)" active={true} dark icon={<Zap className="w-4 h-4 text-yellow-400 fill-yellow-400" />} />
               <FeatureItem text="Full File Explorer & Editor" active={true} dark />
               <FeatureItem text="Unlimited Downloads & Sync" active={true} dark />
               <FeatureItem text="Priority AI Processing" active={true} dark />
               <FeatureItem text="Commercial License" active={true} dark />
               <FeatureItem text="24/7 Dedicated Support" active={true} dark />
             </div>

             <button 
               onClick={handleAction}
               className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold shadow-lg shadow-indigo-500/30 relative z-10 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 text-sm md:text-base"
             >
               <Zap className="w-4 h-4 fill-white" />
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
    <div className={`p-0.5 rounded-full shrink-0 ${active ? 'bg-green-500/20 text-green-500' : 'bg-gray-200 dark:bg-white/5 text-gray-400'}`}>
      {active ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
    </div>
    <div className="flex items-center gap-2">
      {icon}
      <span className={`${!active ? 'line-through decoration-slate-300 dark:decoration-slate-700' : ''} leading-tight`}>{text}</span>
    </div>
  </div>
);