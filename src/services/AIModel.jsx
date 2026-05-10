import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

export async function generateItinerary(PROMPT) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: PROMPT,  // ✅ use the parameter, not the imported template
  });

  const textResponse = response.text;

  console.log("Generated response:", textResponse);

  return textResponse;
}