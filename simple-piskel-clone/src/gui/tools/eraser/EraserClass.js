import settings from '../../../js/settings/settings';
import helper from '../../../common/helper';

export default class EraserClass {
  constructor(applicationRef) {
    this.eraserElement = document.getElementById('idEraserTool');
    // console.log('this.eraserElement', this.eraserElement);
    this.eraserElement.addEventListener('click', () => applicationRef.setPaletteState(2));
  }

  // Mode Erase
  erase(offsetX, offsetY, canvasContext) {
    if (!settings.isErasing) {
      return;
    }
    const newX = Math.floor(offsetX / settings.fieldSize);
    const newY = Math.floor(offsetY / settings.fieldSize);
    // console.log(`clearRect(${newX}, ${newY}, 1, 1)`);
    helper.drawLineBH(settings.lastX, settings.lastY, newX, newY, settings.pixelSize, canvasContext, this.erasePixel);
    settings.lastX = newX;
    settings.lastY = newY;
  }

  erasePixel(dx, dy, pixelSize, canvasContext) {
    canvasContext.clearRect(dx, dy, pixelSize, pixelSize);
  }
}
