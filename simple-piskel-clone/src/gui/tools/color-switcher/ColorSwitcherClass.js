import settings from '../../../js/settings/settings';
import colors from '../../../js/settings/colors';

export default class ColorSwitcherClass {
  constructor() {
    this.fieldSizeContainerElement = document.getElementById('idFieldSizeContainer');
    // console.log('this.fieldSizeContainerElement', this.fieldSizeContainerElement);
    this.fieldSizeContainerElement.addEventListener('click', evt => this.fieldSizeContainerClickHandler(evt, this));

    this.inputPrimaryColorElement = document.getElementById('idPrimaryColor');
    this.inputSecondaryColorElement = document.getElementById('idSecondaryColor');

    // TODO: Check this call, does it work?
    this.inputPrimaryColorElement.addEventListener('change', evt => this.setSwitcherColor(evt.target.value));
    this.inputSecondaryColorElement.addEventListener('change', evt => this.setSwitcherColor(evt.target.value, true));
    // this.inputPrimaryColorElement.addEventListener('change', () => {
    //   this.setSwitcherColor(this.inputPrimaryColorElement.value);
    // });
    // this.inputSecondaryColorElement.addEventListener('change', () => {
    //   this.setSwitcherColor(this.inputSecondaryColorElement.value, true);
    // });
    // console.log('this.fieldSizeContainerElement', this.fieldSizeContainerElement);
  }

  setSwitcherColor(colorVal, isSecondary = false) {
    // console.log(`colorVal:${colorVal}, isSecondary:${isSecondary}`);
    if (colorVal.substr(0, 1) === '#') {
      colorVal = this.convertHexToRGBA(colorVal.substr(1));
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
    colorField.classList.toggle('transparent-color', colorVal === colors.transparentColorRGBA);
  }

  // TODO: Move this method to common helper
  convertHexToRGBA(hexStr) {
    const IndexesInHexColorData = {
      red: { start: 0 },
      green: { start: 2 },
      blue: { start: 4 },
      amount: { value: 2 },
      alpha: { value: 255 },
    };
    return `rgba(${parseInt(
      hexStr.substr(IndexesInHexColorData.red.start, IndexesInHexColorData.amount.value),
      16,
    )}, ${parseInt(
      hexStr.substr(IndexesInHexColorData.green.start, IndexesInHexColorData.amount.value),
      16,
    )}, ${parseInt(hexStr.substr(IndexesInHexColorData.blue.start, IndexesInHexColorData.amount.value), 16)}, ${
      IndexesInHexColorData.alpha.value
    })`;
  }
}
