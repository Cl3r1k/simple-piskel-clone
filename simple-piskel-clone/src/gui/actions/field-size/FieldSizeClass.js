import settings from '../../../js/settings/settings';

export default class FieldSizeClass {
  constructor(canvasClassInstanceRef) {
    this.fieldSizeContainerElement = document.getElementById('idFieldSizeContainer');
    // console.log('this.fieldSizeContainerElement', this.fieldSizeContainerElement);
    this.fieldSizeContainerElement.addEventListener('click', evt => this.fieldSizeContainerClickHandler(evt, this));
    this.canvasClassInstanceRef = canvasClassInstanceRef;
  }

  setFieldSize(fieldSize) {
    const canvasFieldSize32x32 = settings.canvasMarkupSize / 32;
    const canvasFieldSize64x64 = settings.canvasMarkupSize / 64;
    const canvasFieldSize128x128 = settings.canvasMarkupSize / 128;
    // console.log('setFieldSize() fieldSize', fieldSize);
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
    // console.log(`setFieldSize() with fieldSize: ${fieldSize} sets settings.fieldSize: ${settings.fieldSize}`);
    this.setSelectedElement(fieldSize);
    // console.log('this.canvasClassInstanceRef', this.canvasClassInstanceRef);
    this.canvasClassInstanceRef.setCanvasFieldSize(settings.fieldSize);
  }

  fieldSizeContainerClickHandler(evt, classScope) {
    // console.log('evt', evt);
    // console.log('evt.target', evt.target);
    // console.log('evt.target.parentElement', evt.target.parentElement);
    // console.log('evt.target.attributes', evt.target.attributes);
    // console.log('evt.target.hasAttribute(data-field-size)', evt.target.hasAttribute('data-field-size'));
    if (evt.target.hasAttribute('data-field-size') || evt.target.parentElement.hasAttribute('data-field-size')) {
      classScope.setFieldSize(evt.target.dataset.fieldSize || evt.target.parentElement.dataset.fieldSize);
    }
  }

  setSelectedElement(fieldSizeValue) {
    // console.log('fieldSizeValue', fieldSizeValue);
    const fieldSizeElements = this.fieldSizeContainerElement.querySelectorAll('[data-field-size]');
    // console.log('fieldSizeElements', fieldSizeElements);
    fieldSizeElements.forEach(fieldSizeElement => {
      // console.log('fieldSizeElement', fieldSizeElement);
      // console.log('fieldSizeElement.dataset', fieldSizeElement.dataset);
      // console.log('fieldSizeElement.dataset.fieldSize', fieldSizeElement.dataset.fieldSize);
      // console.log('typeof fieldSizeValue', typeof fieldSizeValue);
      // console.log('typeof fieldSizeElement.dataset.fieldSize', typeof fieldSizeElement.dataset.fieldSize);
      fieldSizeElement.classList.toggle('selected', fieldSizeElement.dataset.fieldSize === `${fieldSizeValue}`);
      // console.log('fieldSizeElement.classList', fieldSizeElement.classList);
    });
  }
}
