import React, { useState } from 'react';
import { X, Mail, Lock, User, ArrowRight, Loader } from 'lucide-react';
import { Language, User as UserType } from '../types';
import { TRANSLATIONS } from '../constants/translations';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: UserType) => void;
  language: Language;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin, language }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  if (!isOpen) return null;

  const t = TRANSLATIONS[language];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Hardcoded Admin Logic
    if (mode === 'login' && formData.email === 'mdc@timor.ai' && formData.password === 'TimorAI@admin792715') {
       setTimeout(() => {
          const adminUser: UserType = {
             id: 'admin-001',
             name: 'Administrator',
             email: 'mdc@timor.ai',
             tier: 'premium',
             role: 'admin',
             avatar: 'https://ui-avatars.com/api/?name=Admin+System&background=4338ca&color=fff',
             joinedAt: Date.now(),
             buildsUsed: 0,
             lastBuildReset: Date.now()
          };
          onLogin(adminUser);
          setLoading(false);
          onClose();
       }, 1000);
       return;
    }

    // Standard User Simulation
    setTimeout(() => {
      const mockUser: UserType = {
        id: Date.now().toString(),
        name: mode === 'register' ? formData.name : 'Timor Developer',
        email: formData.email,
        tier: 'free', // Default tier is free
        role: 'user',
        avatar: `https://ui-avatars.com/api/?name=${mode === 'register' ? formData.name : 'Timor Developer'}&background=4338ca&color=fff`,
        joinedAt: Date.now(),
        buildsUsed: 0,
        lastBuildReset: Date.now()
      };
      
      onLogin(mockUser);
      setLoading(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-white/10 rounded-3xl shadow-2xl w-full max-w-md relative overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col">
        
        {/* Decorative BG */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-violet-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors z-20 text-slate-500"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
           <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 text-center">
             {mode === 'login' ? t.authLogin : t.authRegister}
           </h2>
           <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-8">
             {mode === 'login' ? 'Welcome back to TimorAI' : 'Join the digital revolution'}
           </p>

           <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase ml-1">{t.authName}</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl py-3 pl-10 pr-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                      placeholder="Marito da Costa"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase ml-1">{t.authEmail}</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl py-3 pl-10 pr-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                      placeholder="user@timor.tl"
                    />
                  </div>
              </div>

              <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase ml-1">{t.authPassword}</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <input 
                      type="password" 
                      required
                      value={formData.password}
                      onChange={e => setFormData({...formData, password: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl py-3 pl-10 pr-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                      placeholder="••••••••"
                    />
                  </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 mt-6 transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? <Loader className="w-5 h-5 animate-spin" /> : t.authSubmit}
                {!loading && <ArrowRight className="w-5 h-5" />}
              </button>
           </form>

           <div className="mt-6 text-center">
             <button 
               onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
               className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
             >
               {mode === 'login' ? t.authSwitchRegister : t.authSwitchLogin}
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};