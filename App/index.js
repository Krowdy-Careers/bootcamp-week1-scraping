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

const scrapingProfile = () => {
    const wait = function (milliseconds) {
        return new Promise(function (resolve) {
            setTimeout(function () {
                resolve();
            }, milliseconds);
        });
    };

    const elementNameProfile = document.querySelector("div.ph5.pb5 > div.display-flex.mt2 ul li")
    const elementNameTitle = document.querySelector("div.ph5.pb5 > div.display-flex.mt2 h2")
    const name = elementNameProfile ? elementNameProfile.innerText : '';
    const title = elementNameTitle ? elementNameTitle.innerText : '';
    wait(2000)
    const elementMoreResume = document.getElementById('line-clamp-show-more-button')
    if (elementMoreResume) elementMoreResume.click();
    const elementResume = document.querySelector('section.pv-about-section > p')
    const resume = elementResume.innerText

    document.querySelector(".global-footer.global-footer--static.ember-view").scrollIntoView()
    let exp = []
    let edc = []

    const exp_sec = document.querySelector("#experience-section ul")
    const edu_sec = document.querySelector("#education-section ul");

    let company, term, work, place = '';

    [...exp_sec.querySelectorAll("li section")].map(expItem => {
        if (expItem.querySelector("section ul")) {
            company = expItem.querySelector("h3 span").nextElementSibling?.innerText || "";
            [...expItem.querySelectorAll("li")].map(subExpItem => {
                term = subExpItem.querySelectorAll("h4 span")[1]?.innerText || ""
                work = subExpItem.querySelector("h3 span").nextElementSibling?.innerText || ""
                place = subExpItem.querySelectorAll("h4.pv-entity__location span")[1]?.innerText || ""
                exp.push({ company, term, work, place })
            })
        }
        else {
            company = expItem.querySelector("p.pv-entity__secondary-title")?.innerText || ""
            term = expItem.querySelectorAll("h4 span")[1]?.innerText || ""
            work = expItem.querySelector("h3")?.innerText || ""
            place = expItem.querySelectorAll("h4.pv-entity__location span")[1]?.innerText || ""
            exp.push({ company, term, work, place })
        }
    });

    [...edu_sec.querySelectorAll("li div.pv-entity__summary-info")].map(edcItem => {
        const school = edcItem.querySelector("h3")?.innerText || ""
        const term = edcItem.querySelectorAll("div p.pv-entity__dates span")[1]?.innerText || ""
        let degree = {
            "name": edcItem.querySelectorAll("div.pv-entity__degree-info p span")[1].innerText,
            "discipline": edcItem.querySelectorAll("div.pv-entity__degree-info p span")[3].innerText
        }
        edc.push({ school, term, degree })
    })

    console.log({ name, title, resume, exp, edc })
}
