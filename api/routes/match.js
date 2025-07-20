import express from "express";
import multer from "multer";
import { getGeminiInsights } from "../services/geminiService.js";
import { parseResume } from "../services/resumeParser.js";
import { calculateMatchScore } from "../services/matchScorer.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/match", upload.single("resume"), async (req, res) => {
  console.log("REQ comes: ");
  if (!req.auth?.userId) {
    return res.status(401).json({ error: "Unauthorized, please sign in" });
  }
  const { jd: jobDesc } = req.body;
  try {
    const resumeText = await parseResume(req.file.path);
    if (!resumeText || resumeText.trim().length < 20)
      return res
        .status(400)
        .json({ error: "Resume content too short or unreadable." });

    if (!jobDesc || jobDesc.trim().length < 10)
      return res
        .status(400)
        .json({ error: "Job description is too short or missing." });

    const logicScore = calculateMatchScore(resumeText, jobDesc);
    const gemini = await getGeminiInsights(resumeText, jobDesc);
    console.log("AI Missing Keywords: ", gemini.missingKeywords);
    res.json({
      logicScore: logicScore.score,
      aiScore: gemini.aiScore,
      keywordsMatched: logicScore.keywordsMatched,
      totalKeywords: logicScore.totalKeywords,
      missingKeywords: gemini.missingKeywords,
      suggestions: gemini.suggestions,
    });
  } catch (error) {
    console.error("Match error:", error.message);
    res.status(500).json({ error: "Something went wrong: " + error.message });
  }
});

export default router;
