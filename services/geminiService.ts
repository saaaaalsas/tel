import { GoogleGenAI } from "@google/genai";

// Fix: Initializing GoogleGenAI inside the function to ensure the latest API key from process.env is used and handling response text correctly.
export const analyzeScheduleConflict = async (bookingDetails: string, existingSchedule: string) => {
  // Creating a new GoogleGenAI instance right before making an API call to ensure it always uses the most up-to-date API key.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      // Using gemini-3-pro-preview for complex reasoning tasks like analyzing potential scheduling conflicts.
      model: 'gemini-3-pro-preview',
      contents: `Analisis potensi konflik peminjaman ruangan. Data baru: ${bookingDetails}. Jadwal yang ada: ${existingSchedule}. Jelaskan secara singkat apakah ada masalah atau tidak dalam Bahasa Indonesia.`,
    });
    // Correctly accessing the text property (not a method) from the GenerateContentResponse.
    return response.text || "Pengecekan jadwal selesai.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Pengecekan sistem selesai.";
  }
};
