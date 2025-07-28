import asyncpg


async def upsert_user(db, user_id: str, email: str) -> bool:
    try:
        result = await db.fetchval(
            """
            INSERT INTO users (id, email)
            VALUES ($1, $2)
            ON CONFLICT (id) DO NOTHING
            RETURNING id
            """,
            user_id,
            email,
        )
        return result is not None  # True if inserted, False if already existed
    except Exception as e:
        print("❌ Failed to upsert user:", e)
        raise e
