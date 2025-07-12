(function () {
  if (document.getElementById("matchmyresume-widget")) return; // prevent duplicate injection

  // 1. Create floating widget
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
    if (result.resume) {
      status.textContent = "📎 Resume uploaded";
    } else {
      status.textContent = ""; 
    }
  });

  document.getElementById("close-widget").addEventListener("click", () => {
    document.getElementById("matchmyresume-widget").remove();
  });

  // 2. Toast utility
  function showToast(msg) {
    const toast = document.getElementById("toast-box");
    toast.innerText = msg;
    toast.style.display = "block";
    setTimeout(() => (toast.style.display = "none"), 3000);
  }

  // 3. Resume upload handler with chrome.storage.local
  document.getElementById("resume-file").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result;
      chrome.storage.local.set({ resume: base64 }, () => {
        showToast("✅ Resume saved");
        document.getElementById("resume-status").textContent =
          "📎 Resume uploaded";
      });
    };
    reader.readAsDataURL(file);
  });

  // 4. JD Scraper with MutationObserver
  function extractJD() {
    const textarea = document.getElementById("jd-textarea");

    textarea.style.backgroundColor = "#e6f7ff";
    textarea.style.color = "#004085";

    setTimeout(() => {
      const jdContainer =
        document.querySelector(".jobs-description-content__text") ||
        document.querySelector(".jobs-description__container");
      const jobTitle = document.querySelector(
        "h2.jobs-details-top-card__job-title"
      )?.innerText;
      const company = document.querySelector(
        ".jobs-details-top-card__company-url"
      )?.innerText;

      const text = `${jobTitle ? `Title: ${jobTitle}\n` : ""}${
        company ? `Company: ${company}\n` : ""
      }${jdContainer ? jdContainer.innerText : ""}`;
      textarea.value = text.trim();

      setTimeout(() => {
        textarea.style.backgroundColor = "";
        textarea.style.color = "";
      }, 500);
    }, 200); 
  }

  const observer = new MutationObserver(() => {
    extractJD();
  });

  observer.observe(document.body, { subtree: true, childList: true });
  setTimeout(extractJD, 2000); 

  // 5. Analyze button logic with chrome.storage.local resume retrieval
  document.getElementById("analyze-btn").addEventListener("click", async () => {
    const jd = document.getElementById("jd-textarea").value;
    const output = document.getElementById("output-box");
    const button = document.getElementById("analyze-btn");

    output.style.maxHeight = "200px";
    output.style.overflowY = "auto";

    if (!jd.trim()) return showToast("❌ Job description missing");

    button.disabled = true;
    button.innerText = "Thinking... ⏳";

    chrome.storage.local.get(["resume"], async (result) => {
      const base64 = result.resume;
      if (!base64) {
        button.disabled = false;
        button.innerText = "Analyze";
        return showToast("❌ Please upload resume first");
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
        output.innerHTML = `✅ Match Score: ${
          data.matchScore
        }\n\n🔧 Suggestions:\n${data.suggestions
          .map((s) => `- ${s}`)
          .join("\n")}`;
      } catch (err) {
        console.error(err);
        showToast("❌ Failed to fetch results");
      } finally {
        button.disabled = false;
        button.innerText = "Analyze";
      }
    });
  });
})();

// Drag logic
(function makeDraggable() {
  const header = document.getElementById("drag-header");
  const widget = document.getElementById("matchmyresume-widget");
  let offsetX = 0,
    offsetY = 0,
    isDragging = false;

  header.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.clientX - widget.getBoundingClientRect().left;
    offsetY = e.clientY - widget.getBoundingClientRect().top;
    document.body.style.userSelect = "none";
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    widget.style.left = `${e.clientX - offsetX}px`;
    widget.style.top = `${e.clientY - offsetY}px`;
    widget.style.right = "auto";
    widget.style.bottom = "auto";
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
    document.body.style.userSelect = "";
  });
})();
