function initializeJobDescription() {
  const textarea = document.getElementById("jd-textarea");
  if (!textarea) return { disconnect: () => {} };

  function extractJD() {
    const isLinkedIn = window.location.hostname.includes("linkedin.com");
    const isInternshala = window.location.hostname.includes("internshala.com");

    textarea.style.backgroundColor = "#e6f7ff";
    textarea.style.color = "#004085";

    setTimeout(() => {
      let jobTitle = "";
      let company = "";
      let description = "";

      if (isLinkedIn) {
        // LinkedIn selectors
        const jdContainer =
          document.querySelector(".jobs-description-content__text") ||
          document.querySelector(".jobs-description__container") ||
          document.querySelector("[class*='job-description']");
        jobTitle =
          document.querySelector("h2.jobs-details-top-card__job-title")
            ?.innerText || "";
        company =
          document.querySelector(".jobs-details-top-card__company-url")
            ?.innerText || "";
        description = jdContainer ? jdContainer.innerText : "";
      } else if (isInternshala) {
        // Internshala selectors
        if (window.location.pathname.includes("/internship/detail/")) {
          // Job detail page
          jobTitle =
            document.querySelector("h1.internship_name")?.innerText || "";
          company = document.querySelector(".company_name")?.innerText || "";
          description =
            document.querySelector("#internship_details_container")
              ?.innerText ||
            document.querySelector(".internship_details")?.innerText ||
            "";
        } else {
          // Listing page (optional: extract from first visible job)
          const firstJob = document.querySelector(".internship_meta");
          if (firstJob) {
            jobTitle = firstJob.querySelector(".profile")?.innerText || "";
            company = firstJob.querySelector(".company_name")?.innerText || "";
            description =
              firstJob.querySelector(".internship_other_details")?.innerText ||
              "";
          }
        }
      }

      const text = `${jobTitle ? `Title: ${jobTitle}\n` : ""}${
        company ? `Company: ${company}\n` : ""
      }${description ? description : ""}`;
      textarea.value = text.trim();

      setTimeout(() => {
        textarea.style.backgroundColor = "";
        textarea.style.color = "";
      }, 500);
    }, 200);
  }

  // Observe DOM changes for dynamic content
  const observer = new MutationObserver(extractJD);
  const jobContainer =
    document.querySelector(".jobs-details") || // LinkedIn
    document.querySelector("#internships_list_container") || // Internshala listing page
    document.querySelector("#internship_details_container") || // Internshala detail page
    document.body;
  observer.observe(jobContainer, { subtree: true, childList: true });

  // Initial extraction
  setTimeout(extractJD, 2000);

  return observer;
}
