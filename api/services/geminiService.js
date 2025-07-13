import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getGeminiSuggestions(resume, jobDescription) {
  const prompt = `
You are a helpful and concise resume improvement assistant.

You will receive a job description and a resume.
Return exactly 2 most important bullet-point suggestions to improve the resume for this specific job.

Format Rules:
- Each suggestion should be on a single line.
- Use exactly one dash ("-") per suggestion.
- Do not use nested bullets or numbering.
- Do not include any intro or summary text.

Job Description:
${jobDescription}

Resume:
${resume}

Your suggestions:
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = response?.text?.trim();
    console.log(text);
    return text
      ? text
          .split("\n")
          .map((line) =>
            line
              .trim()
              .replace(/^[-–—]+\s*/, "- ")
              .replace(/^\-\s*\-+\s*/, "- ")
              .replace(/^[-–—]+\s*/, "- ")
          )
          .filter((line) => line.startsWith("-"))
      : ["No suggestions received."];
  } catch (err) {
    console.error("Gemini error:", err.message);
    throw new Error("Failed to get suggestions from Gemini.");
  }
}
