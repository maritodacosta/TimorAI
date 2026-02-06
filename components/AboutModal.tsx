import React from 'react';
import { X, Zap, Globe, Shield, Cpu, Code, Heart, Rocket, Users, Target } from 'lucide-react';
import { Language } from '../types';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose, language }) => {
  if (!isOpen) return null;

  const t = {
    id: {
      title: 'Tentang TimorAI',
      subtitle: 'Membangun Masa Depan Digital Timor Leste',
      intro: 'TimorAI bukan sekadar alat pembuat website. Ini adalah gerakan untuk mendemokratisasi akses teknologi bagi setiap warga Timor Leste dan dunia.',
      sections: [
        {
          title: 'Misi Kami',
          desc: 'Kami percaya bahwa coding tidak boleh menjadi penghalang kreativitas. Misi kami adalah memberdayakan startup, pelajar, dan pengusaha di Timor Leste untuk membangun kehadiran digital kelas dunia dalam hitungan detik, tanpa hambatan teknis.',
          icon: Target,
          color: 'text-rose-500',
          bg: 'bg-rose-500/10'
        },
        {
          title: 'Teknologi Gemini 3.0',
          desc: 'Dibangun di atas fondasi Google Gemini 3.0 API terbaru. Kami memanfaatkan kemampuan penalaran canggih (advanced reasoning) untuk mengubah instruksi bahasa alami menjadi kode produksi yang bersih, aman, modern, dan responsif.',
          icon: Cpu,
          color: 'text-indigo-500',
          bg: 'bg-indigo-500/10'
        },
        {
          title: 'Untuk Timor Leste',
          desc: 'TimorAI didedikasikan untuk menutup kesenjangan digital. Kami menyediakan akses teknologi Enterprise secara gratis/terjangkau bagi talenta lokal agar mampu bersaing di panggung ekonomi digital global.',
          icon: Globe,
          color: 'text-emerald-500',
          bg: 'bg-emerald-500/10'
        }
      ],
      footer: 'Dikembangkan dengan bangga oleh Marito da Costa.'
    },
    en: {
      title: 'About TimorAI',
      subtitle: 'Building Timor Leste\'s Digital Future',
      intro: 'TimorAI is more than just a website builder. It is a movement to democratize technology access for every citizen of Timor Leste and the world.',
      sections: [
        {
          title: 'Our Mission',
          desc: 'We believe coding shouldn\'t be a barrier to creativity. Our mission is to empower startups, students, and entrepreneurs in Timor Leste to build world-class digital presence in seconds, removing technical hurdles.',
          icon: Target,
          color: 'text-rose-500',
          bg: 'bg-rose-500/10'
        },
        {
          title: 'Gemini 3.0 Technology',
          desc: 'Built on the latest Google Gemini 3.0 API foundation. We utilize advanced reasoning capabilities to transform natural language instructions into clean, secure, modern, and responsive production code.',
          icon: Cpu,
          color: 'text-indigo-500',
          bg: 'bg-indigo-500/10'
        },
        {
          title: 'For Timor Leste',
          desc: 'TimorAI is dedicated to bridging the digital divide. We provide access to Enterprise-grade technology for local talents to enabling them to compete effectively on the global digital economy stage.',
          icon: Globe,
          color: 'text-emerald-500',
          bg: 'bg-emerald-500/10'
        }
      ],
      footer: 'Proudly engineered by Marito da Costa.'
    },
    tet: {
      title: 'Kona-ba TimorAI',
      subtitle: 'Hari\'i Futuru Dijitál Timor-Leste',
      intro: 'TimorAI la\'ós de\'it ferramenta atu halo website. Ne\'e mak movimentu atu demokratiza asesu teknolojia ba sidadaun hotu iha Timor-Leste no mundu.',
      sections: [
        {
          title: 'Ami-nia Misaun',
          desc: 'Ami fiar katak koding labele sai obstákulu ba kreatividade. Ami-nia misaun mak atu fó kbiit ba startup, estudante, no emprezáriu sira iha Timor-Leste atu hari\'i prezensa dijitál klase mundiál iha segundu balun.',
          icon: Target,
          color: 'text-rose-500',
          bg: 'bg-rose-500/10'
        },
        {
          title: 'Teknolojia Gemini 3.0',
          desc: 'Hari\'i ho fundasaun API Google Gemini 3.0 foun liu. Ami uza kapasidade rasiosíniu avansadu atu transforma instrusaun lian naturál ba kódigu produsaun ne\'ebé moos, seguru, modernu no responsivu.',
          icon: Cpu,
          color: 'text-indigo-500',
          bg: 'bg-indigo-500/10'
        },
        {
          title: 'Ba Timor-Leste',
          desc: 'TimorAI dedika an atu hamenus gap dijitál. Ami fornese asesu teknolojia nivel Enterprise ba talentu lokál sira atu sira bele kompete ho di\'ak iha ekonomia dijitál globál.',
          icon: Globe,
          color: 'text-emerald-500',
          bg: 'bg-emerald-500/10'
        }
      ],
      footer: 'Dezenvolve ho orgulhu husi Marito da Costa.'
    },
    pt: {
      title: 'Sobre a TimorAI',
      subtitle: 'Construindo o Futuro Digital de Timor-Leste',
      intro: 'A TimorAI é mais do que apenas um construtor de sites. É um movimento para democratizar o acesso à tecnologia para todos os cidadãos de Timor-Leste e do mundo.',
      sections: [
        {
          title: 'A Nossa Missão',
          desc: 'Acreditamos que a programação não deve ser uma barreira à criatividade. A nossa missão é capacitar startups, estudantes e empresários em Timor-Leste a construir uma presença digital de classe mundial em segundos.',
          icon: Target,
          color: 'text-rose-500',
          bg: 'bg-rose-500/10'
        },
        {
          title: 'Tecnologia Gemini 3.0',
          desc: 'Construído sobre a fundação da mais recente API Google Gemini 3.0. Utilizamos capacidades de raciocínio avançadas para transformar instruções de linguagem natural em código de produção limpo e seguro.',
          icon: Cpu,
          color: 'text-indigo-500',
          bg: 'bg-indigo-500/10'
        },
        {
          title: 'Para Timor-Leste',
          desc: 'A TimorAI dedica-se a colmatar o fosso digital. Fornecemos acesso a tecnologia de nível empresarial para que os talentos locais possam competir eficazmente na economia digital global.',
          icon: Globe,
          color: 'text-emerald-500',
          bg: 'bg-emerald-500/10'
        }
      ],
      footer: 'Orgulhosamente desenvolvido por Marito da Costa.'
    }
  };

  const content = t[language] || t.en;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-white/10 rounded-3xl shadow-2xl w-full max-w-4xl relative overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
        
        {/* Background Decor - Expanded for larger modal */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>

        {/* Header Section */}
        <div className="p-8 border-b border-gray-100 dark:border-white/5 relative z-10 flex justify-between items-start bg-gray-50/50 dark:bg-white/5 backdrop-blur-sm">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
               <div className="p-2 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-lg shadow-lg shadow-indigo-500/20">
                 <Code className="w-6 h-6 text-white" />
               </div>
               <span className="text-xs font-bold px-3 py-1 rounded-full bg-white dark:bg-white/10 text-slate-700 dark:text-white border border-gray-200 dark:border-white/20 shadow-sm uppercase tracking-wider">
                 v2.0 Enterprise Edition
               </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 dark:text-white tracking-tight mb-2">
              {content.title}
            </h2>
            <p className="text-lg text-indigo-600 dark:text-indigo-400 font-medium">
              {content.subtitle}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2.5 bg-white dark:bg-white/10 hover:bg-gray-100 dark:hover:bg-white/20 rounded-full transition-colors text-slate-500 dark:text-slate-400 shadow-sm border border-gray-200 dark:border-white/10"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto relative z-10">
          
          {/* Intro Banner */}
          <div className="px-8 pt-8 pb-4">
            <p className="text-xl sm:text-2xl text-slate-600 dark:text-slate-300 font-light leading-relaxed border-l-4 border-indigo-500 pl-6">
              {content.intro}
            </p>
          </div>

          {/* Cards Grid */}
          <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {content.sections.map((section, idx) => (
              <div key={idx} className="flex flex-col h-full p-6 rounded-2xl bg-gray-50/80 dark:bg-white/5 border border-gray-100 dark:border-white/5 hover:border-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 group">
                <div className={`w-14 h-14 rounded-2xl ${section.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <section.icon className={`w-7 h-7 ${section.color}`} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{section.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed flex-1">
                  {section.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-[#020617] text-center relative z-10">
           <div className="flex items-center justify-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
             <span>{content.footer}</span>
             <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
           </div>
        </div>

      </div>
    </div>
  );
};