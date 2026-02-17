import { GoogleGenAI } from "@google/genai";

const GEMINI_MODEL = "gemini-2.5-flash-preview-09-2025";

export const generateWish = async (name: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `Buatkan ucapan selamat sidang promosi doktor yang sangat formal, elegan, akademik, dan puitis dari saya (${name}) untuk Ibu Dr. Yusni Nuryani. Maksimal 3 kalimat pendek. Jangan gunakan tanda kutip di awal/akhir.`;
    
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        systemInstruction: "Anda adalah penulis kartu ucapan akademik formal kelas atas. Bahasa sopan, baku, dan menyentuh hati.",
      }
    });

    return response.text || "Selamat atas gelar Doktornya, semoga ilmunya berkah dan bermanfaat.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Selamat sukses atas Sidang Promosi Doktornya. Semoga ilmunya bermanfaat bagi nusa dan bangsa.";
  }
};