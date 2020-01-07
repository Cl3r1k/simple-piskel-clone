import settings from '../../../js/settings/settings';
import { convertHexToRGBA } from '../../../common/utils';

export default class ColorSwitcherClass {
  constructor() {
    this.inputPrimaryColorElement = document.getElementById('idPrimaryColor');
    this.inputSecondaryColorElement = document.getElementById('idSecondaryColor');

    this.inputPrimaryColorElement.addEventListener('change', evt => this.setSwitcherColor(evt.target.value));
    this.inputSecondaryColorElement.addEventListener('change', evt => this.setSwitcherColor(evt.target.value, true));
  }

  setSwitcherColor(colorVal, isSecondary = false) {
    // console.log(`colorVal:${colorVal}, isSecondary:${isSecondary}`);
    if (colorVal.substr(0, 1) === '#') {
      colorVal = convertHexToRGBA(colorVal.substr(1));
      // console.log(`after convertHexToRGBA colorVal:${colorVal}`);
    }
    if (colorVal.indexOf('a') === -1) {
      colorVal = colorVal.replace(')', ', 255)').replace('rgb', 'rgba');
    }
    if (isSecondary) {
      settings.secondaryColor = colorVal;
    } else {
      settings.primaryColor = colorVal;
    }
    const colorField = document.getElementById(isSecondary ? 'idSecondaryColorField' : 'idPrimaryColorField');
    colorField.style.backgroundColor = colorVal;
    colorField.classList.toggle('transparent-color', colorVal === settings.transparentColorRGBA);
  }
}
