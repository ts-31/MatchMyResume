document.getElementById("submit").addEventListener("click", async () => {
  const fileInput = document.getElementById("resume");
  const jdInput = document.getElementById("jd");
  const formData = new FormData();
  formData.append("resume", fileInput.files[0]);
  formData.append("jd", jdInput.value);

  try {
    const res = await fetch("http://localhost:3000/api/match", {
      method: "POST",
      body: formData,
    });
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
    document.getElementById("output").innerText =
      "Failed to connect to server.";
  }
});
