// ✅ content.js (Injects floating widget & scrapes JD)
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
      <div id="drag-header" style="cursor: move; background: #eee; padding: 6px; border-radius: 6px 6px 0 0; font-weight: bold;">
        📄 MatchMyResume
      </div>
      <div style="padding-top: 10px">
        <input type="file" id="resume-file" accept=".pdf" /><br><br>
        <textarea id="jd-textarea" placeholder="Job description..." style="width:100%;height:80px;"></textarea><br>
        <button id="analyze-btn" style="margin-top:10px;width:100%;background:#4caf50;color:white;padding:6px;border:none;cursor:pointer;">Analyze</button>
        <pre id="output-box" style="white-space:pre-wrap;margin-top:10px;background:#f4f4f4;padding:8px;"></pre>
        <div id="toast-box" style="display:none;position:fixed;top:20px;right:20px;background:#f44336;color:white;padding:8px 12px;border-radius:4px;font-size:14px;z-index:10000;"></div>
      </div>
    `;

  document.body.appendChild(widget);

  // 2. Toast utility
  function showToast(msg) {
    const toast = document.getElementById("toast-box");
    toast.innerText = msg;
    toast.style.display = "block";
    setTimeout(() => (toast.style.display = "none"), 3000);
  }

  // 3. JD Scraper with MutationObserver
  function extractJD() {
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
    document.getElementById("jd-textarea").value = text.trim();
  }

  const observer = new MutationObserver(() => {
    extractJD();
  });

  observer.observe(document.body, { subtree: true, childList: true });
  setTimeout(extractJD, 2000); // initial call

  // 4. Analyze button logic
  document.getElementById("analyze-btn").addEventListener("click", async () => {
    const fileInput = document.getElementById("resume-file");
    const jd = document.getElementById("jd-textarea").value;
    const output = document.getElementById("output-box");
    output.style.maxHeight = "200px";
    output.style.overflowY = "auto";
    if (!fileInput.files[0]) return showToast("❌ Please upload resume");
    if (!jd.trim()) return showToast("❌ Job description missing");

    const formData = new FormData();
    formData.append("resume", fileInput.files[0]);
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
    }
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
