import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getGeminiInsights(resume, jobDescription) {
  const prompt = `
You are a concise resume analyzer.

Instructions:
1. Assign an AI match score between 0–100 for how well the resume fits the job description.
2. Identify 3–5 important keywords or skills from the JD that are missing in the resume.
3. Give exactly 2 improvement suggestions, max **10 words each**. Do not exceed 1 line.

Respond only in the following format:

Match Score: <number>

Missing Keywords:
- <keyword1>
- <keyword2>
- <keyword3>

Suggestions:
- <short actionable suggestion>
- <short actionable suggestion>

Avoid explanations, extra lines, or formatting.

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

    const scoreMatch = raw.match(/Match Score:\s*(\d+)/i);
    const aiScore = scoreMatch ? parseInt(scoreMatch[1]) : null;

    const missingKeywords = [];
    const suggestions = [];

    let inMissing = false,
      inSuggest = false;
    for (let line of raw.split("\n")) {
      line = line.trim();
      if (/^Missing Keywords:/i.test(line)) {
        inMissing = true;
        inSuggest = false;
        continue;
      }
      if (/^Suggestions:/i.test(line)) {
        inSuggest = true;
        inMissing = false;
        continue;
      }

      if (inMissing && line.startsWith("-")) {
        missingKeywords.push(line.replace(/^[-–—]+\s*/, "").trim());
      } else if (inSuggest && line.startsWith("-")) {
        suggestions.push(line.replace(/^[-–—]+\s*/, "- ").trim());
      }
    }

    return {
      aiScore: aiScore ?? null,
      suggestions: suggestions.length
        ? suggestions
        : ["No suggestions received."],
      missingKeywords: missingKeywords.length ? missingKeywords : ["None"],
    };
  } catch (err) {
    console.error("Gemini error:", err.message);
    throw new Error("Failed to get insights from Gemini.");
  }
}
