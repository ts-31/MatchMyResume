import os
import re
from dotenv import load_dotenv
from google import genai

load_dotenv()
genai_client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


async def get_gemini_insights(resume: str, job_description: str):
    prompt = f"""
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
{job_description}

Resume:
{resume}

Your Response:
"""

    try:
        response = genai_client.models.generate_content(
            model="gemini-2.5-flash", contents=prompt
        )

        raw = response.text.strip()
        print("Gemini raw response:\n", raw)

        score_match = re.search(r"Match Score:\s*(\d+)", raw, re.IGNORECASE)
        ai_score = int(score_match.group(1)) if score_match else None

        missing_keywords = []
        suggestions = []

        in_missing = False
        in_suggest = False

        for line in raw.splitlines():
            line = line.strip()
            if re.match(r"^Missing Keywords:", line, re.IGNORECASE):
                in_missing = True
                in_suggest = False
                continue
            if re.match(r"^Suggestions:", line, re.IGNORECASE):
                in_suggest = True
                in_missing = False
                continue

            if in_missing and line.startswith("-"):
                missing_keywords.append(re.sub(r"^[-–—]+\s*", "", line).strip())
            elif in_suggest and line.startswith("-"):
                suggestions.append("- " + re.sub(r"^[-–—]+\s*", "", line).strip())

        return {
            "aiScore": ai_score,
            "suggestions": suggestions or ["No suggestions received."],
            "missingKeywords": missing_keywords or ["None"],
        }

    except Exception as err:
        print("Gemini error:", str(err))
        raise RuntimeError("Failed to get insights from Gemini.")
