import express from "express";
const router = express.Router();

router.get("/check", (req, res) => {
  const userId = req.auth?.userId;
  if (!userId) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  return res.json({
    message: "✅ Authenticated",
    userId,
  });
});

export default router;
