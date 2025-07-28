from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from routes import match

load_dotenv()

app = FastAPI()

origins = [
    "http://127.0.0.1:5500",
    "https://www.linkedin.com",
    "https://internshala.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(match.router, prefix="/api")
