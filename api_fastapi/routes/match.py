from fastapi import APIRouter, UploadFile, File, Form, Request, HTTPException
from fastapi.responses import JSONResponse
from tempfile import NamedTemporaryFile
import shutil

from services.gemini import get_gemini_insights
from services.resumeParser import parse_resume
from services.scorer import calculate_match_score
from services.users import upsert_user
from db.connect import get_pool
from auth.clerk import get_user_info_from_token

router = APIRouter()


@router.post("/match")
async def match_resume(
    request: Request, resume: UploadFile = File(...), jd: str = Form(...)
):
    print("📥 Received /match request")

    # ✅ Decode JWT and extract Clerk user info
    try:
        user_id, email = get_user_info_from_token(request)
        print(f"✅ Authenticated user: {user_id}, Email: {email}")
    except HTTPException as e:
        print(f"❌ Auth error: {e.detail}")
        raise e

    # ✅ Lazy insert user if not exists
    try:
        if email:
            db = await get_pool()
            inserted = await upsert_user(db, user_id, email)
            if inserted:
                print(f"📝 Inserted new user: {user_id} ({email})")
            else:
                print(f"ℹ️ User already exists: {user_id}")

        else:
            print(f"⚠️ No email found for user {user_id}, skipping DB insert")
    except Exception as e:
        print("❌ DB error while upserting user:", e)
        raise HTTPException(status_code=500, detail="Failed to store user")

    # ✅ Save uploaded resume to temp file
    try:
        with NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            shutil.copyfileobj(resume.file, tmp)
            temp_path = tmp.name
            print(f"📄 Resume saved to temp file: {temp_path}")
    except Exception as e:
        print("❌ Resume save error:", e)
        raise HTTPException(status_code=400, detail="Failed to save uploaded file")

    # ✅ Process resume and job description
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

        # logic_score = calculate_match_score(resume_text, jd)
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
