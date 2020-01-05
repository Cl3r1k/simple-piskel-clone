import settings from '../../../js/settings/settings';

export default class PenSizeClass {
  constructor() {
    this.penSizeContainerElement = document.getElementById('idPenSizeContainer');
    // console.log('this.penSizeContainerElement', this.penSizeContainerElement);
    this.penSizeContainerElement.addEventListener('click', evt => this.penSizeContainerClickHandler(evt, this));
  }

  setPixelSize(pixelSize) {
    // console.log('pixelSize', pixelSize);
    settings.pixelSize = pixelSize;
    // console.log('setPixelSize() sets settings.pixelSize:', settings.pixelSize);
    this.setSelectedElement(pixelSize);
  }

  penSizeContainerClickHandler(evt, classScope) {
    // console.log('evt', evt);
    // console.log('evt.target', evt.target);
    // console.log('evt.target.attributes', evt.target.attributes);
    // console.log('evt.target.hasAttribute(data-size)', evt.target.hasAttribute('data-size'));
    if (evt.target.hasAttribute('data-pen-size')) {
      classScope.setPixelSize(evt.target.dataset.penSize);
    }
  }

  setSelectedElement(penSizeValue) {
    // console.log('penSizeValue', penSizeValue);
    const penSizeElements = this.penSizeContainerElement.querySelectorAll('[data-pen-size]');
    // console.log('penSizeElements', penSizeElements);
    penSizeElements.forEach(penSizeElement => {
      // console.log('penSizeElement', penSizeElement);
      // console.log('penSizeElement.dataset', penSizeElement.dataset);
      // console.log('penSizeElement.dataset.penSize', penSizeElement.dataset.penSize);
      // console.log('typeof penSizeValue', typeof penSizeValue);
      // console.log('typeof penSizeElement.dataset.penSize', typeof penSizeElement.dataset.penSize);
      penSizeElement.classList.toggle('selected', penSizeElement.dataset.penSize === `${penSizeValue}`);
      // console.log('penSizeElement.classList', penSizeElement.classList);
    });
  }
}
