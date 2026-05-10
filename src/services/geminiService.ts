import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const getGeminiResponse = async (userMessage: string, chatHistory: { role: 'user' | 'assistant', content: string }[]) => {
  try {
    const formattedHistory = chatHistory.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        ...formattedHistory,
        { role: 'user', parts: [{ text: userMessage }] }
      ],
      config: {
        systemInstruction: "Anda adalah asisten AI pintar untuk 'Smart Queue', sebuah aplikasi manajemen antrean. Tugas Anda adalah membantu pengguna dengan informasi terkait antrean, cara menggunakan aplikasi, dan menjawab pertanyaan umum dengan ramah dan profesional dalam Bahasa Indonesia. PENTING: Jangan gunakan format markdown seperti tanda bintang (**) untuk menebalkan teks. Berikan jawaban dalam teks biasa yang bersih.",
      }
    });

    return response.text || "Maaf, saya tidak bisa merespon saat ini.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Maaf, terjadi kesalahan pada sistem AI kami.";
  }
};
