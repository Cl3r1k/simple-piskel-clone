import settings from '../../../js/settings/settings';
import { drawLineBH } from '../../../common/utils';

export default class StrokeClass {
  constructor(applicationRef) {
    this.strokeElement = document.getElementById('idStrokeTool');
    // console.log('this.eraserElement', this.eraserElement);
    this.strokeElement.addEventListener('click', () => applicationRef.setPaletteState(4));
  }

  // Mode Stroke
  drawStroke(startX, startY, endX, endY, canvasContext) {
    // console.log(`startX(${startX}), startY(${startY}) --- endX(${endX}), lastY(${endY})`);
    // console.log('settings.isStroking', settings.isStroking);
    if (!settings.isStroking) {
      return;
    }

    // const newX = Math.floor(offsetX / settings.fieldSize);
    // const newY = Math.floor(offsetY / settings.fieldSize);
    if (canvasContext.fillStyle === settings.transparentColorRGBA) {
      // console.log('CallBack: this.erasePixel???');
      drawLineBH(startX, startY, endX, endY, settings.pixelSize, canvasContext, this.clearPixel);
    } else {
      // console.log('CallBack: this.drawPixel???');
      drawLineBH(startX, startY, endX, endY, settings.pixelSize, canvasContext, this.drawPixel);
    }

    // settings.lastX = newX;
    // settings.lastY = newY;
  }

  drawPixel(dx, dy, pixelSize, canvasContext) {
    canvasContext.fillRect(dx, dy, pixelSize, pixelSize);
  }

  clearPixel(dx, dy, pixelSize, canvasContext) {
    canvasContext.clearRect(dx, dy, pixelSize, pixelSize);
  }
}
