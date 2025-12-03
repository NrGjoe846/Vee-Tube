import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Initialize client securely - assuming process.env.API_KEY is available in the build environment
let aiClient: GoogleGenAI | null = null;

try {
  if (apiKey) {
    aiClient = new GoogleGenAI({ apiKey });
  } else {
    console.warn("Gemini API Key is missing. AI features will be disabled.");
  }
} catch (error) {
  console.error("Failed to initialize Gemini Client", error);
}

export const generateMovieInsight = async (movieTitle: string): Promise<string> => {
  if (!aiClient) return "AI Insights unavailable (No API Key).";

  try {
    const response = await aiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Write a short, catchy, 2-sentence "Why you should watch this" hook for a movie titled "${movieTitle}". Make it sound exciting like a streaming platform promotion.`,
    });
    
    return response.text || "Discover a world of entertainment with this title.";
  } catch (error) {
    console.error("Error generating insight:", error);
    return "Experience the drama and excitement of this critically acclaimed title.";
  }
};

export const getSmartRecommendations = async (currentMovie: string): Promise<string[]> => {
    if (!aiClient) return ["Action", "Adventure", "Sci-Fi"]; // Fallback

    try {
        const response = await aiClient.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Given the movie "${currentMovie}", suggest 3 related sub-genres or themes to explore next. Return only the 3 words/phrases separated by commas.`,
        });
        const text = response.text || "";
        return text.split(',').map(s => s.trim()).slice(0, 3);
    } catch (e) {
        return ["Trending", "Popular", "Must Watch"];
    }
}