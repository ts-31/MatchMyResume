# 🧠 MatchMyResume – MVP (with Gemini API Free Tier)

**MatchMyResume** is a Chrome Extension + Node.js backend that helps job seekers analyze how well their resume matches a job description. This MVP version uses **Google Gemini API (Free Tier)** to provide smart suggestions for improving resumes.

---

## 🚀 Features (MVP)

- 📄 Upload resume (PDF or text)
- 🔍 Extract job descriptions from supported platforms:
  - LinkedIn (`https://www.linkedin.com/jobs`)
  - Internshala (`https://internshala.com/internships/`)
- 📊 Calculate match score (based on keyword overlap)
- 🤖 Generate improvement suggestions using **Gemini Flash**
- 🔐 Google Sign-In via Clerk for authentication (stored securely with Chrome local storage)
- 🧠 100% free using Gemini's no-cost API access

---

## 🧰 Tech Stack

| Layer             | Technology                        |
|------------------|------------------------------------|
| Frontend         | Chrome Extension (HTML, JS)        |
| Backend          | Python + FastAPI                   |
| Resume Parsing   | `pdf-parse`                        |
| AI Suggestions   | Gemini 2.5 Flash (via API)         |
| Auth & Identity  | Clerk (Google OAuth) + JWT         |
| Storage          | Chrome localStorage                |
| Database         | PostgreSQL (via Neon or local)     |
| API Client       | Fetch                              |
| Deployment       | Vercel (login page), Local (backend for MVP) |

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

### 🧠 Lazy User Creation Strategy

We use a **just-in-time (lazy) user creation** pattern in our backend:

- A user is only inserted into the `users` table **the first time** they hit `/api/match`.
- This prevents unnecessary DB writes for users who sign in but never use the feature.
- It's implemented with a safe upsert:
  ```sql
  INSERT INTO users (id, email)
  VALUES ($1, $2)
  ON CONFLICT (id) DO NOTHING;
  ```

> This approach is scalable, avoids redundant records, and is commonly used in production apps like Stripe, Supabase, and Firebase.

---

#### 🛠️ Clerk Setup for Contributors
To test authentication, you need to configure Clerk to include the user's email in the session token for backend API calls. Follow these steps:

1. **Create a Clerk Account**:
   - Sign up at [Clerk Dashboard](https://dashboard.clerk.com/sign-up) and create a new application.

2. **Enable Google Sign-In**:
   - In the Clerk Dashboard, go to **Authentication > Providers**.
   - Enable **Google** as a social login provider and configure it with your Google OAuth credentials (see [Clerk's Social Login Docs](https://clerk.com/docs/authentication/social-login)).

3. **Customize Session Token for Email Claim**:
   - To include the user's email in the session token:
     - Go to **Sessions** in the Clerk Dashboard.
     - Under **Customize session token**, add the following to the Claims editor:
       ```json
       {
         "primaryEmail": "{{user.primary_email_address}}"
       }
       ```
     - Save the changes.

4. **Set Up API Keys**:
   - In the Clerk Dashboard, go to **API Keys**.
   - Copy the **Publishable Key** (for the Chrome Extension) and **Secret Key** (for the Node.js backend).
   - Add the **Secret Key** to your backend `.env` file:
     ```env
     CLERK_SECRET_KEY=your_clerk_secret_key
     ```
   - Add the **Publishable Key** to `login/index.html`:
     ```html
     <script data-clerk-publishable-key='your_clerk_publishable_key'></script>
     ```
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
# CLERK_SECRET_KEY=your_clerk_secret_key
#DATABASE_URL=your_db_url
uvicorn main:app --reload --port 3000
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
### 4. Setup PostgreSQL
- If you're using Neon or local PostgreSQL, run this SQL to create the users table:
  ```sql
  CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT
  );
  ```

### 5. Setup Gemini (Free)
- Go to [https://makersuite.google.com](https://makersuite.google.com)
- Create a project, get your **API Key**
- No billing needed for Gemini Flash (free tier)

### 6. Load Chrome Extension
- Visit `chrome://extensions`
- Enable Developer Mode
- Click “Load Unpacked” and select the `extension/` folder
- Test on supported platforms: LinkedIn (https://www.linkedin.com/jobs) and Internshala (https://internshala.com/internships/).

---

## 📂 Folder Structure

```
MatchMyResume/
├── api_fastapi/                          # Node.js backend with Gemini
│   ├── db/
│   │   └── connect.py                # PostgreSQL connection pool
│   ├── routes/
│   │   └── match.py
│   ├── services/
│   │   ├── gemini.py      # Handles Gemini API calls
│   │   ├── resumeParser.py        # Logic for calculating match score
│   │   ├── scorer.py       # Logic for parsing resumes
│   │   └── users.py      
│   ├── .env
│   └── main.py
├── extension/                    # Chrome Extension code
│   ├── scripts/                 # Modular scripts
│   │   ├── analyze.js           # Analyze button and API logic
│   │   ├── auth.js              # Authentication logic
│   │   ├── drag.js             # Drag functionality
│   │   ├── jobDescription.js    # Job description scraping
│   │   ├── resume.js            # Resume upload logic
│   │   ├── utils.js            # Shared utilities (e.g., showToast)
│   │   └── widget.js           # Widget creation
│   ├── background.js
│   ├── content.js               # Main script to initialize modules
│   └── manifest.json
├── login/                        # Google Sign-In page (Clerk)
│   └── index.html
└── README.md
```

---

## 🏁 License

MIT
