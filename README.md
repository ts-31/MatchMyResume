# 🧠 MatchMyResume – MVP (with Gemini API Free Tier)

**MatchMyResume** is a Chrome Extension + Node.js backend that helps job seekers analyze how well their resume matches a job description. This MVP version uses **Google Gemini API (Free Tier)** to provide smart suggestions for improving resumes.

---

## 🚀 Features (MVP)

- 📄 Upload resume (PDF or text)
- 🔍 Extract job description from websites like LinkedIn/Naukri
- 📊 Calculate match score (based on keyword overlap)
- 🤖 Generate improvement suggestions using **Gemini Flash**
- 🔐 Google Sign-In via Clerk for authentication (stored securely with Chrome local storage)
- 🧠 100% free using Gemini's no-cost API access

---

## 🧰 Tech Stack

| Layer           | Technology                  |
|------------------|-----------------------------|
| Frontend         | Chrome Extension (HTML, JS) |
| Backend          | Node.js + Express           |
| Resume Parsing   | `pdf-parse`                 |
| AI Suggestions   | Gemini Flash API            |
| Auth & Storage   | Clerk + Chrome localStorage |
| API Client       | Fetch                       |
| Deployment       | Run locally for MVP         |

---

## 📌 Authentication (Google Sign-In via Clerk)

### 🔒 Flow Summary
- Login page (`login/index.html`) uses Clerk's `redirectToSignIn` method for Google OAuth.
- After successful sign-in, Clerk returns the JWT token.
- The token is sent to the Chrome Extension using `chrome.runtime.sendMessage`.
- Extension stores the token in `chrome.storage.local` and shows a toast notification.
- Login tab auto-closes and returns control to the extension.

### ⚠️ Challenge Faced

While implementing Clerk sign-in inside the Chrome Extension, I faced the following issues:

- Could not directly use Clerk auth inside the extension due to security restrictions.
- Needed a way to send the token from the login page (opened in a new tab) back to the extension.
- Had to persist the session token securely for future API calls.
- Wanted to close the login tab and return to the extension UI smoothly.

#### ✅ Solution

- Used `chrome.runtime.onMessageExternal` to receive the token.
- Used `chrome.tabs.query` and `chrome.tabs.sendMessage` to notify the extension UI.
- Stored the Clerk token in `chrome.storage.local` for persistence.
- Cleared localStorage after sign-in to prevent token leakage from the login page.


---

## 🧑‍💻 Setup Instructions

### 1. Clone the Repo
```bash
git clone https://github.com/your-username/MatchMyResume.git
cd MatchMyResume
```

### 2. Setup Backend
```bash
cd api
npm install
touch .env
# Add your Gemini API key in .env:
# GEMINI_API_KEY=your_key_here
# PORT=3000
# CLERK_SECRET_KEY=your_clerk_secret_key
node index.js
```

### 3. Setup Login Page
- **Production**: The login page is hosted at `https://match-my-resume.vercel.app/`.
- **Local Testing**:
  - Run `login/index.html` using VS Code's Live Server extension (default: `http://127.0.0.1:5500/login/index.html`).
  - Add your `CLERK_PUBLISHABLE_KEY` to `login/index.html` (from Clerk Dashboard).
  - Update `extension/content.js` to use your local URL:
    ```javascript
    window.open("http://127.0.0.1:5500/login/index.html", "_blank");
    ```
  - Update extension/manifest.json to include your local URL:
    ```json
    "externally_connectable": {
      "matches": ["http://127.0.0.1:5500/*", "https://match-my-resume.vercel.app/*"]
    }
    ```

### 4. Setup Gemini (Free)
- Go to [https://makersuite.google.com](https://makersuite.google.com)
- Create a project, get your **API Key**
- No billing needed for Gemini Flash (free tier)

### 5. Load Chrome Extension
- Visit `chrome://extensions`
- Enable Developer Mode
- Click “Load Unpacked” and select the `client/` folder

---

## 📂 Folder Structure

```
MatchMyResume/
├── api/                          # Node.js backend with Gemini
│   ├── routes/
│   │   └── match.js
│   ├── services/
│   │   ├── geminiService.js
│   │   ├── matchScorer.js
│   │   └── resumeParser.js
│   ├── .env
│   └── index.js
├── extension/                    # Chrome Extension code
│   ├── scripts/                 # New directory for modular scripts
│   │   ├── analyze.js         # Analyze button and API logic
│   │   ├── auth.js            # Authentication logic
│   │   ├── drag.js           # Drag functionality
│   │   ├── jobDescription.js  # Job description scraping
│   │   ├── resume.js          # Resume upload logic
│   │   ├── utils.js          # Shared utilities (e.g., showToast)
│   │   └── widget.js           # Widget creation
│   ├── background.js
│   ├── content.js            # Main script to initialize modules
│   └── manifest.json
├── login/                        # Google Sign-In page (Clerk)
│   └── index.html
└── README.md
```

---

## 🏁 License

MIT
