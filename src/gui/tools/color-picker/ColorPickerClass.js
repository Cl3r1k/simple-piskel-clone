import settings from '../../../common/settings/settings';

export default class ColorPickerClass {
  constructor(applicationRef, colorSwitcherClassInstanceRef) {
    this.colorPickerElement = document.getElementById('idColorPickerTool');
    this.colorPickerElement.addEventListener('click', () => applicationRef.setPaletteState(3));
    this.colorSwitcherClassInstanceRef = colorSwitcherClassInstanceRef;
  }

  // Mode ColorPicker
  getColorAtPixelOnCanvas(offsetX, offsetY, isLeftMouse = true, canvasContext) {
    const dx = Math.floor(offsetX / settings.fieldSize);
    const dy = Math.floor(offsetY / settings.fieldSize);
    const colorAtPixel = canvasContext.getImageData(dx, dy, 1, 1).data;
    const colorRGBA = `rgba(${colorAtPixel[0]}, ${colorAtPixel[1]}, ${colorAtPixel[2]}, ${colorAtPixel[3]})`;
    this.colorSwitcherClassInstanceRef.setSwitcherColor(colorRGBA, !isLeftMouse);
  }
}
