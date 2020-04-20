import settings from '../../../common/settings/settings';

export default class FieldSizeClass {
  constructor(applicationRef) {
    this.fieldSizeContainerElement = document.getElementById('idFieldSizeContainer');
    this.fieldSizeContainerElement.addEventListener('click', evt => this.fieldSizeContainerClickHandler(evt, this));
    this.applicationRef = applicationRef;
  }

  setFieldSize(fieldSize) {
    const canvasFieldSize32x32 = settings.canvasMarkupSize / 32;
    const canvasFieldSize64x64 = settings.canvasMarkupSize / 64;
    const canvasFieldSize128x128 = settings.canvasMarkupSize / 128;
    switch (+fieldSize) {
      case 8:
        settings.fieldSize = canvasFieldSize64x64;
        break;
      case 4:
        settings.fieldSize = canvasFieldSize128x128;
        break;
      case 16:
      default:
        settings.fieldSize = canvasFieldSize32x32;
        break;
    }
    this.setSelectedElement(fieldSize);
    // this.canvasClassInstanceRef.setCanvasFieldSize(settings.fieldSize);
    this.applicationRef.setFieldSize(settings.fieldSize);
  }

  fieldSizeContainerClickHandler(evt, classScope) {
    if (evt.target.hasAttribute('data-field-size') || evt.target.parentElement.hasAttribute('data-field-size')) {
      classScope.setFieldSize(evt.target.dataset.fieldSize || evt.target.parentElement.dataset.fieldSize);
    }
  }

  setSelectedElement(fieldSizeValue) {
    const fieldSizeElements = this.fieldSizeContainerElement.querySelectorAll('[data-field-size]');
    fieldSizeElements.forEach(fieldSizeElement => {
      fieldSizeElement.classList.toggle('selected', fieldSizeElement.dataset.fieldSize === `${fieldSizeValue}`);
    });
  }
}
