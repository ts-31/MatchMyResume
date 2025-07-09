import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getGeminiSuggestions(resume, jobDescription) {
  const prompt =
    `System: You are a helpful resume assistant.\n` +
    `User: Here's my job description:\n${jobDescription}\n` +
    `User: Here's my resume:\n${resume}\n` +
    `Assistant: Suggest 2 improvements:`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  return response.text.split("\n").filter(Boolean);
}
