import settings from '../../../common/settings/settings';
import { drawLineBH } from '../../../common/utils';

export default class PenClass {
  constructor(applicationRef) {
    this.penElement = document.getElementById('idPencilTool');
    this.penElement.addEventListener('click', () => applicationRef.setPaletteState(0));
  }

  // Mode Draw
  draw(offsetX, offsetY, canvasContext) {
    if (!settings.isDrawing) {
      return;
    }

    const newX = Math.floor(offsetX / settings.fieldSize);
    const newY = Math.floor(offsetY / settings.fieldSize);
    if (canvasContext.fillStyle === settings.transparentColorRGBA) {
      drawLineBH(settings.lastX, settings.lastY, newX, newY, settings.pixelSize, canvasContext, this.clearPixel);
    } else {
      drawLineBH(settings.lastX, settings.lastY, newX, newY, settings.pixelSize, canvasContext, this.drawPixel);
    }

    settings.lastX = newX;
    settings.lastY = newY;
  }

  drawPixel(dx, dy, pixelSize, canvasContext) {
    canvasContext.fillRect(dx, dy, pixelSize, pixelSize);
  }

  clearPixel(dx, dy, pixelSize, canvasContext) {
    canvasContext.clearRect(dx, dy, pixelSize, pixelSize);
  }
}
