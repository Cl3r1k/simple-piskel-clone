import CanvasFloodFillerClass from './CanvasFloodFillerClass';
import settings from '../../../js/settings/settings';

export default class PaintBucketClass {
  constructor(applicationRef) {
    this.paintBucketElement = document.getElementById('idPaintBucketTool');
    // console.log('this.paintBucketElement', this.paintBucketElement);
    this.paintBucketElement.addEventListener('click', () => applicationRef.setPaletteState(1));
  }

  // Mode Fill
  fillCanvas(x, y, fillColor, canvasContext) {
    const dx = Math.floor(x / settings.fieldSize);
    const dy = Math.floor(y / settings.fieldSize);
    const canvasFillerInstance = new CanvasFloodFillerClass(canvasContext, dx, dy, fillColor);
    canvasFillerInstance.floodFill();
  }
}
