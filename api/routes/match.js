import express from "express";
import multer from "multer";
import { getGeminiInsights } from "../services/geminiService.js";
import { parseResume } from "../services/resumeParser.js";
import { calculateMatchScore } from "../services/matchScorer.js";
import { upsertUser } from "../services/userService.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/match", upload.single("resume"), async (req, res) => {
  console.log("REQ comes: ", req.auth.userId);
  console.log("Session Claims:", req.auth.sessionClaims);

  if (!req.auth?.userId) {
    return res.status(401).json({ error: "Unauthorized, please sign in" });
  }

  const userId = req.auth.userId;
  const email = req.auth.sessionClaims?.primaryEmail;

  try {
    if (!email) {
      console.warn(`No email found for user ${userId}, skipping DB insert`);
    } else {
      const inserted = await upsertUser(userId, email);
      if (inserted) {
        console.log(`New user inserted: ${userId} (${email})`);
      } else {
        console.log(`User already exists: ${userId}`);
      }
    }
  } catch (err) {
    console.error("User DB error:", err.message);
    return res.status(500).json({ error: "Failed to store user" });
  }

  const { jd: jobDesc } = req.body;

  try {
    const resumeText = await parseResume(req.file.path);
    if (!resumeText || resumeText.trim().length < 20) {
      return res
        .status(400)
        .json({ error: "Resume content too short or unreadable." });
    }

    if (!jobDesc || jobDesc.trim().length < 10) {
      return res
        .status(400)
        .json({ error: "Job description is too short or missing." });
    }

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
