function initializeJobDescription() {
  function extractJD() {
    const textarea = document.getElementById("jd-textarea");
    if (!textarea) return;

    textarea.style.backgroundColor = "#e6f7ff";
    textarea.style.color = "#004085";

    setTimeout(() => {
      const jdContainer =
        document.querySelector(".jobs-description-content__text") ||
        document.querySelector(".jobs-description__container") ||
        document.querySelector("[class*='job-description']");
      const jobTitle = document.querySelector(
        "h2.jobs-details-top-card__job-title"
      )?.innerText;
      const company = document.querySelector(
        ".jobs-details-top-card__company-url"
      )?.innerText;

      const text = `${jobTitle ? `Title: ${jobTitle}\n` : ""}${
        company ? `Company: ${company}\n` : ""
      }${jdContainer ? jdContainer.innerText : ""}`;
      if (textarea) textarea.value = text.trim();

      setTimeout(() => {
        if (textarea) {
          textarea.style.backgroundColor = "";
          textarea.style.color = "";
        }
      }, 500);
    }, 200);
  }

  const observer = new MutationObserver(extractJD);
  const jobContainer = document.querySelector(".jobs-details") || document.body;
  observer.observe(jobContainer, { subtree: true, childList: true });
  setTimeout(extractJD, 2000);

  return observer; // Return observer for cleanup
}
