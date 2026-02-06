
import { GoogleGenAI } from "@google/genai";
import { ProjectFile, Language, ChatMessage } from "../types";

const MODEL_ROTATION = [
  'gemini-3-flash-preview', 
  'gemini-2.0-flash-exp', 
  'gemini-2.0-flash', 
  'gemini-flash-lite-latest'
];

const SYSTEM_INSTRUCTION = `
Anda adalah TimorAI, Arsitek Digital Utama dari Timor Leste. 
MISI: Menghasilkan website kelas dunia dengan UI/UX modern (Glassmorphism, Tailwind).
FORMAT OUTPUT: RAW JSON ONLY.
`;

const CHAT_SYSTEM_INSTRUCTION = `
You are the official AI Assistant for TimorAI. Keep answers concise. 
Developer: Marito da Costa (Born 1989, Manufahi).
`;

const LEARN_SYSTEM_INSTRUCTION = `
Anda adalah "TimorAI Educator". 
User meminta bantuan belajar. Berikan respon dalam JSON.
"chatResponse": kalimat pendek untuk di bubble chat.
"boardContent": materi detail dalam format Markdown untuk di papan tulis.
PENTING: Hanya balas dengan JSON valid.
`;

const getLanguageContext = (lang: Language) => {
  switch (lang) {
    case 'id': return "Gunakan Bahasa Indonesia profesional.";
    case 'tet': return "Uza Lia-Tetun formál.";
    case 'pt': return "Use Português Europeu padrão.";
    case 'en': return "Use International English.";
    default: return "Use English.";
  }
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function executeWithSmartFallback<T>(
  operationName: string,
  fn: (modelName: string) => Promise<T>
): Promise<T> {
  let lastError: any;
  for (const model of MODEL_ROTATION) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        return await fn(model);
      } catch (error: any) {
        lastError = error;
        const errorCode = error?.status || error?.code;
        if (errorCode === 429 || errorCode === 503) {
          await delay(2000);
          continue;
        }
        break; 
      }
    }
  }
  throw lastError || new Error("System overload.");
}

export const generateWebsiteCode = async (prompt: string, currentLanguage: Language = 'id'): Promise<any> => {
  return executeWithSmartFallback('generateWebsiteCode', async (model) => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: model,
      contents: `${getLanguageContext(currentLanguage)}\n\nPROMPT: ${prompt}`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
      },
    });
    const parsed = JSON.parse(response.text.replace(/```json|```/g, '').trim());
    return { files: parsed.files, language: parsed.language || currentLanguage };
  });
};

export const refineWebsiteCode = async (currentFiles: ProjectFile[], refinementPrompt: string, currentLanguage: Language = 'id'): Promise<any> => {
  return executeWithSmartFallback('refineWebsiteCode', async (model) => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const context = currentFiles.map(f => `${f.name}:\n${f.content}`).join('\n\n');
    const response = await ai.models.generateContent({
      model: model,
      contents: `${context}\n\nUPDATE: ${refinementPrompt}`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
      }
    });
    const parsed = JSON.parse(response.text.replace(/```json|```/g, '').trim());
    return { files: parsed.files, language: currentLanguage };
  });
};

export const chatWithTimorAI = async (message: string, history: ChatMessage[]): Promise<string> => {
  return executeWithSmartFallback('chatWithTimorAI', async (model) => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const chat = ai.chats.create({
      model: model,
      history: history.map(h => ({ role: h.role === 'user' ? 'user' : 'model', parts: [{text: h.text}] })),
      config: { systemInstruction: CHAT_SYSTEM_INSTRUCTION }
    });
    const result = await chat.sendMessage({ message });
    return result.text;
  });
};

export const learnWithTimorAI = async (message: string, language: Language, historyContext: ChatMessage[] = []): Promise<any> => {
  return executeWithSmartFallback('learnWithTimorAI', async (model) => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Fix history to be alternating and valid for Gemini
    const validHistory = historyContext.slice(0, -1).map(h => ({
      role: h.role === 'user' ? 'user' : 'model',
      parts: [{ text: h.text }]
    }));

    const chat = ai.chats.create({
      model: model,
      history: validHistory,
      config: {
        systemInstruction: LEARN_SYSTEM_INSTRUCTION + `\n\n${getLanguageContext(language)}`,
        responseMimeType: "application/json"
      }
    });

    const result = await chat.sendMessage({ message });
    const text = result.text.replace(/```json|```/g, '').trim();
    
    try {
      const parsed = JSON.parse(text);
      return {
        chatResponse: parsed.chatResponse || "Materi sudah siap.",
        boardContent: parsed.boardContent || "Konten tidak ditemukan."
      };
    } catch (e) {
      return { chatResponse: "Maaf, terjadi kesalahan parsing.", boardContent: text };
    }
  });
};

export const bundleFilesForPreview = (files: ProjectFile[]): string => {
    const index = files.find(f => f.name === 'index.html');
    if (!index) return "Error: index.html not found";
    let html = index.content;
    files.filter(f => f.type === 'css').forEach(css => {
        html = html.replace('</head>', `<style>${css.content}</style></head>`);
    });
    files.filter(f => f.type === 'js').forEach(js => {
        html = html.replace('</body>', `<script>${js.content}</script></body>`);
    });
    return html;
};
