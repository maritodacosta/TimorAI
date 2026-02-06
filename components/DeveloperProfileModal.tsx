import React from 'react';
import { X, User, Calendar, MapPin, Mail, Award, Globe, Code } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants/translations';

interface DeveloperProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const DeveloperProfileModal: React.FC<DeveloperProfileModalProps> = ({ isOpen, onClose, language }) => {
  if (!isOpen) return null;

  const t = TRANSLATIONS[language];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      {/* Modal Container */}
      <div className="bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-white/10 rounded-3xl shadow-2xl w-full max-w-md relative mt-10 sm:mt-12 transition-colors max-h-[85vh] overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col">
        
        {/* Close Button - Fixed on top of scroll view */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors z-50 backdrop-blur-sm"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Area - Wraps both Header and Content */}
        <div className="overflow-y-auto scrollbar-hide w-full h-full">
          
          {/* Header Background */}
          <div className="h-28 sm:h-32 shrink-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full translate-x-10 -translate-y-10"></div>
            
            <div className="absolute bottom-4 right-6 text-white/20">
              <Code className="w-10 h-10 sm:w-12 sm:h-12" />
            </div>
          </div>

          {/* Content Wrapper */}
          <div className="px-6 sm:px-8 pb-8 sm:pb-10 pt-6 relative">
            
            {/* Name & Title */}
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Marito da Costa</h2>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="text-white text-[10px] sm:text-xs font-bold bg-gradient-to-r from-primary to-secondary px-3 py-1 rounded-full shadow-lg shadow-primary/20">L.Ed., M.Ed.</span>
                <span className="text-slate-500 dark:text-slate-400 text-[10px] sm:text-xs font-semibold px-2 py-1 border border-slate-200 dark:border-slate-700 rounded-full">{t.devRole}</span>
              </div>
            </div>

            {/* Profile Details */}
            <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4">
              <div className="group p-3 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 hover:border-primary/20 transition-all flex items-center gap-4">
                 <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white dark:bg-white/10 flex items-center justify-center text-primary shadow-sm shrink-0">
                   <User className="w-4 h-4 sm:w-5 sm:h-5" />
                 </div>
                 <div>
                   <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">{t.devGenderLabel}</p>
                   <p className="font-semibold text-sm sm:text-base text-slate-900 dark:text-white">{t.devGenderValue}</p>
                 </div>
              </div>

              <div className="group p-3 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 hover:border-primary/20 transition-all flex items-center gap-4">
                 <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white dark:bg-white/10 flex items-center justify-center text-primary shadow-sm shrink-0">
                   <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                 </div>
                 <div>
                   <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">{t.devBirthplaceLabel}</p>
                   <p className="font-semibold text-sm sm:text-base text-slate-900 dark:text-white leading-tight">{t.devBirthplaceValue}</p>
                   <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Timor Leste</p>
                 </div>
              </div>

              <div className="group p-3 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 hover:border-primary/20 transition-all flex items-center gap-4">
                 <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white dark:bg-white/10 flex items-center justify-center text-primary shadow-sm shrink-0">
                   <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                 </div>
                 <div>
                   <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">{t.devBirthdateLabel}</p>
                   <p className="font-semibold text-sm sm:text-base text-slate-900 dark:text-white">{t.devBirthdateValue}</p>
                 </div>
              </div>

              <div className="group p-3 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 hover:border-primary/20 transition-all flex items-center gap-4">
                 <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white dark:bg-white/10 flex items-center justify-center text-primary shadow-sm shrink-0">
                   <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                 </div>
                 <div className="overflow-hidden">
                   <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">{t.devContactLabel}</p>
                   <a href="mailto:maritodacosta.tl@gmail.com" className="font-semibold text-sm sm:text-base text-slate-900 dark:text-white hover:text-primary transition-colors block truncate">
                     maritodacosta.tl@gmail.com
                   </a>
                 </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-white/5 text-center">
               <div className="inline-flex items-center gap-2 text-primary/80 mb-2">
                  <Globe className="w-3 h-3" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Global Standard Tech</span>
               </div>
              <p className="text-[10px] sm:text-xs text-slate-500 dark:text-gray-400 italic font-medium leading-relaxed">
                {t.devQuote}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};