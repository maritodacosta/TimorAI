
import React, { useState, useRef, useEffect } from 'react';
import { BookOpen, Send, User, Bot, Copy, Download, RefreshCw, Sparkles, Check, Eraser, MessageSquare, Layout } from 'lucide-react';
import { Language, ChatMessage } from '../types';
import { learnWithTimorAI } from '../services/geminiService';
import { TRANSLATIONS } from '../constants/translations';
import { jsPDF } from 'jspdf';

interface LearnPageProps {
  language: Language;
}

export const LearnPage: React.FC<LearnPageProps> = ({ language }) => {
  const t = TRANSLATIONS[language];
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [currentContent, setCurrentContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'board'>('chat');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setChatHistory([{ role: 'model', text: t.learnIntro }]);
    setCurrentContent(`# ${t.learnBoardTitle}\n\n${t.learnEmpty}`);
  }, [language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg: ChatMessage = { role: 'user', text: input };
    setChatHistory(prev => [...prev, userMsg]);
    setIsLoading(true);
    setInput('');
    setCurrentContent(t.learnLoading);

    try {
      const response = await learnWithTimorAI(userMsg.text, language, [...chatHistory, userMsg]);
      setChatHistory(prev => [...prev, { role: 'model', text: response.chatResponse }]);
      setCurrentContent(response.boardContent);
      // Auto switch to board on mobile after response
      if (window.innerWidth < 768) setActiveTab('board');
    } catch (error) {
      setChatHistory(prev => [...prev, { role: 'model', text: t.chatError }]);
      setCurrentContent(t.chatError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("TimorAI Knowledge Material", 15, 20);
    doc.setFontSize(12);
    const splitText = doc.splitTextToSize(currentContent, 180);
    doc.text(splitText, 15, 35);
    doc.save('TimorAI-Materi.pdf');
  };

  return (
    <div className="w-full h-full bg-[#f8fafc] dark:bg-[#020617] flex flex-col transition-colors duration-300">
      
      {/* Mobile Tab Switcher */}
      <div className="md:hidden flex bg-white dark:bg-[#0f172a] border-b border-gray-200 dark:border-white/5 p-1 shrink-0">
        <button 
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${activeTab === 'chat' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500'}`}
        >
          <MessageSquare className="w-4 h-4" /> {t.learnChatTitle}
        </button>
        <button 
          onClick={() => setActiveTab('board')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${activeTab === 'board' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500'}`}
        >
          <Layout className="w-4 h-4" /> {t.learnBoardTitle}
        </button>
      </div>

      <div className="flex-1 flex flex-col md:flex-row gap-4 h-full p-4 overflow-hidden relative">
        
        {/* FRAME 1: DISKUSI */}
        <div className={`w-full md:w-[35%] h-full flex flex-col bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-white/5 rounded-3xl shadow-xl overflow-hidden shrink-0 transition-all ${activeTab !== 'chat' ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-black/20 flex justify-between items-center">
             <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
               <Sparkles className="w-4 h-4 text-indigo-500" /> {t.learnChatTitle}
             </h2>
             <button onClick={() => setChatHistory([{ role: 'model', text: t.learnIntro }])} className="text-slate-400 hover:text-red-500"><Eraser className="w-4 h-4" /></button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatHistory.map((msg, idx) => (
              <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                 <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 shadow-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-white/10 text-emerald-600'}`}>
                   {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                 </div>
                 <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-gray-100 dark:bg-[#0f172a] text-slate-700 dark:text-gray-300 rounded-tl-none border border-gray-200 dark:border-white/5'}`}>
                   {msg.text}
                 </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 bg-white dark:bg-[#1e293b] border-t border-gray-100 dark:border-white/5">
             <div className="relative flex items-center">
               <input 
                 type="text"
                 value={input}
                 onChange={(e) => setInput(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                 placeholder={t.learnPlaceholder}
                 disabled={isLoading}
                 className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 text-slate-900 dark:text-white text-sm rounded-xl py-3 pl-4 pr-12 focus:outline-none"
               />
               <button onClick={handleSend} className="absolute right-2 p-2 bg-indigo-600 text-white rounded-lg"><Send className="w-4 h-4" /></button>
             </div>
          </div>
        </div>

        {/* FRAME 2: PAPAN PENGETAHUAN */}
        <div className={`flex-1 h-full flex flex-col bg-slate-50 dark:bg-[#0f172a] border border-gray-200 dark:border-white/10 rounded-3xl shadow-inner overflow-hidden transition-all ${activeTab !== 'board' ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-gray-200 dark:border-white/5 bg-white/60 dark:bg-[#1e293b]/60 backdrop-blur-md flex items-center justify-between">
             <h2 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest flex items-center gap-2">
               <BookOpen className="w-4 h-4 text-emerald-500" /> {t.learnBoardTitle}
             </h2>
             <div className="flex gap-2">
                <button onClick={() => { navigator.clipboard.writeText(currentContent); setCopied(true); setTimeout(()=>setCopied(false), 2000); }} className="p-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-slate-600 dark:text-slate-300">{copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}</button>
                <button onClick={handleDownloadPDF} className="p-2 bg-indigo-600 text-white rounded-lg"><Download className="w-4 h-4" /></button>
             </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 md:p-10 font-sans">
             {isLoading ? (
               <div className="h-full flex flex-col items-center justify-center text-slate-400">
                  <RefreshCw className="w-10 h-10 animate-spin text-indigo-500 mb-4" />
                  <p className="animate-pulse">{t.learnLoading}</p>
               </div>
             ) : (
               <article className="prose dark:prose-invert max-w-none">
                 <div className="whitespace-pre-wrap leading-relaxed text-slate-800 dark:text-slate-200 text-sm md:text-base">
                    {currentContent}
                 </div>
               </article>
             )}
          </div>
        </div>

      </div>
    </div>
  );
};
