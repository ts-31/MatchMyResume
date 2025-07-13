import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getGeminiInsights(resume, jobDescription) {
  const prompt = `
You are a helpful and concise resume analyzer.

Your task:
1. Give an AI-based match score between 0–100 for how well the resume fits the job description.
2. Provide exactly 2 bullet-point suggestions to improve the resume.

Format:
Match Score: <number>

Suggestions:
- <suggestion 1>
- <suggestion 2>

Only return the output in this exact format. No extra explanation.

Job Description:
${jobDescription}

Resume:
${resume}

Your Response:
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const raw = response?.text?.trim();
    console.log("Gemini raw response:\n", raw);

    // Parse output
    const scoreMatch = raw.match(/Match Score:\s*(\d+)/i);
    const suggestions = raw
      .split("\n")
      .map((line) =>
        line
          .trim()
          .replace(/^[-–—]+\s*/, "- ")
          .replace(/^\-\s*\-+\s*/, "- ")
      )
      .filter((line) => line.startsWith("-"));

    const aiScore = scoreMatch ? parseInt(scoreMatch[1]) : null;
    console.log("Ai Score: ", aiScore);
    console.log("Sugg: ", suggestions);
    return {
      aiScore: aiScore ?? null,
      suggestions: suggestions.length
        ? suggestions
        : ["No suggestions received."],
    };
  } catch (err) {
    console.error("Gemini error:", err.message);
    throw new Error("Failed to get insights from Gemini.");
  }
}
