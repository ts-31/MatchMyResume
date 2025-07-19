chrome.runtime.onMessageExternal.addListener((msg, sender, sendResponse) => {
  if (msg.type === "CLERK_TOKEN" && msg.token) {
    chrome.storage.local.set(
      {
        clerkJwt: msg.token,
        justSignedIn: true,
      },
      () => {
        console.log("Token saved in chrome.storage.local");
      }
    );
    sendResponse({ success: true });
  } else {
    sendResponse({ success: false });
  }
  return true;
});

chrome.action.onClicked.addListener((tab) => {
  if (!tab.url) return;

  const url = new URL(tab.url);

  // Skip unsupported protocols like chrome://, file://, etc.
  if (!["http:", "https:"].includes(url.protocol)) {
    console.warn("Blocked: unsupported protocol");
    return;
  }

  // Allow only known job-related websites
  const supportedHosts = ["www.linkedin.com"];

  const isSupportedHost = supportedHosts.includes(url.hostname);

  if (!isSupportedHost) {
    console.warn(`MatchMyResume not supported on: ${url.hostname}`);
    return;
  }

  chrome.scripting
    .executeScript({
      target: { tabId: tab.id },
      files: ["content.js"],
    })
    .catch((err) => {
      console.warn("Injection failed silently:", err.message);
    });
});
