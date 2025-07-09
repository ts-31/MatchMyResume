# 🧠 MatchMyResume – MVP (with Gemini API Free Tier)

**MatchMyResume** is a Chrome Extension + Node.js backend that helps job seekers analyze how well their resume matches a job description. This MVP version uses **Google Gemini API (Free Tier)** to provide smart suggestions for improving resumes.

---

## 🚀 Features (MVP)

- 📄 Upload resume (PDF or text)
- 🔍 Extract job description from websites like LinkedIn/Naukri
- 📊 Calculate match score (based on keyword overlap)
- 🤖 Generate improvement suggestions using **Gemini Flash**
- 🧠 100% free using Gemini's no-cost API access

---

## 🧰 Tech Stack

| Layer      | Technology                 |
|------------|----------------------------|
| Frontend   | Chrome Extension (HTML, JS) |
| Backend    | Node.js + Express          |
| Resume Parsing | `pdf-parse`           |
| AI Suggestions | Gemini Flash API      |
| API Client | Axios                      |
| Deployment | Run locally for MVP        |

---

## 🧑‍💻 Setup Instructions

### 1. Clone the Repo
```bash
git clone https://github.com/your-username/MatchMyResume.git
cd MatchMyResume
```

### 2. Setup Backend
```bash
cd server
npm install
touch .env
# Add your Gemini API key in .env:
# GEMINI_API_KEY=your_key_here
npm run dev
```

### 3. Setup Gemini (Free)
- Go to [https://makersuite.google.com](https://makersuite.google.com)
- Create a project, get your **API Key**
- No billing needed for Gemini Flash (free tier)


### 4. Load Chrome Extension
- Visit `chrome://extensions`
- Enable Developer Mode
- Click “Load Unpacked” and select the `client/` folder

---

## 📂 Folder Structure

```
MatchMyResume/
├── extension/               # Chrome Extension code
│   ├── popup.html
│   ├── popup.js
│   └── manifest.json
├── api/                     # Node.js backend with Gemini
│   ├── index.js
│   ├── routes/
│   ├── services/
│   └── .env
└── README.md
```

---

## 🧠 Gemini Prompt Example
```
You are a resume assistant.

Here is a job description:
<job description>

Here is a resume:
<resume text>

Suggest 2 improvements to align the resume with the job.
```

---

## ✅ MVP Goals

- Easy to use
- No cost (Gemini API free tier)
- Extendable with history, login, AI upgrades

---

## 🏁 License

MIT