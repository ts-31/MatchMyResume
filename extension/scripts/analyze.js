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

      chrome.storage.local.get(["resume"], async (result) => {
        const base64 = result.resume;

        if (!base64) {
          button.disabled = false;
          button.innerText = "Analyze";
          showToast("❌ Please upload resume first");
          return;
        }

        // Convert base64 to Blob
        const byteString = atob(base64.split(",")[1]);
        const mimeString = base64.split(",")[0].split(":")[1].split(";")[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        const resumeBlob = new Blob([ab], { type: mimeString });

        // Create form data
        const formData = new FormData();
        formData.append("resume", resumeBlob, "resume.pdf");
        formData.append("jd", jd);

        try {
          console.log("Sending request without auth...");
          const res = await fetch("http://localhost:8000/api/match", {
            method: "POST",
            body: formData,
          });

          console.log("Response status:", res.status);
          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || `HTTP error ${res.status}`);
          }

          const data = await res.json();
          console.log("Backend response:", data);

          output.innerHTML = `
  <!-- Scores Section with increased line spacing -->
  <div style="margin-bottom: 20px;">
    <div style="margin-bottom: 8px; line-height: 1.8;">✅ Match Score (Keyword Based): ${
      data.logicScore
    }</div>
    <div style="margin-bottom: 8px; line-height: 1.8;">🤖 AI Match Score: ${
      data.aiScore ? `${data.aiScore}/100` : "N/A"
    }</div>
  </div>

  <!-- Missing Keywords Section with section spacing -->
  <div style="margin-bottom: 20px;">
    <div style="margin-bottom: 10px; font-weight: bold; line-height: 1.8;">📌 Missing Keywords:</div>
    ${data.missingKeywords
      .map(
        (k, i) => `
          <div class="keyword-row" data-key="${k}" style="display: flex; align-items: center; justify-content: space-between; margin: 6px 0; padding: 8px 0; line-height: 1.6;">
            <span>${i + 1}. ${k}</span>
            <button class="copy-btn" style="font-size: 11px; padding: 2px 6px; margin: 0 0 0 8px;">📋</button>
          </div>
        `
      )
      .join("")}
  </div>

  <!-- Suggestions Section with section spacing -->
  <div style="margin-bottom: 10px;">
    <div style="margin-bottom: 10px; font-weight: bold; line-height: 1.8;">🔧 Suggestions:</div>
    <ul class="suggestions-list" style="margin: 0; padding: 0 0 0 20px; list-style: none;">
      ${data.suggestions
        .map(
          (s) =>
            `<li style="margin: 8px 0; padding: 0; line-height: 1.7; position: relative;">
              <span style="position: absolute; left: -15px;">•</span>${s}
            </li>`
        )
        .join("")}
    </ul>
  </div>
`;

          // Copy buttons
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
          showToast(`❌ ${err.message}`);
        } finally {
          button.disabled = false;
          button.innerText = "Analyze";
        }
      });
    });
  }
}
