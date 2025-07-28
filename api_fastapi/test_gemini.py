import asyncio
from services.gemini import get_gemini_insights

# Sample dummy resume and job description
resume = """
Tejas Sonawane
Software Developer with experience in React, Node.js, and MongoDB.
Interned at XYZ Corp. Built a task management app.
"""

job_description = """
Looking for a backend engineer with skills in PostgreSQL, Redis, Docker,
and experience with distributed systems and cloud platforms like AWS or GCP.
"""

async def main():
    result = await get_gemini_insights(resume, job_description)
    print("\nFinal parsed result:\n", result)

# Run the async function
asyncio.run(main())
