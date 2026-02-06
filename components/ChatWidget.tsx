import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Sparkles } from 'lucide-react';
import { chatWithTimorAI } from '../services/geminiService';
import { ChatMessage, Language } from '../types';
import { TRANSLATIONS } from '../constants/translations';

interface ChatWidgetProps {
    language: Language;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({ language }) => {
  const [isOpen, setIsOpen] = useState(false);
  const t = TRANSLATIONS[language];

  // Initialize with translated message
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Effect to reset/init the first message when language changes, ONLY if chat is empty or just has the intro
  useEffect(() => {
     if (messages.length === 0 || (messages.length === 1 && messages[0].role === 'model')) {
         setMessages([{ role: 'model', text: t.chatIntro }]);
     }
  }, [language]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await chatWithTimorAI(input, messages);
      const aiMsg: ChatMessage = { role: 'model', text: responseText };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: t.chatError }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end">
      
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[350px] sm:w-[380px] h-[500px] bg-white/90 dark:bg-[#0f172a]/90 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300">
          
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-indigo-600 to-violet-700 flex items-center justify-between shrink-0">
             <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center border border-white/20">
                 <Bot className="w-5 h-5 text-white" />
               </div>
               <div>
                 <h3 className="text-sm font-bold text-white">{t.chatTitle}</h3>
                 <div className="flex items-center gap-1.5">
                   <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                   <span className="text-[10px] text-white/80 font-medium">{t.chatStatus}</span>
                 </div>
               </div>
             </div>
             <button 
               onClick={() => setIsOpen(false)} 
               className="p-1.5 hover:bg-white/10 rounded-full text-white/80 hover:text-white transition-colors"
             >
               <X className="w-4 h-4" />
             </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
             {messages.map((msg, idx) => (
               <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 
                    ${msg.role === 'user' 
                      ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400' 
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {msg.role === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                  </div>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm
                    ${msg.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-tr-none'
                      : 'bg-white dark:bg-[#1e293b] text-slate-700 dark:text-gray-200 border border-gray-100 dark:border-white/5 rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
               </div>
             ))}
             {isLoading && (
               <div className="flex gap-3">
                 <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0 mt-1">
                   <Sparkles className="w-4 h-4 text-gray-400" />
                 </div>
                 <div className="bg-white dark:bg-[#1e293b] border border-gray-100 dark:border-white/5 px-4 py-3 rounded-2xl rounded-tl-none flex gap-1.5 items-center">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-300"></span>
                 </div>
               </div>
             )}
             <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-gray-50 dark:bg-black/20 border-t border-gray-200 dark:border-white/5">
             <div className="relative flex items-center">
               <input 
                 type="text"
                 value={input}
                 onChange={(e) => setInput(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                 placeholder={t.chatPlaceholder}
                 disabled={isLoading}
                 className="w-full bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-white/10 text-slate-900 dark:text-white text-sm rounded-xl py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder-gray-400"
               />
               <button 
                 onClick={handleSend}
                 disabled={!input.trim() || isLoading}
                 className="absolute right-2 p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors shadow-md shadow-indigo-500/20"
               >
                 <Send className="w-4 h-4" />
               </button>
             </div>
             <p className="text-[10px] text-center text-gray-400 mt-2">
               {t.chatFooter}
             </p>
          </div>

        </div>
      )}

      {/* Floating Trigger Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 z-50
          ${isOpen 
            ? 'bg-gray-800 dark:bg-white text-white dark:text-black rotate-90' 
            : 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:shadow-indigo-500/50'
          }
        `}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-7 h-7" />}
      </button>

    </div>
  );
};