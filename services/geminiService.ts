
import { GoogleGenAI, Type } from "@google/genai";
import { ProjectFile, Language, ChatMessage } from "../types";

/**
 * Optimized model rotation.
 * 403 errors often happen because of regional restrictions or API key limitations.
 * We rotate through the most stable available models.
 */
const MODEL_ROTATION = [
  'gemini-flash-latest',       // Most stable, high availability
  'gemini-flash-lite-latest',  // Lightweight fallback
  'gemini-3-flash-preview',    // Advanced logic (may require specific permissions)
  'gemini-3-pro-preview'       // Enterprise logic
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
User meminta bantuan belajar. Berikan respon dalam JSON yang berisi jawaban chat pendek dan materi detail untuk papan tulis.
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
  const apiKey = process.env.API_KEY;
  
  if (!apiKey || apiKey === "undefined" || apiKey === "" || apiKey.includes("YOUR_API_KEY")) {
    console.error(`[TimorAI] Critical: API_KEY is missing or invalid.`);
    throw new Error("API Key tidak ditemukan. Harap atur API_KEY di Environment Variables Vercel.");
  }

  let lastError: any;
  let attempt = 0;

  for (const model of MODEL_ROTATION) {
    attempt++;
    try {
      console.log(`[TimorAI] ${operationName} -> Attempting ${model}...`);
      return await fn(model);
    } catch (error: any) {
      lastError = error;
      const status = error?.status || error?.code;
      
      console.error(`[TimorAI] Model ${model} failed with status: ${status}`);

      // 403 Forbidden: The key is valid but doesn't have permission for this model or API
      if (status === 403 || (error.message && error.message.includes("403"))) {
        console.warn(`[TimorAI] 403 PERMISSION_DENIED on ${model}. Checking next model...`);
        // If it's a 403 on the last model, we need to throw a helpful error
        if (attempt === MODEL_ROTATION.length) {
          throw new Error("ERROR 403: API Key Anda tidak memiliki izin. Pastikan 'Generative Language API' sudah diaktifkan di Google Cloud Console atau gunakan API Key baru dari Google AI Studio.");
        }
        continue;
      }

      // 429 Quota Exceeded
      if (status === 429) {
        console.warn(`[TimorAI] 429 Rate Limit hit. Waiting before fallback...`);
        await delay(attempt * 2000);
        continue;
      }

      // If other error, wait a bit and try next model
      await delay(500);
    }
  }

  throw lastError || new Error("Gagal terhubung ke layanan AI. Silakan periksa koneksi internet atau API Key Anda.");
}

export const generateWebsiteCode = async (prompt: string, currentLanguage: Language = 'id'): Promise<any> => {
  return executeWithSmartFallback('generateWebsiteCode', async (model) => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    const response = await ai.models.generateContent({
      model: model,
      contents: `${getLanguageContext(currentLanguage)}\n\nPROMPT: ${prompt}`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });
    const parsed = JSON.parse(response.text.trim());
    return { files: parsed.files, language: parsed.language || currentLanguage };
  });
};

export const refineWebsiteCode = async (currentFiles: ProjectFile[], refinementPrompt: string, currentLanguage: Language = 'id'): Promise<any> => {
  return executeWithSmartFallback('refineWebsiteCode', async (model) => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    const context = currentFiles.map(f => `${f.name}:\n${f.content}`).join('\n\n');
    const response = await ai.models.generateContent({
      model: model,
      contents: `${context}\n\nUPDATE: ${refinementPrompt}`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        temperature: 0.5,
      }
    });
    const parsed = JSON.parse(response.text.trim());
    return { files: parsed.files, language: currentLanguage };
  });
};

export const chatWithTimorAI = async (message: string, history: ChatMessage[]): Promise<string> => {
  return executeWithSmartFallback('chatWithTimorAI', async (model) => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    
    const validHistory = [];
    let expectedRole: 'user' | 'model' = 'user';
    
    for (const h of history) {
      const role = h.role === 'user' ? 'user' : 'model';
      if (role === expectedRole) {
        validHistory.push({ role: role, parts: [{ text: h.text }] });
        expectedRole = expectedRole === 'user' ? 'model' : 'user';
      }
    }

    const chat = ai.chats.create({
      model: model,
      history: validHistory,
      config: { 
        systemInstruction: CHAT_SYSTEM_INSTRUCTION,
        temperature: 0.8
      }
    });
    const result = await chat.sendMessage({ message });
    return result.text;
  });
};

export const learnWithTimorAI = async (message: string, language: Language, historyContext: ChatMessage[] = []): Promise<any> => {
  return executeWithSmartFallback('learnWithTimorAI', async (model) => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    
    const validHistory = [];
    let expectedRole: 'user' | 'model' = 'user';
    for (const h of historyContext) {
      const role = h.role === 'user' ? 'user' : 'model';
      if (role === expectedRole) {
        validHistory.push({ role: role, parts: [{ text: h.text }] });
        expectedRole = expectedRole === 'user' ? 'model' : 'user';
      }
    }

    if (validHistory.length > 0 && validHistory[validHistory.length - 1].role === 'user') {
      validHistory.pop();
    }

    const chat = ai.chats.create({
      model: model,
      history: validHistory,
      config: {
        systemInstruction: LEARN_SYSTEM_INSTRUCTION + `\n\n${getLanguageContext(language)}`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            chatResponse: { type: Type.STRING },
            boardContent: { type: Type.STRING }
          },
          required: ["chatResponse", "boardContent"]
        }
      },
    });

    const result = await chat.sendMessage({ message });
    return JSON.parse(result.text.trim());
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
