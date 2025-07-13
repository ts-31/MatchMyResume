(function () {
  if (document.getElementById("matchmyresume-widget")) return;

  // Create floating widget
  const widget = document.createElement("div");
  widget.id = "matchmyresume-widget";
  widget.style.cssText = `
    position: fixed;
    top: 80px;
    right: 20px;
    width: 320px;
    background: white;
    border: 1px solid #ccc;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    z-index: 9999;
    border-radius: 8px;
    font-family: Arial, sans-serif;
  `;

  widget.innerHTML = `
    <div id="drag-header" style="cursor: move; background: #eee; padding: 6px; border-radius: 6px 6px 0 0; font-weight: bold; display: flex; justify-content: space-between; align-items: center;">
      <span>📄 MatchMyResume</span>
      <span id="close-widget" style="cursor: pointer; font-weight: bold; padding: 0 8px;">✖️</span>
    </div>
    <div style="padding-top: 10px">
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
        <input type="file" id="resume-file" accept=".pdf" style="flex-grow: 1;" />
        <span id="resume-status" style="font-size: 13px; color: green;"></span>
      </div>
      <div>
        <textarea id="jd-textarea" placeholder="Job description..." style="width:100%;height:80px;"></textarea>
      </div>
      <br>
      <button id="analyze-btn" style="margin-top:10px;width:100%;background:#4caf50;color:white;padding:6px;border:none;cursor:pointer;">Analyze</button>
      <pre id="output-box" style="white-space:pre-wrap;margin-top:10px;background:#f4f4f4;padding:8px;"></pre>
      <div id="toast-box" style="display:none;position:fixed;top:20px;right:20px;background:#f44336;color:white;padding:8px 12px;border-radius:4px;font-size:14px;z-index:10000;"></div>
    </div>
  `;
  document.body.appendChild(widget);

  chrome.storage.local.get("resume", (result) => {
    const status = document.getElementById("resume-status");
    if (status) {
      status.textContent = result.resume ? "📎 Resume uploaded" : "";
    }
  });

  // Toast utility
  function showToast(msg) {
    const toast = document.getElementById("toast-box");
    if (toast) {
      toast.innerText = msg;
      toast.style.display = "block";
      setTimeout(() => {
        if (toast) toast.style.display = "none";
      }, 3000);
    }
  }

  // Resume upload handler
  const resumeInput = document.getElementById("resume-file");
  if (resumeInput) {
    resumeInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result;
        chrome.storage.local.set({ resume: base64 }, () => {
          showToast("✅ Resume saved");
          const status = document.getElementById("resume-status");
          if (status) status.textContent = "📎 Resume uploaded";
        });
      };
      reader.readAsDataURL(file);
    });
  }

  // JD Scraper with MutationObserver
  function extractJD() {
    const textarea = document.getElementById("jd-textarea");
    if (!textarea) return;

    textarea.style.backgroundColor = "#e6f7ff";
    textarea.style.color = "#004085";

    setTimeout(() => {
      const jdContainer =
        document.querySelector(".jobs-description-content__text") ||
        document.querySelector(".jobs-description__container") ||
        document.querySelector("[class*='job-description']");
      const jobTitle = document.querySelector(
        "h2.jobs-details-top-card__job-title"
      )?.innerText;
      const company = document.querySelector(
        ".jobs-details-top-card__company-url"
      )?.innerText;

      const text = `${jobTitle ? `Title: ${jobTitle}\n` : ""}${
        company ? `Company: ${company}\n` : ""
      }${jdContainer ? jdContainer.innerText : ""}`;
      if (textarea) textarea.value = text.trim();

      setTimeout(() => {
        if (textarea) {
          textarea.style.backgroundColor = "";
          textarea.style.color = "";
        }
      }, 500);
    }, 200);
  }

  const observer = new MutationObserver(extractJD);
  const jobContainer = document.querySelector(".jobs-details") || document.body;
  observer.observe(jobContainer, { subtree: true, childList: true });
  setTimeout(extractJD, 2000);

  // Analyze button logic
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
          const res = await fetch("http://localhost:3000/api/match", {
            method: "POST",
            body: formData,
          });
          const data = await res.json();
          console.log(data);
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
        } catch (err) {
          console.log("EEERROR: ", err);
          showToast("❌ Failed to fetch results");
        } finally {
          setTimeout(() => {
            const copyButtons = output.querySelectorAll(".copy-btn");
            copyButtons.forEach((btn) => {
              btn.addEventListener("click", () => {
                const keyword = btn.parentElement.getAttribute("data-key");
                navigator.clipboard
                  .writeText(keyword)
                  .then(() => showToast(`✅ Copied: "${keyword}"`))
                  .catch(() => showToast("❌ Copy failed"));
              });
            });
          }, 0);

          button.disabled = false;
          button.innerText = "Analyze";
        }
      });
    });
  }

  // Drag logic
  (function makeDraggable() {
    const header = document.getElementById("drag-header");
    const widget = document.getElementById("matchmyresume-widget");
    if (!header || !widget) return;

    let offsetX = 0,
      offsetY = 0,
      isDragging = false;

    const moveHandler = (e) => {
      if (!isDragging) return;
      const widget = document.getElementById("matchmyresume-widget");
      if (!widget) {
        isDragging = false;
        return;
      }
      widget.style.left = `${e.clientX - offsetX}px`;
      widget.style.top = `${e.clientY - offsetY}px`;
      widget.style.right = "auto";
      widget.style.bottom = "auto";
    };

    const upHandler = () => {
      isDragging = false;
      document.body.style.userSelect = "";
    };

    header.addEventListener("mousedown", (e) => {
      isDragging = true;
      offsetX = e.clientX - widget.getBoundingClientRect().left;
      offsetY = e.clientY - widget.getBoundingClientRect().top;
      document.body.style.userSelect = "none";
    });

    document.addEventListener("mousemove", moveHandler);
    document.addEventListener("mouseup", upHandler);

    // Cleanup function
    function cleanup() {
      document.removeEventListener("mousemove", moveHandler);
      document.removeEventListener("mouseup", upHandler);
      observer.disconnect();
      if (widget) widget.remove();
    }

    const closeWidget = document.getElementById("close-widget");
    if (closeWidget) closeWidget.addEventListener("click", cleanup);
  })();
})();
