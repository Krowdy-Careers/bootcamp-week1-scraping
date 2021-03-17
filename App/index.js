let btnscrap = document.getElementById('scrap-profile')

btnscrap.addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({active: true, currentWindow: true});

  if (tab!== null) {
    chrome.scripting.executeScript({
      target: {tabId: tab.id},
      function: scrapingProfile,
    });
  }
})

const scrapingProfile = () => {
  const waitFor = function (milliseconds) {
    return new Promise(function (resolve) {
      setTimeout(function () {
        resolve();
      }, milliseconds);
    });
  };
  // Se Selecciona el elemento principal de la sección de perfil
  const profileSite = document.querySelector("div.ph5.pb5 > div.display-flex.mt2")
  // Se Selecciona los tags hijos del padre 
  const name = profileSite.querySelector("ul li.inline")?.innerText || ''
  const title = profileSite.querySelector("h2")?.innerText || ''
  const location = profileSite.querySelector("ul li.t-16")?.innerText || ''

  // Busco con el btn ver más" 
  const elementMoreResume = document.getElementById('line-clamp-show-more-button')
  // Hago clic en él (btn) para ver más, solo si existe.
  if (elementMoreResume) elementMoreResume.click();
  // luego me desplazo al pie de página de la página
  document.querySelector(".global-footer.global-footer--static.ember-view").scrollIntoView()
  // Se Espera 2 seg - lazy render
  waitFor(2000).then(() => {
    const resume = document.querySelector('section.pv-about-section > p')?.innerText || ""
    // Guardo todo en un Profile constant para administrarlo 
    const profile = {name, title, location, resume}
    // Selecciona la sección de : experience
    const workExperienceSite = document.querySelector("#experience-section ul")
    // Declara la variable experience de tipo Array
    let workExperience = []
    // Array.from: crea una nueva instancia de Array a partir de un objeto iterable
    // map: El método map() crea un nuevo array con los resultados de llamada a la función indicada aplicados a cada uno de sus elementos
    Array.from(workExperienceSite.querySelectorAll("li div.pv-entity__summary-info")).map(experienceElement => {
      const workSite = experienceElement.querySelector("p.pv-entity__secondary-title")?.innerText || ""
      const period = experienceElement.querySelectorAll("h4 span")[1]?.innerText || ""
      const tasks = experienceElement.querySelector("h3")?.innerText || ""
      workExperience.push({workSite, period, tasks})
    })

    // Se selecciona el contenido de educación
    const educationSite = document.querySelector("#education-section ul")
    let study = []
    Array.from(educationSite.querySelectorAll("li div.pv-entity__summary-info")).map(educationElement => {
      const schoolName = educationElement.querySelector("h3")?.innerText || ""
      const period = educationElement.querySelectorAll("div p.pv-entity__dates span")[1]?.innerText || ""
      let degree = []
      Array.from(educationElement.querySelectorAll("div.pv-entity__degree-info p span"))
        .map((degreeName, k) => {
          if (k % 2 !== 0) {
            degree.push(degreeName.innerText)
          }
        })
      degree = degree.join(", ")
      study.push({schoolName, period, degree})
    })

    const profileAll = {...profile, workExperience, study}
    console.log(profileAll)
  })
}
