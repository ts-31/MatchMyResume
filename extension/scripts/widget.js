function createWidget() {
  if (document.getElementById("matchmyresume-widget")) return;

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
      <span>📄 MatchMyResume</span><button id="signin">🔐 Sign In</button>
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
}
