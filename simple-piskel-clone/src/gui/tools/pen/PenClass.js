import settings from '../../../js/settings/settings';
import helper from '../../../common/helper';

export default class PenClass {
  constructor(applicationRef) {
    this.penElement = document.getElementById('idPencilTool');
    // console.log('this.penElement', this.penElement);
    this.penElement.addEventListener('click', () => applicationRef.setPaletteState(0));
  }

  // Mode Draw
  draw(offsetX, offsetY, canvasContext) {
    // console.log('settings.isDrawing', settings.isDrawing);
    if (!settings.isDrawing) {
      return;
    }

    const newX = Math.floor(offsetX / settings.fieldSize);
    const newY = Math.floor(offsetY / settings.fieldSize);
    if (canvasContext.fillStyle === settings.transparentColorRGBA) {
      // console.log('CallBack: this.erasePixel???');
      helper.drawLineBH(settings.lastX, settings.lastY, newX, newY, settings.pixelSize, canvasContext, this.clearPixel);
    } else {
      // console.log('CallBack: this.drawPixel???');
      helper.drawLineBH(settings.lastX, settings.lastY, newX, newY, settings.pixelSize, canvasContext, this.drawPixel);
    }

    settings.lastX = newX;
    settings.lastY = newY;
  }

  drawPixel(dx, dy, pixelSize, canvasContext) {
    // console.log(`drawPixel dx: ${dx}, dy: ${dy}, pixelSize: ${pixelSize}, canvasContext: ${canvasContext}`);
    canvasContext.fillRect(dx, dy, pixelSize, pixelSize);
    // canvasContext.fillStyle = 'red';
    // canvasContext.fillRect(0, 0, 10, 10);
  }

  clearPixel(dx, dy, pixelSize, canvasContext) {
    // console.log(`erasePixel dx: ${dx}, dy: ${dy}, pixelSize: ${pixelSize}, canvasContext: ${canvasContext}`);
    canvasContext.clearRect(dx, dy, pixelSize, pixelSize);
  }
}
