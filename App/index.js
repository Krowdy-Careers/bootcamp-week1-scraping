let btnscrap = document.getElementById("btnscrap");

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
  let userData = [];
  const wait = function (milliseconds) {
    return new Promise(function (resolve) {
      setTimeout(function () {
        resolve();
      }, milliseconds);
    });
  };

  window.scrollTo(0, document.body.scrollHeight);
  wait(2000).then(function () {
    if(document.getElementsByClassName('profile-detail').length > 0){
      let sectionInfo = document.getElementsByClassName('display-flex mt2')[0].getElementsByClassName('flex-1 mr5')[0];
      let profile = sectionInfo.getElementsByClassName('break-words');
      const name = profile[0].innerText;
      const title = profile[1].innerText;
      wait(2000);
      if (document.getElementById("line-clamp-show-more-button")) 
        document.getElementById("line-clamp-show-more-button").click();
      const aboutMe = document.querySelector("section.pv-about-section > p").innerText;
      let persObj = {
        "name": name,
        "title": title,
        "aboutMe": aboutMe
      };
      userData.push({"personal":persObj});
    }
    
    wait(2000);
    
    if(document.getElementsByClassName('lt-line-clamp__more')[0]) document.getElementsByClassName('lt-line-clamp__more')[0].click();
    
    if(document.getElementsByClassName('pv-profile-section__see-more-inline')[0]) {
      let a = document.getElementsByClassName('pv-profile-section__see-more-inline');
      for(let i = 0; i < a.length; i++){
          a[i].click();
      }
    }
    if(document.getElementsByClassName('pv-profile-section__card-action-bar pv-skills-section__additional-skills artdeco-container-card-action-bar artdeco-button artdeco-button--tertiary artdeco-button--3 artdeco-button--fluid')[0]) 
      document.getElementsByClassName('pv-profile-section__card-action-bar pv-skills-section__additional-skills artdeco-container-card-action-bar artdeco-button artdeco-button--tertiary artdeco-button--3 artdeco-button--fluid')[0].click();

    if(document.getElementsByClassName('pv-profile-section__see-more-inline pv-profile-section__text-truncate-toggle link link-without-hover-state')[0])
      document.getElementsByClassName('pv-profile-section__see-more-inline pv-profile-section__text-truncate-toggle link link-without-hover-state')[0].click();

    if(document.getElementsByClassName('inline-show-more-text__button link')[0]) {
      let a = document.getElementsByClassName('inline-show-more-text__button link');
      for(let i = 0; i < a.length; i++){
          a[i].click();
      }
    }
    let sc = document.getElementsByClassName('pv-profile-section-pager');
    for(let x = 0; x < sc.length; x++){
      let li = sc[x].getElementsByTagName('ul')[0].children;
      let header = sc[x].getElementsByTagName('header')[0].innerText;
      let workArray = [];
      if(header.toLowerCase().replace(/[^a-z]/gi,'').match('experiencia')) {
        for(let i = 0; i < li.length; i++){
            let a = li[i].getElementsByTagName('a')[0];
            let company_logo = 'null';
            let src = a.getElementsByTagName('img')[0].src;
            if(src.match('https')) company_logo = src;
            let companyLink = 'null';
            if(!a.href.match('keywords')) companyLink = a.href;
            let div2 = a.children[1];
            if(div2){
                let role = div2.children[0].innerText;
                let company = div2.children[2].innerText;
                let dates = div2.children[3].children[0].children[1].innerText.split('–');
                let started = dates[0];
                let until = dates[1];
                let duration = div2.children[3].children[1].children[1].innerText;
                let work_location = '';
                if(div2.children[4]) work_location = div2.children[4].children[1].innerText;
                let extraInfo = '';
                if(li[i].getElementsByClassName('pv-entity__extra-details')[0]) extraInfo = li[i].getElementsByClassName('pv-entity__extra-details')[0].innerText;
                let companyObj = {
                    "company"       :company,
                    "company_logo"  :company_logo,
                    "companyLink"   :companyLink,
                    "role"          :role,
                    "started"       :started,
                    "until"         :until,
                    "duration"      :duration,
                    "work_location" :work_location,
                    "extraInfo"     :extraInfo,
                    "header"        :header
                };
                workArray.push(companyObj);
            }
            else if(li[i].children[0] && li[i].children[0].children[1]){
                let company = a.children[0].children[1].children[0].children[1].innerText;
                let duration = '';
                let li2 = li[i].children[0].children[1].getElementsByTagName('li');
                for(let j = 0; j < li2.length; j++){
                    let c2 = li2[j].getElementsByClassName('pv-entity__summary-info-v2 pv-entity__summary-info--background-section pv-entity__summary-info-margin-top')[0];
                    let role = '';
                    let work_location = '';
                    let started = '';
                    if(c2){
                        role = c2.children[0].children[1].innerText;
                        if(c2.children > 0){
                            let h4 = c2.children[1].children[0];
                            if(h4) {
                                dates = h4.children[1].innerText.split('–');
                                started = dates[0];
                                until = (dates[1]) ? dates[1] : '';
                            }
                            if(c2.children[2]) work_location = c2.children[2].innerText;
                        }
                    }
                    let d = li2[j].getElementsByClassName('pv-entity__summary-info-v2 pv-entity__summary-info--background-section pv-entity__summary-info-margin-top')[0].getElementsByClassName('t-14 t-black--light t-normal')[1];
                    if(d) duration = d.children[1].innerText;
                    let companyObj = {
                        "company"       :company,
                        "company_logo"  :company_logo,
                        "companyLink"   :companyLink,
                        "role"          :role,
                        "started"       :started,
                        "until"         :until,
                        "duration"      :duration,
                        "work_location" :work_location,
                        "header"        :header
                    };
                    workArray.push(companyObj);
                }
            }
        }
        userData.push({"work":workArray});
      
      }
      else if(header.toLowerCase().replace(/[^a-z]/gi,'').match('educacin')){

        let li_array = sc[x].getElementsByTagName('ul')[0].children;
        let educObj = [];
        for (let i = 0; i < li_array.length; i++) {
            let li = li_array[i];
            let a = li.getElementsByTagName('a')[0];
            let d2 = a.children[1];
            let src = li.children[0].getElementsByTagName('img')[0].src;
            let schoolLogo = (src.match('https')) ? src : 'null';
            let schoolLink = a.href;
            let schoolName = d2.children[0].children[0].innerText;
            let from = '';
            let till = '';
            if(d2.children[1]){
                let time = d2.children[1].getElementsByTagName('span')[1].innerText.split('–');
                from = time[0].replace(' ','');
                till = (time[1]) ? time[1].replace(' ','') : '';
            }

            let scObj = {
                "schooLogo":schoolLogo,
                "schoolLink":schoolLink,
                "schoolName":schoolName,
                "from":from,
                "till":till
            };
            educObj.push(scObj);
        }
        userData.push({"education":educObj});
      }
    }
    console.log(JSON.stringify(userData));
    console.log(userData);
  });
};
