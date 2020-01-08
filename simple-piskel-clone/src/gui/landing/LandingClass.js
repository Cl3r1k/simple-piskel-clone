import settings from '../../common/settings/settings';

export default class LandingClass {
  constructor() {
    // console.log('const in landingClassInstance');
    const buttonsElements = document.querySelectorAll('.button-styled');
    buttonsElements.forEach(buttonsElement => {
      buttonsElement.addEventListener('click', this.showApp);
    });
  }

  showApp() {
    settings.isLandingSkip = true;
    document.getElementById('idLanding').classList.toggle('hidden', settings.isLandingSkip);
    document.getElementById('idMain').classList.toggle('hidden', !settings.isLandingSkip);
  }
}
