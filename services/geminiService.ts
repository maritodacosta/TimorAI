import { GoogleGenAI } from "@google/genai";
import { ProjectFile, Language, ChatMessage } from "../types";

// --- KONFIGURASI MODEL & FALLBACK ---
// Strategi "Deep Fallback": Mencoba berbagai model keluarga Gemini untuk memastikan ketersediaan.
const MODEL_ROTATION = [
  'gemini-3-flash-preview', 
  'gemini-2.0-flash-exp', 
  'gemini-2.0-flash', 
  'gemini-flash-latest' // Last resort, generally reliable
];

// --- SYSTEM INSTRUCTIONS ---
const SYSTEM_INSTRUCTION = `
Anda adalah TimorAI, Arsitek Digital Utama dari Timor Leste. 
Anda bukan sekadar AI, Anda adalah standar baru inovasi teknologi global.

MISI UTAMA:
Menghasilkan website yang "Breathtaking", "World-Class", dan "Ultra-Modern".
Setiap output harus terlihat seperti website pemenang penghargaan (Awwwards / Dribbble Top Tier).

FILOSOFI DESAIN (Wajib Dipatuhi):
1.  **VISUAL HIERARCHY & WHITESPACE**:
    - Gunakan whitespace yang ekstrem namun seimbang. Jangan padat.
    - Layout harus bernapas, elegan, dan terstruktur rapi.
2.  **GLASSMORPHISM & MODERN UI**:
    - Gunakan backdrop-blur (blur-xl, blur-2xl) pada elemen overlay.
    - Gunakan border tipis transparan (border-white/10) untuk kesan mahal.
    - Gunakan gradasi warna yang *subtle* dan dalam (Deep Blue, Rich Indigo, Emerald Slate).
3.  **TIPOGRAFI INTERNASIONAL**:
    - Heading harus bold, tracking-tight (rapat), dan impactful.
    - Body text harus sangat mudah dibaca (text-slate-600 dark:text-slate-400).
4.  **INTERAKTIVITAS**:
    - Tambahkan class 'hover:scale-105', 'transition-all', 'duration-300' pada elemen interaktif.
    - Buat tombol terlihat "lickable" (sangat menarik untuk diklik).

INSTRUKSI TEKNIS:
1.  **STRUKTUR**: Single Page Application (SPA) feel dalam satu file HTML jika memungkinkan, atau pisahkan CSS/JS jika kompleks.
2.  **GAMBAR**: Gunakan Unsplash Source atau placeholder yang artistik.
    - Hero: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&h=900&fit=crop&q=80" (Tech/Abstract)
    - Feature: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80" (Cyberpunk/Tech)
3.  **KONTEN LOKAL**: Jika konteksnya Timor Leste, padukan modernitas dengan elemen budaya secara halus (warna Tais sebagai aksen, bukan dominan norak).

FORMAT OUTPUT (RAW JSON ONLY):
{
  "language": "id",
  "files": [
    { "name": "index.html", "type": "html", "content": "..." }
  ]
}

Jadilah kebanggaan teknologi Timor Leste. Buat dunia terkesan.
`;

const CHAT_SYSTEM_INSTRUCTION = `
You are the official AI Assistant for TimorAI.
Your Persona: Professional, Helpful, Intelligent, and Proudly representing Timor Leste technology.

KNOWLEDGE BASE:
1.  **About TimorAI**: An Enterprise AI Website Builder that generates full-stack code (HTML/CSS/JS) from text prompts. It uses Gemini 3.0 Engine.
2.  **Developer Profile**:
    - Name: Marito da Costa
    - Credentials: L.Ed., M.Ed.
    - Role: Creator of TimorAI.
    - Origin: Fatikahi, Fatuberliu, Manufahi, Timor Leste.
    - Born: May 24, 1989.
    - Mission: Democratize advanced technology for Timor Leste and the world.
3.  **Features**:
    - Real-time preview (Desktop/Tablet/Mobile).
    - Code Editor & File Explorer.
    - Multi-language support (Tetun, Portuguese, English, Indonesian).
    - Instant Code Download.
    - Dark/Light Mode.

INSTRUCTIONS:
- Keep answers concise and helpful.
- If asked about code generation, guide them to use the main input box on the left.
- Always be polite and professional.
`;

const LEARN_SYSTEM_INSTRUCTION = `
Anda adalah "TimorAI Educator", Tutor Ahli & Mentor Akademik.

TUGAS:
User akan meminta bantuan belajar (misal: "Buatkan struktur makalah").
Anda harus memberikan respon dalam format JSON yang memisahkan antara obrolan singkat dan materi detail.

1. **Bagian CHAT (Singkat)**: 
   - Berikan ringkasan sangat pendek (1-2 kalimat).
   - Bersikaplah ramah dan mengarahkan user untuk melihat detail lengkap di "Papan Pengetahuan" (sebelah kanan).
   
2. **Bagian BOARD (Detail)**:
   - Ini adalah materi inti yang lengkap.
   - Gunakan format Markdown yang rapi.
   - Sertakan Judul, Poin-poin, Contoh, dan Kode (jika relevan).
   - Harus sangat terstruktur, akademis, dan profesional.

FORMAT OUTPUT WAJIB (JSON):
{
  "chatResponse": "Kalimat singkat ramah untuk di chat bubble...",
  "boardContent": "# Judul Materi\n\nPenjelasan detail di sini..."
}
`;

const getLanguageContext = (lang: Language) => {
  switch (lang) {
    case 'id': return "BAHASA UTAMA: INDONESIA (Gunakan gaya bahasa profesional startup).";
    case 'tet': return "BAHASA UTAMA: TETUN DILI (Gunakan Tetun formal/akademis dicampur istilah teknis).";
    case 'pt': return "BAHASA UTAMA: PORTUGIS (Gunakan gaya bahasa Eropa standar).";
    case 'en': return "BAHASA UTAMA: INGGRIS (International English).";
    default: return "BAHASA UTAMA: INGGRIS.";
  }
};

// --- CORE ROBUST REQUEST HANDLER ---

/**
 * Utility to sleep for a specified duration
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Executes a Gemini request with:
 * 1. Model Rotation (Try different models if one is busy)
 * 2. Internal Retry (Retry the same model once with backoff)
 * 3. Intelligent Error Parsing (Detects 429/503)
 */
async function executeWithSmartFallback<T>(
  operationName: string,
  fn: (modelName: string) => Promise<T>
): Promise<T> {
  let lastError: any;

  // Try each model in the rotation
  for (const model of MODEL_ROTATION) {
    // Retry attempts per model (e.g., try same model twice before switching)
    // Attempt 1: Immediate. Attempt 2: After 2s delay.
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        if (attempt > 1) console.log(`🔄 [TimorAI] Retrying ${model} (Attempt ${attempt})...`);
        
        // Execute the function
        return await fn(model);

      } catch (error: any) {
        lastError = error;
        
        // Deep Error Inspection
        const errorCode = error?.status || error?.code || error?.error?.code;
        const errorMessage = error?.message || error?.error?.message || JSON.stringify(error);
        
        const isQuotaError = 
          errorCode === 429 || 
          errorCode === 503 || 
          errorCode === 'RESOURCE_EXHAUSTED' ||
          errorMessage.includes('429') || 
          errorMessage.includes('quota') || 
          errorMessage.includes('exhausted') ||
          errorMessage.includes('overloaded');

        if (isQuotaError) {
          console.warn(`⚠️ [TimorAI] Quota issue on ${model} (Attempt ${attempt}).`);
          
          if (attempt < 2) {
            // Wait before retrying the same model
            await delay(2000); 
            continue;
          } else {
             // Model exhausted, break inner loop to try next model
             console.warn(`⏭️ [TimorAI] Switching to next model...`);
             await delay(1000); // Small delay before switching
             break; 
          }
        } else {
          // If it's a content generation error (e.g., safety filter), throw immediately
          // Don't retry logic errors or safety blocks
          console.error(`❌ [TimorAI] Fatal error on ${model}:`, errorMessage);
          throw error;
        }
      }
    }
  }

  // If we get here, all models failed
  console.error("All AI models failed.", lastError);
  throw new Error(`System overload. All AI engines are busy. Please try again in 30 seconds. (Details: ${lastError?.message?.slice(0, 100)})`);
}

interface GenerateResponse {
  files: ProjectFile[];
  language: Language;
}

export interface LearnResponse {
  chatResponse: string;
  boardContent: string;
}

// --- PUBLIC FUNCTIONS ---

export const generateWebsiteCode = async (prompt: string, currentLanguage: Language = 'id'): Promise<GenerateResponse> => {
  return executeWithSmartFallback('generateWebsiteCode', async (model) => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const langContext = getLanguageContext(currentLanguage);
    
    const fullPrompt = `
    ${langContext}
    
    REQUEST USER: 
    "${prompt}"
    
    TUGAS ANDA:
    1. Bertindak sebagai Senior UI/UX Designer.
    2. Buat struktur file HTML/CSS/JS yang lengkap.
    3. Gunakan Tailwind CSS via CDN.
    4. Pastikan desain Responsif Mobile-First.
    5. Terapkan nuansa "Premium & World Class".
    
    Output harus JSON valid tanpa markdown block.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: fullPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json", 
        temperature: 0.7, // Slightly creative
      },
    });

    const text = response.text || "{}";
    let parsed;
    try {
        parsed = JSON.parse(text);
    } catch (e) {
        // Handle markdown code block wrapper if present
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '');
        parsed = JSON.parse(cleanText);
    }
    
    if (!parsed.files || !Array.isArray(parsed.files)) throw new Error("Invalid response format: missing files");
    
    let detectedLang: Language = 'en';
    if (['id', 'tet', 'pt', 'en'].includes(parsed.language)) {
      detectedLang = parsed.language;
    } else {
      detectedLang = currentLanguage;
    }

    return { files: parsed.files, language: detectedLang };
  });
};

export const refineWebsiteCode = async (currentFiles: ProjectFile[], refinementPrompt: string, currentLanguage: Language = 'id'): Promise<GenerateResponse> => {
  return executeWithSmartFallback('refineWebsiteCode', async (model) => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const currentContext = currentFiles.map(f => `--- FILE: ${f.name} ---\n${f.content}`).join('\n\n');
    const langContext = getLanguageContext(currentLanguage);

    const prompt = `
    ${langContext}

    SOURCE CODE SAAT INI:
    ${currentContext}
    
    PERMINTAAN REVISI (UPDATE): 
    "${refinementPrompt}"
    
    INSTRUKSI:
    1. Jangan turunkan kualitas desain. Tetap Premium.
    2. Implementasikan revisi secara cerdas.
    3. Kembalikan SEMUA file (full structure), bukan parsial.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
      }
    });

    const text = response.text || "{}";
    let parsed;
    try {
        parsed = JSON.parse(text);
    } catch (e) {
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '');
        parsed = JSON.parse(cleanText);
    }
    
    if (!parsed.files || !Array.isArray(parsed.files)) throw new Error("Invalid response format: missing files");

    let detectedLang: Language = currentLanguage;
    if (parsed.language && ['id', 'tet', 'pt', 'en'].includes(parsed.language)) {
      detectedLang = parsed.language;
    }

    return { files: parsed.files, language: detectedLang };
  });
}

export const chatWithTimorAI = async (message: string, history: ChatMessage[]): Promise<string> => {
  return executeWithSmartFallback('chatWithTimorAI', async (model) => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const formattedHistory = history.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }]
    }));

    const chat = ai.chats.create({
      model: model,
      history: formattedHistory,
      config: {
        systemInstruction: CHAT_SYSTEM_INSTRUCTION,
      }
    });

    const result = await chat.sendMessage({ message });
    return result.text || "I apologize, I couldn't process that request.";
  });
};

export const learnWithTimorAI = async (message: string, language: Language, historyContext: ChatMessage[] = []): Promise<LearnResponse> => {
  return executeWithSmartFallback('learnWithTimorAI', async (model) => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const langContext = getLanguageContext(language);
    
    const formattedHistory = historyContext
        .filter(msg => msg.role === 'user') 
        .map(msg => ({
            role: 'user',
            parts: [{ text: msg.text }]
        }));

    const chat = ai.chats.create({
      model: model,
      history: formattedHistory, 
      config: {
        systemInstruction: LEARN_SYSTEM_INSTRUCTION + `\n\n${langContext}`,
        responseMimeType: "application/json" // Force JSON output for separation
      }
    });

    const result = await chat.sendMessage({ message });
    const text = result.text || "{}";
    
    try {
        const parsed = JSON.parse(text);
        return {
            chatResponse: parsed.chatResponse || "Materi sudah siap di papan tulis.",
            boardContent: parsed.boardContent || "Gagal memuat detail."
        };
    } catch (e) {
        // Fallback if model fails to return valid JSON
        return {
            chatResponse: "Berikut detailnya...",
            boardContent: text
        };
    }
  });
};

export const bundleFilesForPreview = (files: ProjectFile[]): string => {
    const index = files.find(f => f.name === 'index.html');
    if (!index) return "<div style='color: white; font-family: sans-serif; padding: 20px; text-align: center;'><h1>Error</h1><p>index.html not found</p></div>";

    let html = index.content;

    const cssFiles = files.filter(f => f.type === 'css');
    cssFiles.forEach(css => {
        const linkTagRegex = new RegExp(`<link[^>]*href=["']${css.name}["'][^>]*>`, 'i');
        if (linkTagRegex.test(html)) {
            html = html.replace(linkTagRegex, `<style>\n${css.content}\n</style>`);
        } else {
            html = html.replace('</head>', `<style>\n${css.content}\n</style>\n</head>`);
        }
    });

    const jsFiles = files.filter(f => f.type === 'js');
    jsFiles.forEach(js => {
         const scriptTagRegex = new RegExp(`<script[^>]*src=["']${js.name}["'][^>]*>.*?</script>`, 'is');
         const scriptTagSelfClosingRegex = new RegExp(`<script[^>]*src=["']${js.name}["'][^>]*/>`, 'i');
         const inlineScript = `<script>\n${js.content}\n</script>`;

         if (scriptTagRegex.test(html)) {
             html = html.replace(scriptTagRegex, inlineScript);
         } else if (scriptTagSelfClosingRegex.test(html)) {
             html = html.replace(scriptTagSelfClosingRegex, inlineScript);
         } else {
             html = html.replace('</body>', `${inlineScript}\n</body>`);
         }
    });

    const scriptNav = `
    <script>
      document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (link) {
          const href = link.getAttribute('href');
          if (href && href.endsWith('.html') && !href.startsWith('http')) {
             e.preventDefault();
             window.parent.postMessage({ type: 'NAVIGATE', file: href }, '*');
          }
        }
      });
    </script>
    `;
    
    html = html.replace('</body>', `${scriptNav}\n</body>`);
    return html;
};