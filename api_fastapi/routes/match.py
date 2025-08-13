from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
from tempfile import NamedTemporaryFile
import shutil

from services.gemini import get_gemini_insights
from services.resumeParser import parse_resume
from services.scorer import calculate_match_score

router = APIRouter()


@router.post("/match")
async def match_resume(resume: UploadFile = File(...), jd: str = Form(...)):
    print("📥 Received /match request")

    # Save uploaded resume
    try:
        with NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            shutil.copyfileobj(resume.file, tmp)
            temp_path = tmp.name
            print(f"📄 Resume saved to temp file: {temp_path}")
    except Exception as e:
        print("❌ Resume save error:", e)
        raise HTTPException(status_code=400, detail="Failed to save uploaded file")

    # Parse resume & match
    try:
        resume_text = parse_resume(temp_path)
        print(f"🧾 Resume parsed, length: {len(resume_text.strip())} characters")

        if not resume_text or len(resume_text.strip()) < 20:
            raise HTTPException(
                status_code=400, detail="Resume content too short or unreadable."
            )

        if not jd or len(jd.strip()) < 10:
            raise HTTPException(
                status_code=400, detail="Job description is too short or missing."
            )

        logic_score, matched_count, total_keywords = calculate_match_score(
            resume_text, jd
        )
        gemini = await get_gemini_insights(resume_text, jd)

        print("✅ Successfully processed resume and job description")

        return JSONResponse(
            content={
                "logicScore": logic_score,
                "aiScore": gemini["aiScore"],
                "keywordsMatched": matched_count,
                "totalKeywords": total_keywords,
                "missingKeywords": gemini["missingKeywords"],
                "suggestions": gemini["suggestions"],
            }
        )

    except Exception as e:
        print("❌ Match error:", str(e))
        raise HTTPException(status_code=500, detail=f"Something went wrong: {e}")
