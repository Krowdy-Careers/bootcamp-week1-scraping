let btnscrap = document.getElementById("scrap-profile");

btnscrap.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (tab !== null) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: scrapingProfile,
    });
  }
});

const scrapingProfile = () => {
  const wait = function (milliseconds) {
    return new Promise(function (resolve) {
      setTimeout(function () {
        resolve();
      }, milliseconds);
    });
  };

  // Extraer informacion personal
  const elementNameProfile = document.querySelector(
    "div.ph5.pb5 > div.display-flex.mt2 ul li"
  );
  const elementJob = document.querySelector(
    "div.ph5.pb5 > div.display-flex.mt2 h2"
  );
  const elementLocation = document
    .querySelectorAll("div.ph5.pb5 > div.display-flex.mt2 ul")[1]
    ?.querySelector("li");
  const elementResume = document.querySelector("section.pv-about-section > p");
  elementResume?.querySelector("span > a")?.click();

  const name = elementNameProfile ? elementNameProfile.innerText : "";
  const job = elementJob ? elementJob.innerText : "";
  const location = elementLocation ? elementLocation.innerText : "";
  const resume = elementResume ? elementResume.innerText : "";

  wait(5000);
  // -------------------------
  // Extraer informacion de educacion
  const education = document.querySelector(
    "section.pv-profile-section.education-section ul"
  );
  const elementsEducation = education?.querySelectorAll("li");
  const infoEducation = [];
  elementsEducation.forEach((element) => {
    const info = element.querySelector(
      "div > div > a > div.pv-entity__summary-info"
    );
    const educationLevel =
      info?.querySelector("div > div > p > span.pv-entity__comma-item")
        ?.innerText || "";
    const educationCenter =
      info?.querySelector("div > div > h3.pv-entity__school-name")?.innerText ||
      "";
    const educationPeriod =
      info?.querySelector("div > p.pv-entity__dates > span > time")
        ?.innerText || "";
    infoEducation.push({ educationLevel, educationCenter, educationPeriod });
  });

  // -------------------------
  // Extraer informacion de experiencias laborales
  const experience = document.querySelector(
    "section.pv-profile-section.experience-section ul"
  );
  const elementsExperience = experience?.querySelectorAll("li");
  const infoExperience = [];
  elementsExperience.forEach((element) => {
    const info = element.querySelector(
      "div > div > a > div.pv-entity__summary-info"
    );
    const experienceBusiness =
      info?.querySelector("p.pv-entity__secondary-title")?.innerText || "";
    const experiencePeriod = {
      range:
        info?.querySelectorAll("div > h4")[0].querySelectorAll("span")[1]
          ?.innerText || "",
      duration:
        info?.querySelectorAll("div > h4")[1].querySelectorAll("span")[1]
          ?.innerText || "",
    };
    const experienceFunction = info?.querySelector("h3")?.innerText || "";

    infoExperience.push({
      experienceBusiness,
      experiencePeriod,
      experienceFunction,
    });
  });

  console.log([
    { personal_info: { name, job, location, resume } },
    { education_info: infoEducation },
    { experience_info: infoExperience },
  ]);
};
