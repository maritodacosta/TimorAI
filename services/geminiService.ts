
import { GoogleGenAI, Type } from "@google/genai";
import { ProjectFile, Language, ChatMessage } from "../types";

const MODEL_ROTATION = [
  'gemini-flash-latest',
  'gemini-3-flash-preview', 
  'gemini-2.0-flash-exp', 
  'gemini-2.5-flash-lite-latest'
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
  let lastError: any;
  for (const model of MODEL_ROTATION) {
    try {
      console.log(`[TimorAI] Attempting ${operationName} with model: ${model}`);
      return await fn(model);
    } catch (error: any) {
      lastError = error;
      const status = error?.status || error?.code || 'Unknown';
      console.error(`[TimorAI] Error with ${model}: ${status}`, error);
      
      if (status === 429 || status === 503 || status === 500) {
        await delay(1500);
        continue;
      }
      // If it's a 404 or 401, we try the next model immediately
    }
  }
  throw lastError || new Error("Connection failed after trying all available models.");
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
      }
    });
    const parsed = JSON.parse(response.text.trim());
    return { files: parsed.files, language: currentLanguage };
  });
};

export const chatWithTimorAI = async (message: string, history: ChatMessage[]): Promise<string> => {
  return executeWithSmartFallback('chatWithTimorAI', async (model) => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    
    // Ensure history is alternating and doesn't start with model
    const validHistory = history.filter(h => h.role === 'user' || h.role === 'model');
    
    const chat = ai.chats.create({
      model: model,
      history: validHistory.map(h => ({ 
        role: h.role === 'user' ? 'user' : 'model', 
        parts: [{text: h.text}] 
      })),
      config: { systemInstruction: CHAT_SYSTEM_INSTRUCTION }
    });
    const result = await chat.sendMessage({ message });
    return result.text;
  });
};

export const learnWithTimorAI = async (message: string, language: Language, historyContext: ChatMessage[] = []): Promise<any> => {
  return executeWithSmartFallback('learnWithTimorAI', async (model) => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    
    // Cleanup history to ensure alternating turns (Gemini Requirement)
    const validHistory = [];
    let lastRole = null;
    for (const h of historyContext) {
      const currentRole = h.role === 'user' ? 'user' : 'model';
      if (currentRole !== lastRole) {
        validHistory.push({ role: currentRole, parts: [{ text: h.text }] });
        lastRole = currentRole;
      }
    }

    const response = await ai.models.generateContent({
      model: model,
      contents: { parts: [...validHistory.map(h => h.parts[0]), { text: message }] },
      config: {
        systemInstruction: LEARN_SYSTEM_INSTRUCTION + `\n\n${getLanguageContext(language)}`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            chatResponse: {
              type: Type.STRING,
              description: "A short, encouraging chat response."
            },
            boardContent: {
              type: Type.STRING,
              description: "Detailed knowledge content in Markdown format."
            }
          },
          required: ["chatResponse", "boardContent"]
        }
      },
    });

    const text = response.text.trim();
    try {
      return JSON.parse(text);
    } catch (e) {
      console.warn("[TimorAI] JSON Parse failed, attempting raw recovery", text);
      return {
        chatResponse: "Materi telah diperbarui.",
        boardContent: text
      };
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
