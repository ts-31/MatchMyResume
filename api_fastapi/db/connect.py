import os
import asyncpg
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

pool = None


async def get_pool():
    global pool
    if pool is None:
        pool = await asyncpg.create_pool(dsn=DATABASE_URL, ssl=True)  
    return pool
