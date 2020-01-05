import settings from '../../../js/settings/settings';

export default class ColorPickerClass {
  constructor(applicationRef, colorSwitcherClassInstanceRef) {
    this.colorPickerElement = document.getElementById('idColorPickerTool');
    // console.log('this.colorPickerElement', this.colorPickerElement);
    this.colorPickerElement.addEventListener('click', () => applicationRef.setPaletteState(3));
    this.colorSwitcherClassInstanceRef = colorSwitcherClassInstanceRef;
  }

  // Mode ColorPicker
  getColorAtPixelOnCanvas(offsetX, offsetY, isLeftMouse = true, canvasContext) {
    const dx = Math.floor(offsetX / settings.fieldSize);
    const dy = Math.floor(offsetY / settings.fieldSize);
    const colorAtPixel = canvasContext.getImageData(dx, dy, 1, 1).data;
    const colorRGBA = `rgba(${colorAtPixel[0]}, ${colorAtPixel[1]}, ${colorAtPixel[2]}, ${colorAtPixel[3]})`;
    // console.log('getColorAtPixelOnCanvas() colorRGBA: ', colorRGBA);
    // this.setPaletteColor(colRGBA, !isLeftMouse);
    this.colorSwitcherClassInstanceRef.setSwitcherColor(colorRGBA, !isLeftMouse);
  }
}
