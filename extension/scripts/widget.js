function createWidget() {
  if (document.getElementById("matchmyresume-widget")) return;

  const widget = document.createElement("div");
  widget.id = "matchmyresume-widget";

  // Enhanced CSS with isolation and standardization
  widget.style.cssText = `
    /* CSS Reset and Isolation - Prevents inheritance from host site styles */
    all: initial;
    
    /* Core widget positioning and dimensions */
    position: fixed !important;
    top: 80px !important;
    right: 20px !important;
    width: 320px !important;
    max-width: 320px !important;
    min-width: 320px !important;
    
    /* Visual styling */
    background: white !important;
    border: 1px solid #ccc !important;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2) !important;
    z-index: 9999 !important;
    border-radius: 8px !important;
    font-family: Arial, sans-serif !important;
    
    /* Box model standardization */
    box-sizing: border-box !important;
    
    /* Reset text properties */
    font-size: 14px !important;
    line-height: 1.4 !important;
    color: #333 !important;
    text-align: left !important;
    margin: 0 !important;
    padding: 0 !important;
  `;

  widget.innerHTML = `
    <div id="drag-header" style="
      /* Header styling with CSS isolation */
      all: initial;
      cursor: move !important;
      background: #eee !important;
      padding: 6px !important;
      border-radius: 6px 6px 0 0 !important;
      font-weight: bold !important;
      display: flex !important;
      justify-content: space-between !important;
      align-items: center !important;
      box-sizing: border-box !important;
      font-family: Arial, sans-serif !important;
      font-size: 14px !important;
      color: #333 !important;
      margin: 0 !important;
      width: 100% !important;
    ">
      <span style="
        all: initial;
        font-family: Arial, sans-serif !important;
        font-size: 14px !important;
        font-weight: bold !important;
        color: #333 !important;
        margin: 0 !important;
        padding: 0 !important;
      ">📄 MatchMyResume</span>
      
      <button id="signin" style="
        /* Sign In button - standardized to prevent unwanted borders */
        all: initial;
        background: #007cba !important;
        color: white !important;
        border: none !important;
        border-radius: 4px !important;
        padding: 4px 8px !important;
        font-size: 12px !important;
        font-family: Arial, sans-serif !important;
        cursor: pointer !important;
        outline: none !important;
        box-sizing: border-box !important;
        margin: 0 !important;
        display: inline-block !important;
        text-decoration: none !important;
        line-height: 1 !important;
      ">🔐 Sign In</button>
      
      <span id="close-widget" style="
        all: initial;
        cursor: pointer !important;
        font-weight: bold !important;
        padding: 0 8px !important;
        font-family: Arial, sans-serif !important;
        font-size: 14px !important;
        color: #333 !important;
        margin: 0 !important;
        display: inline-block !important;
      ">✖️</span>
    </div>
    
    <div style="
      all: initial;
      padding: 10px !important;
      box-sizing: border-box !important;
      width: 100% !important;
      font-family: Arial, sans-serif !important;
    ">
      <!-- File upload section with constrained width to prevent overflow -->
      <div style="
        all: initial;
        width: 100% !important;
        box-sizing: border-box !important;
        margin-bottom: 10px !important;
        display: block !important; /* Stack elements vertically */
      ">
        <input type="file" id="resume-file" accept=".pdf" style="
          /* File input with constrained width */
          all: initial;
          width: calc(100% - 12px) !important; /* Account for padding */
          padding: 6px !important;
          border: 1px solid #ccc !important;
          border-radius: 4px !important;
          font-family: Arial, sans-serif !important;
          font-size: 12px !important;
          background: white !important;
          color: #333 !important;
          box-sizing: border-box !important;
          cursor: pointer !important;
          margin: 0 6px 6px 6px !important; /* Reduced margin to fit */
        " />
        
        <div id="resume-status" style="
          /* Status text constrained to prevent overflow */
          all: initial;
          font-size: 12px !important;
          color: green !important;
          font-family: Arial, sans-serif !important;
          margin: 0 6px !important; /* Align with file input */
          padding: 4px 0 !important;
          word-break: break-word !important;
          overflow-wrap: break-word !important;
          width: calc(100% - 12px) !important; /* Match file input width */
          white-space: normal !important;
          line-height: 1.3 !important;
          display: block !important;
          box-sizing: border-box !important;
          min-height: 16px !important;
        "></div>
      </div>
      
      <div style="
        all: initial;
        width: 100% !important;
        box-sizing: border-box !important;
        margin-bottom: 10px !important;
      ">
        <textarea id="jd-textarea" placeholder="Job description..." style="
          /* Textarea standardization */
          all: initial;
          width: calc(100% - 12px) !important; /* Account for padding */
          height: 80px !important;
          padding: 8px !important;
          border: 1px solid #ccc !important;
          border-radius: 4px !important;
          font-family: Arial, sans-serif !important;
          font-size: 12px !important;
          background: white !important;
          color: #333 !important;
          box-sizing: border-box !important;
          resize: vertical !important;
          outline: none !important;
          line-height: 1.4 !important;
          margin: 0 6px !important; /* Align with container */
        "></textarea>
      </div>
      
      <button id="analyze-btn" style="
        /* Analyze button standardization */
        all: initial;
        width: calc(100% - 12px) !important; /* Account for padding */
        background: #4caf50 !important;
        color: white !important;
        padding: 8px !important;
        border: none !important;
        border-radius: 4px !important;
        cursor: pointer !important;
        font-family: Arial, sans-serif !important;
        font-size: 14px !important;
        font-weight: normal !important;
        box-sizing: border-box !important;
        margin: 0 6px 10px 6px !important; /* Align with container */
        outline: none !important;
        text-decoration: none !important;
      ">Analyze</button>
      
      <div id="output-box" style="
        /* Output box as div instead of pre to avoid extra whitespace */
        all: initial;
        background: #f4f4f4 !important;
        padding: 12px !important;
        border-radius: 4px !important;
        font-family: Arial, sans-serif !important;
        font-size: 12px !important;
        color: #333 !important;
        border: 1px solid #ddd !important;
        box-sizing: border-box !important;
        width: calc(100% - 12px) !important; /* Account for padding */
        min-height: 50px !important;
        max-height: 200px !important;
        overflow-y: auto !important;
        overflow-x: hidden !important;
        margin: 0 6px !important; /* Align with container */
        word-break: break-word !important;
        overflow-wrap: break-word !important;
        line-height: 1.4 !important; /* Reduced for tighter spacing */
        scroll-behavior: smooth !important;
        scrollbar-width: thin !important;
      "></div>
      
      <div id="toast-box" style="
        /* Toast notification styling */
        all: initial;
        display: none !important;
        position: fixed !important;
        top: 20px !important;
        right: 20px !important;
        background: #f44336 !important;
        color: white !important;
        padding: 8px 12px !important;
        border-radius: 4px !important;
        font-size: 14px !important;
        z-index: 10000 !important;
        font-family: Arial, sans-serif !important;
        box-sizing: border-box !important;
        margin: 0 !important;
      "></div>
    </div>
  `;

  document.body.appendChild(widget);

  // Additional runtime CSS fixes for dynamically created elements
  const style = document.createElement("style");
  style.textContent = `
    /* Standardize copy buttons */
    #matchmyresume-widget .copy-btn {
      all: initial !important;
      background: #f0f0f0 !important;
      border: 1px solid #ccc !important;
      border-radius: 3px !important;
      padding: 2px 6px !important;
      font-size: 11px !important;
      font-family: Arial, sans-serif !important;
      cursor: pointer !important;
      margin: 0 0 0 8px !important; /* Reduced margin */
      display: inline-block !important;
      color: #333 !important;
      box-sizing: border-box !important;
      outline: none !important;
      text-decoration: none !important;
      line-height: 1 !important;
    }
    
    #matchmyresume-widget .copy-btn:hover {
      background: #e0e0e0 !important;
    }
    
    /* Ensure keyword rows are tightly spaced */
    #matchmyresume-widget .keyword-row {
      all: initial !important;
      display: flex !important;
      align-items: center !important;
      justify-content: space-between !important;
      width: 100% !important;
      margin: 2px 0 !important; /* Reduced margin for tighter spacing */
      padding: 0 !important;
      font-family: Arial, sans-serif !important;
      font-size: 12px !important;
      color: #333 !important;
      box-sizing: border-box !important;
    }
    
    #matchmyresume-widget .keyword-row span {
      all: initial !important;
      font-size: 12px !important;
      font-family: Arial, sans-serif !important;
      color: #333 !important;
      flex-grow: 1 !important;
      margin: 0 !important;
      padding: 0 !important;
      line-height: 1.2 !important;
      word-break: break-word !important;
      overflow-wrap: break-word !important;
    }
    
    /* Remove extra spacing in output box */
    #matchmyresume-widget #output-box {
      display: block !important;
      overflow-y: auto !important;
      overflow-x: hidden !important;
    }
    
    #matchmyresume-widget #output-box * {
      margin: 0 !important;
      padding: 0 !important;
      line-height: 1.2 !important; /* Tighter spacing */
    }
    
    #matchmyresume-widget #output-box br {
      display: block !important;
      margin: 4px 0 !important; /* Reduced margin */
      content: "" !important;
    }
    
    #matchmyresume-widget #output-box p,
    #matchmyresume-widget #output-box div:not(.keyword-row) {
      margin-bottom: 4px !important; /* Reduced margin */
      display: block !important;
    }
    
    /* Custom scrollbar for webkit browsers */
    #matchmyresume-widget #output-box::-webkit-scrollbar {
      width: 6px !important;
    }
    
    #matchmyresume-widget #output-box::-webkit-scrollbar-track {
      background: #f1f1f1 !important;
      border-radius: 3px !important;
    }
    
    #matchmyresume-widget #output-box::-webkit-scrollbar-thumb {
      background: #c1c1c1 !important;
      border-radius: 3px !important;
    }
    
    #matchmyresume-widget #output-box::-webkit-scrollbar-thumb:hover {
      background: #a1a1a1 !important;
    }
  `;

  document.body.appendChild(style);
}
