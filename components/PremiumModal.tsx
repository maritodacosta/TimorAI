import React, { useState } from 'react';
import { X, Crown, Check, ShieldCheck, Zap, CreditCard, Building2, MapPin, Mail, Hash, ArrowRight, ArrowLeft, Infinity } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants/translations';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  language: Language;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({ isOpen, onClose, onUpgrade, language }) => {
  const [step, setStep] = useState<'plan' | 'payment'>('plan');

  if (!isOpen) return null;

  const t = TRANSLATIONS[language];

  const handleClose = () => {
    setStep('plan');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white dark:bg-[#1e293b] border border-indigo-500/30 rounded-3xl shadow-2xl w-full max-w-xl relative overflow-hidden animate-in zoom-in-95 duration-300 max-h-[95vh] flex flex-col">
        
        {/* Background Effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>

        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 rounded-full transition-colors z-20"
        >
          <X className="w-5 h-5 text-slate-500" />
        </button>

        <div className="p-6 md:p-8 overflow-y-auto scrollbar-hide flex-1">
          {/* Header */}
          <div className="text-center relative z-10 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-500/30 rotate-3">
              <Crown className="w-8 h-8 text-white" />
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">{t.premiumTitle}</h2>
            
            {/* Step Indicator */}
            <div className="flex items-center justify-center gap-2 mb-4">
               <div className={`h-1.5 rounded-full transition-all duration-300 ${step === 'plan' ? 'w-8 bg-indigo-500' : 'w-2 bg-gray-300 dark:bg-white/20'}`}></div>
               <div className={`h-1.5 rounded-full transition-all duration-300 ${step === 'payment' ? 'w-8 bg-indigo-500' : 'w-2 bg-gray-300 dark:bg-white/20'}`}></div>
            </div>

            <div className="flex items-center justify-center gap-2 mb-2">
               <span className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">{t.premiumPrice}</span>
               <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">{t.premiumPeriod}</span>
            </div>
          </div>

          {/* STEP 1: PLAN AGREEMENT */}
          {step === 'plan' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
               <p className="text-slate-500 dark:text-slate-400 text-center mb-8 max-w-sm mx-auto text-sm">
                 You have reached the daily build limit. Upgrade to Enterprise to remove all limitations and build without boundaries.
               </p>

               <div className="bg-slate-50 dark:bg-black/20 rounded-2xl p-5 border border-slate-200 dark:border-white/10 mb-8">
                   <h3 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                     <Zap className="w-4 h-4 text-amber-500" /> Why Upgrade?
                   </h3>
                   <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="p-1 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 mt-0.5">
                          <Infinity className="w-3.5 h-3.5" />
                        </div>
                        <div>
                           <span className="text-sm font-bold text-slate-800 dark:text-white block">Unlimited Daily Builds</span>
                           <span className="text-xs text-slate-500 dark:text-slate-400">Generate and refine code as many times as you want.</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="p-1 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 mt-0.5">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <div>
                           <span className="text-sm font-bold text-slate-800 dark:text-white block">Priority AI Processing</span>
                           <span className="text-xs text-slate-500 dark:text-slate-400">Faster generation speeds during peak hours.</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="p-1 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 mt-0.5">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <div>
                           <span className="text-sm font-bold text-slate-800 dark:text-white block">Full Enterprise Access</span>
                           <span className="text-xs text-slate-500 dark:text-slate-400">All features, all tools, forever unlocked.</span>
                        </div>
                      </div>
                   </div>
               </div>

               <button 
                 onClick={() => setStep('payment')}
                 className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-xl font-bold text-base shadow-xl shadow-indigo-600/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 group"
               >
                 {t.btnProceed}
                 <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
               </button>
               <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-slate-400">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Secure Agreement • Cancel Anytime</span>
               </div>
            </div>
          )}

          {/* STEP 2: PAYMENT DETAILS */}
          {step === 'payment' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <button 
                  onClick={() => setStep('plan')}
                  className="mb-4 text-xs font-bold text-slate-500 hover:text-indigo-600 flex items-center gap-1 transition-colors"
                >
                  <ArrowLeft className="w-3 h-3" /> {t.btnBack}
                </button>

                <div className="flex flex-col gap-4">
                  {/* Payment Details Card */}
                  <div className="bg-slate-50 dark:bg-black/20 rounded-2xl p-5 border border-slate-200 dark:border-white/10 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-3 opacity-10">
                        <CreditCard className="w-24 h-24 text-indigo-500" />
                      </div>
                      
                      <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-indigo-500" /> {t.paymentTitle}
                      </h3>
                      
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">{t.paymentInstruction}</p>

                      <div className="space-y-3">
                        <div className="space-y-0.5">
                          <p className="text-[10px] uppercase font-bold text-slate-400">{t.bankNameLabel}</p>
                          <p className="text-sm font-bold text-slate-800 dark:text-white">BNCTL</p>
                        </div>

                        <div className="space-y-0.5">
                          <p className="text-[10px] uppercase font-bold text-slate-400">{t.accNameLabel}</p>
                          <p className="text-sm font-bold text-slate-800 dark:text-white">Marito da Costa</p>
                        </div>

                        <div className="p-3 bg-white dark:bg-white/5 rounded-lg border border-indigo-100 dark:border-white/5">
                          <p className="text-[10px] uppercase font-bold text-indigo-500 mb-1">{t.accNumLabel}</p>
                          <p className="text-lg font-mono font-bold text-slate-800 dark:text-white tracking-widest">860052284038</p>
                        </div>
                      </div>
                  </div>

                  {/* Instructions & Confirm */}
                  <div className="flex flex-col justify-between">
                      <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-500/20 p-4 rounded-xl mb-4">
                         <div className="flex items-start gap-3">
                            <Mail className="w-5 h-5 text-amber-500 mt-0.5" />
                            <div>
                               <p className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase mb-1">
                                 Confirmation
                               </p>
                               <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-2">
                                 {t.emailConfirm}
                               </p>
                               <div className="bg-white dark:bg-black/20 p-2 rounded border border-amber-200 dark:border-white/5 text-xs font-mono font-medium text-slate-700 dark:text-slate-200 break-all select-all">
                                 maritodacosta.tl@gmail.com
                               </div>
                            </div>
                         </div>
                      </div>

                      <button 
                        onClick={onUpgrade}
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-base shadow-lg shadow-emerald-600/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                      >
                        <Zap className="w-5 h-5 fill-white" />
                        {t.premiumBtn}
                      </button>
                  </div>
                </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};