# 🧠 MatchMyResume – MVP (with Gemini API Free Tier)

**MatchMyResume** is a Chrome Extension + FastAPI backend that helps job seekers analyze how well their resume matches a job description.  
This MVP version uses **Google Gemini API (Free Tier)** to provide smart suggestions for improving resumes.

---

## 🚀 Features (MVP)

- 📄 Upload resume (PDF or text)
- 🔍 Extract job descriptions from supported platforms:
  - LinkedIn (`https://www.linkedin.com/jobs`)
  - Internshala (`https://internshala.com/internships/`)
- 📊 Calculate match score (based on keyword overlap)
- 🤖 Generate improvement suggestions using **Gemini Flash**
- 🧠 100% free using Gemini's no-cost API access

---

## 🧰 Tech Stack

| Layer             | Technology                        |
|-------------------|-----------------------------------|
| Frontend          | Chrome Extension (HTML, JS)       |
| Frontend (Web)    | Next.js + Tailwind CSS            |
| Backend           | Python + FastAPI                  |
| Resume Parsing    | pdfminer.six / PyMuPDF            |
| AI Suggestions    | Gemini 2.5 Flash (via API)        |
| Storage           | Chrome localStorage               |
| API Client        | Fetch                             |

---

## 🧑‍💻 Setup Instructions

### 1. Clone the Repo
```bash
git clone https://github.com/your-username/MatchMyResume.git
cd MatchMyResume
```

### 2. Setup Backend
```bash
cd api_fastapi
pip install -r requirements.txt
touch .env
# Add your API keys:
# GEMINI_API_KEY=your_key_here
uvicorn main:app --reload --port 8000
```

### 3. Setup Gemini (Free)
- Go to [https://makersuite.google.com](https://makersuite.google.com)
- Create a project, get your **API Key**
- No billing needed for Gemini Flash (free tier)

### 4. Load Chrome Extension
- Visit `chrome://extensions`
- Enable Developer Mode
- Click “Load Unpacked” and select the `extension/` folder
- Test on supported platforms: LinkedIn (https://www.linkedin.com/jobs) and Internshala (https://internshala.com/internships/).


### 5. 4. Frontend Setup (Next.js)
```bash
cd ../web
npm install
npm run dev
```
---

## 📂 Folder Structure

```
MatchMyResume/
├── api_fastapi/                          # FastAPI backend with Gemini
│   ├── routes/
│   │   └── match.py                      # API endpoint for matching
│   ├── services/
│   │   ├── gemini.py                     # Handles Gemini API calls
│   │   ├── resumeParser.py               # Logic for parsing resumes
│   │   └── scorer.py                      # Logic for calculating match score
│   ├── .env
│   └── main.py
├── extension/                            # Chrome Extension code
│   ├── scripts/                          # Modular scripts
│   │   ├── analyze.js                    # Analyze button and API logic
│   │   ├── drag.js                       # Drag functionality
│   │   ├── jobDescription.js             # Job description scraping
│   │   ├── resume.js                     # Resume upload logic
│   │   ├── utils.js                      # Shared utilities (e.g., showToast)
│   │   └── widget.js                     # Widget creation
│   ├── background.js
│   ├── content.js                        # Main script to initialize modules
│   └── manifest.json
├── web/                                  # Next.js frontend
│   ├── src/app/
│   │   ├── components/ProgressSteps.js   # Upload/analysis animation
│   │   ├── workspace/page.js             # Resume workspace
│   │   ├── page.js                       # Landing Page
│   │   └── globals.css                   # Tailwind base styles
│   ├── public/
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

---

## 🏁 License

MIT
