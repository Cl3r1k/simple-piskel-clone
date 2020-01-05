import settings from '../js/settings/settings';
import CanvasClass from './canvas/CanvasClass';
import PenSizeClass from './tools/pen-size/PenSizeClass';
import FieldSizeClass from './actions/field-size/FieldSizeClass';
import ColorSwitcherClass from './tools/color-switcher/ColorSwitcherClass';
import PenClass from './tools/pen/PenClass';
import EraserClass from './tools/eraser/EraserClass';
import PaintBucketClass from './tools/paint-bucket/PaintBucketClass';
import ColorPickerClass from './tools/color-picker/ColorPickerClass';

export default class ApplicationClass {
  // constructor() {
  //   // TODO: Consider constructor() to remove
  //   // console.log('ApplicationClass constructor()');
  //   this.someVal = true;
  // }

  initApp() {
    // console.log('ApplicationClass initApp()');
    this.colorSwitcherClassInstance = new ColorSwitcherClass();
    this.penClassInstance = new PenClass(this);
    this.eraserClassInstance = new EraserClass(this);
    this.paintBucketClassInstance = new PaintBucketClass(this);
    this.colorPickerClassInstance = new ColorPickerClass(this, this.colorSwitcherClassInstance);
    this.canvasClassInstance = new CanvasClass(
      this.penClassInstance,
      this.eraserClassInstance,
      this.paintBucketClassInstance,
      this.colorPickerClassInstance,
    );
    this.penSizeClassInstance = new PenSizeClass();
    this.fieldSizeClassInstance = new FieldSizeClass(this.canvasClassInstance);

    this.loadAppSate();
  }

  // saveSettings() {
  //   // const settingsPreferences = { language: settings.language, isCelsius: settings.isCelsius };
  //   localStorage.setItem('applicationSettings', JSON.stringify(settings));
  // }

  saveAppState() {
    try {
      this.canvasClassInstance.saveCanvasState();
      localStorage.setItem(
        'applicationState',
        JSON.stringify({
          tool: settings.selectedTool,
          primaryColor: settings.primaryColor,
          secondaryColor: settings.secondaryColor,
          pixelSize: settings.pixelSize,
          fieldSize: settings.fieldSize,
        }),
      );
    } catch (err) {
      throw new Error(err);
    }
  }

  loadAppSate() {
    const canvasImageData = localStorage.getItem('canvasImage');
    const applicationData = localStorage.getItem('applicationState');

    // TODO: Rewrite this part and create separate method for CanvasClass to drawImage()
    if (canvasImageData) {
      this.canvasClassInstance.drawImageOnCanvas(canvasImageData);
    }
    // if (canvasImageData) {
    //   const img = new Image();
    //   img.src = canvasImageData;
    //   img.onload = () => {
    //     this.canvasClassInstance.canvasContext.drawImage(img, 0, 0);
    //   };
    // }
    // ---- END TODO

    // console.log('loadAppSate() applicationData', applicationData);

    if (applicationData) {
      const appSettings = JSON.parse(applicationData);
      this.setPaletteState(appSettings.tool);
      this.colorSwitcherClassInstance.setSwitcherColor(appSettings.primaryColor);
      this.colorSwitcherClassInstance.setSwitcherColor(appSettings.secondaryColor, true);
      // this.setPixelSize(appSettings.pxSize ? appSettings.pxSize : 16);
      this.penSizeClassInstance.setPixelSize(appSettings.pixelSize ? appSettings.pixelSize : 1);
      this.fieldSizeClassInstance.setFieldSize(appSettings.fieldSize ? appSettings.fieldSize : '32x32');
    } else {
      this.colorSwitcherClassInstance.setSwitcherColor(settings.primaryColor);
      this.colorSwitcherClassInstance.setSwitcherColor(settings.secondaryColor, true);
      this.setPaletteState(0);
      // this.setPixelSize(16);
      this.penSizeClassInstance.setPixelSize(1);
      this.fieldSizeClassInstance.setFieldSize('32x32');
    }
  }

  setPaletteState(paletteState) {
    // console.log('called setPaletteState() with paletteState:', paletteState);
    const pencilToolElement = document.getElementById('idPencilTool');
    const fillToolElement = document.getElementById('idPaintBucketTool');
    const eraserToolElement = document.getElementById('idEraserTool');
    const chooseColorToolElement = document.getElementById('idColorPickerTool');
    settings.selectedTool = paletteState;

    // TODO: Use Urls for each cursor state
    switch (paletteState) {
      // Fill bucket
      case 1:
        settings.isPenState = false;
        settings.isFillState = true;
        settings.isEraserState = false;
        settings.isChooseColorState = false;
        this.canvasClassInstance.canvasElement.style.cursor = 'default';
        settings.isDrawing = false;
        settings.isErasing = false;
        break;
      // Eraser
      case 2:
        settings.isPenState = false;
        settings.isFillState = false;
        settings.isEraserState = true;
        settings.isChooseColorState = false;
        this.canvasClassInstance.canvasElement.style.cursor = 'crosshair';
        settings.isDrawing = false;
        break;
      // Choose color
      case 3:
        settings.isPenState = false;
        settings.isFillState = false;
        settings.isEraserState = false;
        settings.isChooseColorState = true;
        this.canvasClassInstance.canvasElement.style.cursor = 'crosshair';
        settings.isDrawing = false;
        settings.isErasing = false;
        break;
      // Pencil
      case 0:
      default:
        settings.isPenState = true;
        settings.isFillState = false;
        settings.isEraserState = false;
        settings.isChooseColorState = false;
        this.canvasClassInstance.canvasElement.style.cursor = 'crosshair';
        settings.isErasing = false;
        break;
    }

    pencilToolElement.classList.toggle('active', settings.isPenState);
    fillToolElement.classList.toggle('active', settings.isFillState);
    eraserToolElement.classList.toggle('active', settings.isEraserState);
    chooseColorToolElement.classList.toggle('active', settings.isChooseColorState);
  }

  resetCanvasState() {
    this.canvasClassInstance.clearCanvas();
    this.saveAppState();
  }
}
