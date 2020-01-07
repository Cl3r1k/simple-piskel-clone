import settings from '../../../common/settings/settings';
import { drawLineBH } from '../../../common/utils';

export default class StrokeClass {
  constructor(applicationRef) {
    this.strokeElement = document.getElementById('idStrokeTool');
    this.strokeElement.addEventListener('click', () => applicationRef.setPaletteState(4));
  }

  // Mode Stroke
  drawStroke(startX, startY, endX, endY, canvasContext) {
    if (!settings.isStroking) {
      return;
    }

    if (canvasContext.fillStyle === settings.transparentColorRGBA) {
      drawLineBH(startX, startY, endX, endY, settings.pixelSize, canvasContext, this.clearPixel);
    } else {
      drawLineBH(startX, startY, endX, endY, settings.pixelSize, canvasContext, this.drawPixel);
    }
  }

  drawPixel(dx, dy, pixelSize, canvasContext) {
    canvasContext.fillRect(dx, dy, pixelSize, pixelSize);
  }

  clearPixel(dx, dy, pixelSize, canvasContext) {
    canvasContext.clearRect(dx, dy, pixelSize, pixelSize);
  }
}
