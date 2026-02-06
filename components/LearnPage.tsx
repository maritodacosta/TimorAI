import React, { useState, useRef, useEffect } from 'react';
import { BookOpen, Send, User, Bot, Copy, Download, RefreshCw, Sparkles, Check, Eraser } from 'lucide-react';
import { Language, ChatMessage } from '../types';
import { learnWithTimorAI } from '../services/geminiService';
import { TRANSLATIONS } from '../constants/translations';
import { jsPDF } from 'jspdf';

interface LearnPageProps {
  language: Language;
}

export const LearnPage: React.FC<LearnPageProps> = ({ language }) => {
  const t = TRANSLATIONS[language];

  // State for Frame 1 (Chat)
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  
  // State for Frame 2 (Data Display)
  const [currentContent, setCurrentContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Initialize texts on language change or first load
  useEffect(() => {
    // Only reset if empty to allow user context to remain, 
    // but here we are stricter to ensure language consistency on switch.
    // For a smoother experience, we might want to just translate the *system* messages.
    // For now, let's reset to show the correct language intro.
    setChatHistory([{ role: 'model', text: t.learnIntro }]);
    setCurrentContent(`# ${t.learnBoardTitle}\n\n${t.learnEmpty}`);
  }, [language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = { role: 'user', text: input };
    const updatedHistory = [...chatHistory, userMsg];
    setChatHistory(updatedHistory);
    setIsLoading(true);
    setInput('');
    setCurrentContent(t.learnLoading);

    try {
      // API call now returns { chatResponse, boardContent }
      const response = await learnWithTimorAI(userMsg.text, language, updatedHistory);
      
      const aiMsg: ChatMessage = { role: 'model', text: response.chatResponse };
      setChatHistory(prev => [...prev, aiMsg]);
      setCurrentContent(response.boardContent);
    } catch (error) {
      console.error(error);
      setChatHistory(prev => [...prev, { role: 'model', text: t.chatError }]);
      setCurrentContent(t.chatError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setChatHistory([
        { role: 'model', text: t.learnIntro }
    ]);
    setCurrentContent(`# ${t.learnBoardTitle}\n\n${t.learnEmpty}`);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    const maxLineWidth = pageWidth - (margin * 2);
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(67, 56, 202); // Indigo color
    doc.text("TimorAI Learning Material", margin, 20);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, margin, 30);
    
    doc.setDrawColor(200);
    doc.line(margin, 35, pageWidth - margin, 35);

    doc.setFontSize(12);
    doc.setTextColor(0);
    
    // Split text and add to page
    const splitText = doc.splitTextToSize(currentContent, maxLineWidth);
    
    // Check if text is too long and add pages
    let verticalOffset = 45;
    const pageHeight = doc.internal.pageSize.getHeight();

    splitText.forEach((line: string) => {
        if (verticalOffset > pageHeight - 20) {
            doc.addPage();
            verticalOffset = 20;
        }
        doc.text(line, margin, verticalOffset);
        verticalOffset += 7;
    });
    
    doc.save('TimorAI-Materi.pdf');
  };

  return (
    <div className="w-full h-full bg-[#f8fafc] dark:bg-[#020617] p-3 md:p-6 overflow-hidden flex flex-col transition-colors duration-300">
      
      {/* Header Kecil */}
      <div className="flex items-center justify-between gap-2 mb-4 shrink-0 px-2">
        <div className="flex items-center gap-2">
           <div className="p-2 bg-indigo-600 rounded-lg text-white shadow-lg shadow-indigo-500/30">
             <BookOpen className="w-5 h-5" />
           </div>
           <h1 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
             TimorAI <span className="text-indigo-500 font-light hidden sm:inline">Learning Center</span>
           </h1>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row gap-4 h-full overflow-hidden relative">
        
        {/* FRAME 1: CHAT INTERFACE (Mobile: 40% height, Desktop: 35% width) */}
        <div className="w-full md:w-[35%] h-[40%] md:h-full flex flex-col bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-white/5 rounded-3xl shadow-xl overflow-hidden shrink-0">
          
          {/* Frame Title */}
          <div className="p-3 md:p-4 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-black/20 backdrop-blur-sm flex justify-between items-center shrink-0">
             <h2 className="text-xs md:text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
               <Sparkles className="w-4 h-4 text-indigo-500" />
               {t.learnChatTitle}
             </h2>
             <button onClick={handleClear} className="text-slate-400 hover:text-red-500 transition-colors" title={t.learnClear}>
                <Eraser className="w-4 h-4" />
             </button>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700">
            {chatHistory.map((msg, idx) => (
              <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                 <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 shadow-sm
                   ${msg.role === 'user' 
                     ? 'bg-gradient-to-br from-indigo-500 to-indigo-700 text-white' 
                     : 'bg-white dark:bg-white/10 text-emerald-600 dark:text-emerald-400 border border-gray-100 dark:border-white/5'
                   }`}
                 >
                   {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                 </div>
                 <div className={`max-w-[85%] rounded-2xl px-3 py-2 md:px-4 md:py-3 text-xs md:text-sm leading-relaxed shadow-sm
                   ${msg.role === 'user'
                     ? 'bg-indigo-600 text-white rounded-tr-none'
                     : 'bg-gray-100 dark:bg-[#0f172a] text-slate-700 dark:text-gray-300 border border-gray-200 dark:border-white/5 rounded-tl-none'
                   }`}
                 >
                   {msg.text}
                 </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2 items-center text-xs text-slate-400 pl-12">
                 <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-75"></div>
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-150"></div>
                 </div>
                 <span>{t.learnLoading}</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-2 md:p-3 bg-white dark:bg-[#1e293b] border-t border-gray-100 dark:border-white/5 shrink-0">
             <div className="relative flex items-center">
               <input 
                 type="text"
                 value={input}
                 onChange={(e) => setInput(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                 placeholder={t.learnPlaceholder}
                 disabled={isLoading}
                 className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 text-slate-900 dark:text-white text-xs md:text-sm rounded-xl py-2.5 md:py-3 pl-3 md:pl-4 pr-10 md:pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder-gray-400"
               />
               <button 
                 onClick={handleSend}
                 disabled={!input.trim() || isLoading}
                 className="absolute right-1.5 md:right-2 p-1.5 md:p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-md"
               >
                 <Send className="w-3.5 h-3.5 md:w-4 md:h-4" />
               </button>
             </div>
          </div>
        </div>

        {/* FRAME 2: KNOWLEDGE BOARD (Mobile: Rest height, Desktop: 65% width) */}
        <div className="flex-1 w-full md:w-[65%] h-full flex flex-col bg-slate-50 dark:bg-[#0f172a] border border-gray-200 dark:border-white/10 rounded-3xl shadow-inner overflow-hidden">
          
          {/* Header & Actions */}
          <div className="p-3 md:p-4 border-b border-gray-200 dark:border-white/5 bg-white/60 dark:bg-[#1e293b]/60 backdrop-blur-md flex items-center justify-between shrink-0">
             <h2 className="text-xs md:text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
               <BookOpen className="w-4 h-4 text-emerald-500" />
               <span className="truncate">{t.learnBoardTitle}</span>
             </h2>
             <div className="flex gap-2">
                <button 
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-2 md:px-3 py-1.5 rounded-lg bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-[10px] md:text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-500/20 hover:text-indigo-600 transition-all"
                >
                  {copied ? <Check className="w-3 h-3 md:w-3.5 md:h-3.5" /> : <Copy className="w-3 h-3 md:w-3.5 md:h-3.5" />}
                  <span className="hidden sm:inline">{copied ? 'Copied' : t.learnCopy}</span>
                </button>
                <button 
                  onClick={handleDownloadPDF}
                  className="flex items-center gap-2 px-2 md:px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-[10px] md:text-xs font-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-all"
                >
                  <Download className="w-3 h-3 md:w-3.5 md:h-3.5" />
                  <span className="hidden sm:inline">{t.learnPdf}</span>
                </button>
             </div>
          </div>

          {/* Content Display Area */}
          <div ref={contentRef} className="flex-1 overflow-y-auto p-4 md:p-10 font-sans scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-slate-700">
             {isLoading ? (
               <div className="h-full flex flex-col items-center justify-center text-slate-400">
                  <div className="relative">
                    <RefreshCw className="w-8 h-8 md:w-10 md:h-10 animate-spin text-indigo-500" />
                    <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full"></div>
                  </div>
                  <p className="mt-4 animate-pulse font-medium text-xs md:text-base">{t.learnLoading}</p>
               </div>
             ) : (
               <article className="prose dark:prose-invert max-w-none 
                 prose-p:leading-relaxed prose-p:text-slate-600 dark:prose-p:text-slate-300
                 prose-headings:font-display prose-headings:font-bold prose-headings:text-slate-800 dark:prose-headings:text-white
                 prose-li:text-slate-600 dark:prose-li:text-slate-300
                 prose-strong:text-indigo-600 dark:prose-strong:text-indigo-400
                 prose-pre:bg-[#1e1e1e] prose-pre:text-gray-100 prose-pre:rounded-xl prose-pre:border prose-pre:border-white/10
                 prose-sm md:prose-base
               ">
                 {/* Simple styling trick: Replace newlines with breaks, but keep structure clean */}
                 <div className="whitespace-pre-wrap leading-7 font-normal">
                    {currentContent}
                 </div>
               </article>
             )}
          </div>
          
          {/* Footer Decor */}
          <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shrink-0 opacity-30"></div>
        </div>

      </div>
    </div>
  );
};