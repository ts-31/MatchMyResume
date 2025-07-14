chrome.action.onClicked.addListener((tab) => {
  if (!tab.url) return;

  const url = new URL(tab.url);

  // Skip unsupported protocols like chrome://, file://, etc.
  if (!["http:", "https:"].includes(url.protocol)) {
    console.warn("Blocked: unsupported protocol");
    return;
  }

  // Allow only known job-related websites
  const supportedHosts = [
    "www.linkedin.com",
  ];

  const isSupportedHost = supportedHosts.includes(url.hostname);

  if (!isSupportedHost) {
    console.warn(`MatchMyResume not supported on: ${url.hostname}`);
    return;
  }

  // Safe to inject
  chrome.scripting
    .executeScript({
      target: { tabId: tab.id },
      files: ["content.js"],
    })
    .catch((err) => {
      console.warn("Injection failed silently:", err.message);
    });
});
