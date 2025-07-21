function initializeAuth(showToast) {
  function updateSignInButton() {
    const signInButton = document.getElementById("signin");
    if (!signInButton) return;

    chrome.storage.local.get(["clerkJwt"], (result) => {
      if (result.clerkJwt) {
        signInButton.innerText = "✅ Logged In";
        signInButton.style.backgroundColor = "#4caf50";
        signInButton.style.color = "white";
        signInButton.disabled = true;
      } else {
        signInButton.innerText = "🔐 Sign In";
        signInButton.style.backgroundColor = "";
        signInButton.style.color = "";
        signInButton.disabled = false;
      }
    });
  }

  document.getElementById("signin").addEventListener("click", () => {
    window.open("https://match-my-resume.vercel.app/", "_blank");
  });

  chrome.storage.local.get(["resume", "justSignedIn"], (result) => {
    const status = document.getElementById("resume-status");
    if (status && result.resume) {
      status.textContent = "📎 Resume uploaded";
    }
    if (result.justSignedIn) {
      showToast("✅ Signed in successfully");
      chrome.storage.local.remove("justSignedIn", () => {
        console.log("justSignedIn flag removed on initial check");
      });
    }
    updateSignInButton();
  });

  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === "local") {
      console.log("Storage changes detected:", changes);
      if (changes.justSignedIn && changes.justSignedIn.newValue) {
        showToast("✅ Signed in successfully");
        chrome.storage.local.remove("justSignedIn", () => {
          console.log("justSignedIn flag removed on storage change");
        });
      }
      if (changes.clerkJwt) {
        updateSignInButton();
      }
    }
  });
}
