import React from 'react';
import { Target, Cpu, Globe, Heart, Code, Users, Rocket, Shield } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants/translations';

interface AboutPageProps {
  language: Language;
}

export const AboutPage: React.FC<AboutPageProps> = ({ language }) => {
  const t = TRANSLATIONS[language];

  const values = [
    { title: t.aboutVal1Title, desc: t.aboutVal1Desc, icon: Rocket },
    { title: t.aboutVal2Title, desc: t.aboutVal2Desc, icon: Users },
    { title: t.aboutVal3Title, desc: t.aboutVal3Desc, icon: Shield },
  ];

  return (
    <div className="w-full h-full overflow-y-auto bg-slate-50 dark:bg-[#0b1120] p-4 md:p-12 transition-colors duration-300">
      <div className="max-w-5xl mx-auto pb-12">
        
        {/* Header Hero */}
        <div className="relative rounded-3xl bg-slate-900 dark:bg-black overflow-hidden p-6 md:p-16 text-center mb-8 md:mb-12 shadow-2xl">
           <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/50 to-violet-900/50"></div>
           <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>
           <div className="relative z-10">
             <div className="inline-block p-2 md:p-3 rounded-xl bg-white/10 backdrop-blur-md mb-4 md:mb-6 border border-white/10">
                <Globe className="w-6 h-6 md:w-8 md:h-8 text-indigo-400" />
             </div>
             <h1 className="text-3xl md:text-6xl font-display font-bold text-white mb-4 md:mb-6 tracking-tight">
               {t.aboutTitle}
             </h1>
             <p className="text-lg md:text-2xl text-slate-300 font-light max-w-3xl mx-auto leading-relaxed">
               {t.aboutSubtitle}
             </p>
           </div>
        </div>

        {/* Intro */}
        <div className="mb-12 md:mb-16 text-center max-w-3xl mx-auto">
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed px-4">
            {t.aboutIntro}
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-12 md:mb-16">
           <div className="p-6 md:p-8 rounded-3xl bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-500/10">
              <div className="flex items-center gap-4 mb-4">
                 <div className="p-3 bg-rose-500 rounded-xl text-white">
                    <Target className="w-5 h-5 md:w-6 md:h-6" />
                 </div>
                 <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">{t.aboutMission}</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm md:text-base">{t.aboutMissionDesc}</p>
           </div>

           <div className="p-6 md:p-8 rounded-3xl bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-500/10">
              <div className="flex items-center gap-4 mb-4">
                 <div className="p-3 bg-indigo-500 rounded-xl text-white">
                    <Cpu className="w-5 h-5 md:w-6 md:h-6" />
                 </div>
                 <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">{t.aboutTech}</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm md:text-base">{t.aboutTechDesc}</p>
           </div>
        </div>

        {/* Core Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 md:mb-16">
          {values.map((val, idx) => (
             <div key={idx} className="p-6 rounded-2xl bg-white dark:bg-[#1e293b] border border-gray-100 dark:border-white/5 text-center hover:-translate-y-1 transition-transform duration-300">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center mx-auto mb-4 text-slate-700 dark:text-slate-300">
                   <val.icon className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2 text-lg">{val.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{val.desc}</p>
             </div>
          ))}
        </div>

        {/* Footer Signature */}
        <div className="text-center pt-8 border-t border-gray-200 dark:border-white/10">
           <p className="flex items-center justify-center gap-2 font-medium text-slate-500 dark:text-slate-400 text-sm">
             <Code className="w-4 h-4" />
             {t.aboutCreator}
             <Heart className="w-4 h-4 text-red-500 fill-red-500" />
           </p>
        </div>

      </div>
    </div>
  );
};