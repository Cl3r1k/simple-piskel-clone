import settings from '../../../common/settings/settings';

export default class PenSizeClass {
  constructor() {
    this.penSizeContainerElement = document.getElementById('idPenSizeContainer');
    this.penSizeContainerElement.addEventListener('click', evt => this.penSizeContainerClickHandler(evt, this));
  }

  setPixelSize(pixelSize) {
    settings.pixelSize = pixelSize;
    this.setSelectedElement(pixelSize);
  }

  penSizeContainerClickHandler(evt, classScope) {
    if (evt.target.hasAttribute('data-pen-size')) {
      classScope.setPixelSize(evt.target.dataset.penSize);
    }
  }

  setSelectedElement(penSizeValue) {
    const penSizeElements = this.penSizeContainerElement.querySelectorAll('[data-pen-size]');
    penSizeElements.forEach(penSizeElement => {
      penSizeElement.classList.toggle('selected', penSizeElement.dataset.penSize === `${penSizeValue}`);
    });
  }
}
