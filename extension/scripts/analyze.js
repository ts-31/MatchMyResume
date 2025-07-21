function initializeAnalyze(showToast) {
  const analyzeBtn = document.getElementById("analyze-btn");
  if (analyzeBtn) {
    analyzeBtn.addEventListener("click", async () => {
      const jd = document.getElementById("jd-textarea")?.value;
      const output = document.getElementById("output-box");
      const button = document.getElementById("analyze-btn");

      if (!output || !button) return;

      output.style.maxHeight = "200px";
      output.style.overflowY = "auto";

      if (!jd?.trim()) {
        showToast("❌ Job description missing");
        return;
      }

      button.disabled = true;
      button.innerText = "Thinking... ⏳";

      chrome.storage.local.get(["resume", "clerkJwt"], async (result) => {
        const base64 = result.resume;
        const token = result.clerkJwt;

        if (!base64) {
          button.disabled = false;
          button.innerText = "Analyze";
          showToast("❌ Please upload resume first");
          return;
        }

        if (!token) {
          button.disabled = false;
          button.innerText = "Analyze";
          showToast("❌ Please sign in to analyze");
          return;
        }

        const byteString = atob(base64.split(",")[1]);
        const mimeString = base64.split(",")[0].split(":")[1].split(";")[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        const resumeBlob = new Blob([ab], { type: mimeString });

        const formData = new FormData();
        formData.append("resume", resumeBlob, "resume.pdf");
        formData.append("jd", jd);

        try {
          console.log("Sending request with token:", token);
          const res = await fetch("http://localhost:3000/api/match", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          });

          console.log("Response status:", res.status);
          if (!res.ok) {
            if (res.status === 401) {
              showToast("❌ Authentication failed, please sign in again");
              chrome.storage.local.remove(["clerkJwt", "justSignedIn"], () => {
                const signInButton = document.getElementById("signin");
                if (signInButton) {
                  signInButton.innerText = "🔐 Sign In";
                  signInButton.style.backgroundColor = "";
                  signInButton.style.color = "";
                  signInButton.disabled = false;
                }
              });
              return;
            }
            const errorData = await res.json();
            throw new Error(errorData.error || `HTTP error ${res.status}`);
          }

          const data = await res.json();
          console.log("Backend response:", data);
          output.innerHTML = `✅ Match Score (Keyword Based): ${data.logicScore}
🤖 AI Match Score: ${data.aiScore ? `${data.aiScore}/100` : "N/A"}
📌 Missing Keywords:
${data.missingKeywords
  .map(
    (
      k,
      i
    ) => `<div class="keyword-row" data-key="${k}" style="display: flex; align-items: center; justify-content: space-between; margin: 0; padding: 2px 0;">
        <span style="font-size: 13px;">${i + 1}. ${k}</span>
        <button class="copy-btn" style="font-size: 12px; padding: 2px 6px; margin: 0 0 0 10px;">📋</button>
      </div>`
  )
  .join("")}
🔧 Suggestions:
${data.suggestions.map((s) => `- ${s}`).join("\n")}`;
          output.querySelectorAll(".copy-btn").forEach((btn) => {
            btn.addEventListener("click", (e) => {
              const keyword = e.target.closest(".keyword-row")?.dataset.key;
              if (keyword) {
                navigator.clipboard
                  .writeText(keyword)
                  .then(() => showToast(`📋 Copied: ${keyword}`))
                  .catch(() => showToast("❌ Failed to copy"));
              }
            });
          });
        } catch (err) {
          showToast(`❌ Failed to fetch results: ${err.message}`);
        } finally {
          button.disabled = false;
          button.innerText = "Analyze";
        }
      });
    });
  }
}
