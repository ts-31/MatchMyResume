import express from "express";
import multer from "multer";
import { getGeminiSuggestions } from "../services/geminiService.js";
import { parseResume } from "../services/resumeParser.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/match", upload.single("resume"), async (req, res) => {
  const { jd: jobDesc } = req.body;

  try {
    const resumeText = await parseResume(req.file.path);

    if (!resumeText || resumeText.trim().length < 20) {
      return res.status(400).json({ error: "Resume content too short or unreadable." });
    }

    if (!jobDesc || jobDesc.trim().length < 10) {
      return res.status(400).json({ error: "Job description is too short or missing." });
    }

    const suggestions = await getGeminiSuggestions(resumeText, jobDesc);
    res.json({ matchScore: "70%", suggestions });
  } catch (error) {
    console.error("Match error:", error.message);
    res.status(500).json({ error: "Something went wrong: " + error.message });
  }
});

export default router;
