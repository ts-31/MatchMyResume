document.getElementById("submit").addEventListener("click", async () => {
  const fileInput = document.getElementById("resume");
  const jdInput = document.getElementById("jd");

  if (!fileInput.files[0]) {
    return showToast("❌ Please upload a resume.");
  }

  if (!jdInput.value.trim()) {
    return showToast("❌ Please paste a job description.");
  }

  const formData = new FormData();
  formData.append("resume", fileInput.files[0]);
  formData.append("jd", jdInput.value);

  try {
    const res = await fetch("http://localhost:3000/api/match", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Server error occurred.");
    }

    const data = await res.json();
    console.log("Response:", data);

    const output = document.getElementById("output");
    output.innerHTML = "";

    const score = document.createElement("p");
    score.innerHTML = `<strong>✅ Match Score:</strong> ${data.matchScore}`;
    output.appendChild(score);

    const suggestionHeader = document.createElement("p");
    suggestionHeader.innerHTML = `<strong>🔧 Suggestions:</strong>`;
    output.appendChild(suggestionHeader);

    const list = document.createElement("ul");
    data.suggestions.forEach((line) => {
      const li = document.createElement("li");
      li.innerText = line;
      list.appendChild(li);
    });
    output.appendChild(list);
  } catch (err) {
    console.error("Frontend error:", err.message);
    showToast(`❌ ${err.message}`);
    document.getElementById("output").innerHTML = "";
  }
});

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.style.display = "block";
  setTimeout(() => {
    toast.style.display = "none";
  }, 3000);
}
