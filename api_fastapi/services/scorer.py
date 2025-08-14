def calculate_match_score(resume_text: str, jd: str) -> int:
    jd_words = set(jd.lower().split())
    resume_words = set(resume_text.lower().split())
    matched = jd_words.intersection(resume_words)
    total = len(jd_words)
    score = (len(matched) / total) * 100 if total > 0 else 0
    return round(score)
