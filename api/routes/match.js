import express from "express";
import multer from "multer";
import { getGeminiSuggestions } from "../services/geminiService.js";
import { parseResume } from "../services/resumeParser.js";

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/match', upload.single('resume'), async(req, res) => {
  const { jd: jobDesc } = req.body;
  try {
    const resumeText = await parseResume(req.file.path);
    const suggestions = await getGeminiSuggestions(resumeText, jobDesc);
    res.json({ matchScore: '70%', suggestions });
  } catch (error) {
    console.log('Match error: ', error);
    res.status(500).json({ error: error.message });
  }
})

export default router;