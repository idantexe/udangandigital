import { GoogleGenAI } from "@google/genai";

export const generateWish = async (name: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `Buatkan ucapan selamat sidang promosi doktor yang sangat formal, elegan, akademik, dan puitis dari saya (${name}) untuk Ibu Dr. Yusni Nuryani. Maksimal 2 kalimat.`;
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview", 
      contents: prompt,
      config: {
        systemInstruction: "Anda adalah penulis kartu ucapan akademik formal kelas atas untuk universitas.",
      }
    });

    return response.text || "Selamat dan sukses atas pencapaian gelar Doktor.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Selamat atas Sidang Promosi Doktor ini. Semoga ilmunya berkah dan bermanfaat.";
  }
};