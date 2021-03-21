let btnscrap = document.getElementById('scrap-profile')

btnscrap.addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (tab !== null) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: scrapingProfile,
    });
  }
})

const scrapingProfile = async () => {
  const wait = function (milliseconds) {
    return new Promise(function (resolve) {
      setTimeout(function () {
        resolve();
      }, milliseconds);
    });
  };


  const autoscrollToElement = async function (cssSelector) {
    var exists = document.querySelector(cssSelector) != null ? true : false;
    console.log(exists);
    while (exists) {
      let maxScrollTop = document.body.clientHeight - window.innerHeight;
      let elementScrollTop = document.querySelector(cssSelector).offsetHeight + window.innerHeight;
      let currentScrollTop = window.scrollY;

      console.log(maxScrollTop);
      console.log(currentScrollTop);

      if (maxScrollTop == currentScrollTop || elementScrollTop <= currentScrollTop) {
        break;
      }

      await wait(150);
      window.scrollBy(0, window.innerHeight/5);
    }

    return new Promise((resolve) => {
      resolve();
    });
  }

  const summaryProfile = document.querySelector('section.pv-top-card ul.pv-top-card--list').parentElement;
  const name = summaryProfile.querySelector('ul.pv-top-card--list li').innerText;
  const title = summaryProfile.querySelector('h2').innerText;
  const location = summaryProfile.querySelectorAll('ul.pv-top-card--list')[1]?.querySelector('li')?.innerText;
  
  await wait(2000);
  const elementMoreResume = document.querySelector('#line-clamp-show-more-button');
  if (elementMoreResume) elementMoreResume.click();
  const elementResume = document.querySelector('section.pv-about-section p.pv-about__summary-text');
  const resume = elementResume.innerText;

  await autoscrollToElement('div.profile-detail');

  let experienceDOM = document.querySelector('section.experience-section')
  let experienceList = experienceDOM.querySelectorAll('section');
  let experience = []
  experienceList.forEach(x => {
    if (x.querySelector('ul') != null) {
      let companyDetails = x.querySelector('div.pv-entity__company-details');
      x.querySelectorAll('div.pv-entity__role-details').forEach(y => {
        if (y.querySelector('button.inline-show-more-text__button')?.innerText == 'ver más') {
          y.querySelector('button.inline-show-more-text__button')?.click();
        }
        let element = y.querySelector('h3').parentElement;
        experience.push({
          "job": element.querySelector('h3')?.querySelector('span:not(.visually-hidden)')?.innerText,
          "company": companyDetails.querySelector('h3')?.querySelector('span:not(.visually-hidden)')?.innerText,
          "date": element.querySelector('h4.pv-entity__date-range')?.querySelector('span:not(.visually-hidden)')?.innerText,
          "location": element.querySelector('h4.pv-entity__location')?.querySelector('span:not(.visually-hidden)')?.innerText,
          "description": y.querySelector('div.pv-entity__extra-details')?.querySelector('p.pv-entity__description')?.innerText
        });
      });
    }
    else {
      if (x.querySelector('button.inline-show-more-text__button')?.innerText == 'ver más') {
        x.querySelector('button.inline-show-more-text__button')?.click();
      }
      let element = x.querySelector('h3').parentElement;
      experience.push({
        "job": element.querySelector('h3')?.innerText,
        "company": element.querySelector('p.pv-entity__secondary-title')?.firstChild.wholeText.trim(),
        "date": element.querySelector('h4.pv-entity__date-range')?.querySelector('span:not(.visually-hidden)')?.innerText,
        "location": element.querySelector('h4.pv-entity__location')?.querySelector('span:not(.visually-hidden)')?.innerText,
        "description": x.querySelector('div.pv-entity__extra-details')?.querySelector('p.pv-entity__description')?.innerText
      });
    }
  });

  let educationDOM = document.querySelector('section.education-section');
  let educationList = educationDOM.querySelectorAll('.pv-education-entity');
  let education = []
  educationList.forEach(x => {
    let element = x.querySelector('div.pv-entity__summary-info');
    let degreeInfo = element.querySelector('div.pv-entity__degree-info');
    education.push({
      "schoolName": degreeInfo.querySelector('h3.pv-entity__school-name')?.innerText,
      "degree": degreeInfo.querySelectorAll('p.pv-entity__secondary-title')[0]?.querySelector('span:not(.visually-hidden)')?.innerText,
      "study": degreeInfo.querySelectorAll('p.pv-entity__secondary-title')[1]?.querySelector('span:not(.visually-hidden)')?.innerText,
      "date": element.querySelector('p.pv-entity__dates')?.querySelector('span:not(.visually-hidden)')?.innerText,
      "description": x.querySelector('div.pv-entity__extra-details')?.querySelector('p.pv-entity__description')?.innerText
    });
  });

  console.log({ name, title, location, resume, experience, education });
}