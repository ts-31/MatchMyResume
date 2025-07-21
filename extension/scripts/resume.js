function initializeResume(showToast) {
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
}
