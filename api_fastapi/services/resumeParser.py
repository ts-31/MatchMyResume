import pdfplumber
import os


def parse_resume(file_path: str) -> str:
    try:
        with pdfplumber.open(file_path) as pdf:
            text = "\n".join(page.extract_text() or "" for page in pdf.pages)

        os.remove(file_path)
        return text.strip()

    except Exception as err:
        print("Failed to parse or delete file:", err)
        raise
