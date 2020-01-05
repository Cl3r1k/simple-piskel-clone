import settings from '../js/settings/settings';
import CanvasClass from './canvas/CanvasClass';
import PenSizeClass from './tools/pen-size/PenSizeClass';
import FieldSizeClass from './actions/field-size/FieldSizeClass';
import ColorSwitcherClass from './tools/color-switcher/ColorSwitcherClass';

export default class ApplicationClass {
  constructor() {
    // TODO: Consider constructor() to remove
    // console.log('ApplicationClass constructor()');
    this.someVal = true;
  }

  initApp() {
    // console.log('ApplicationClass initApp()');
    settings.canvasClassInstance = new CanvasClass();
    this.penSizeClassInstance = new PenSizeClass();
    this.fieldSizeClassInstance = new FieldSizeClass();
    settings.colorSwitcherClassInstance = new ColorSwitcherClass();

    this.todoHandlersForTools();

    this.loadAppSate();
  }

  // TODO: Rewrite todoHandlersForTools() to separate Classes
  todoHandlersForTools() {
    document.getElementById('idPencilTool').addEventListener('click', () => {
      this.setPaletteState(0);
    });

    document.getElementById('idPaintBucket').addEventListener('click', () => {
      this.setPaletteState(1);
    });

    document.getElementById('idEraserTool').addEventListener('click', () => {
      this.setPaletteState(2);
    });

    document.getElementById('idColorPickerTool').addEventListener('click', () => {
      this.setPaletteState(3);
    });
  }

  // saveSettings() {
  //   // const settingsPreferences = { language: settings.language, isCelsius: settings.isCelsius };
  //   localStorage.setItem('applicationSettings', JSON.stringify(settings));
  // }

  saveAppState() {
    try {
      settings.canvasClassInstance.saveCanvasState();
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
      settings.canvasClassInstance.drawImageOnCanvas(canvasImageData);
    }
    // if (canvasImageData) {
    //   const img = new Image();
    //   img.src = canvasImageData;
    //   img.onload = () => {
    //     settings.canvasClassInstance.canvasContext.drawImage(img, 0, 0);
    //   };
    // }
    // ---- END TODO

    // console.log('loadAppSate() applicationData', applicationData);

    if (applicationData) {
      const appSettings = JSON.parse(applicationData);
      this.setPaletteState(appSettings.tool);
      settings.colorSwitcherClassInstance.setSwitcherColor(appSettings.primaryColor);
      settings.colorSwitcherClassInstance.setSwitcherColor(appSettings.secondaryColor, true);
      // this.setPixelSize(appSettings.pxSize ? appSettings.pxSize : 16);
      this.penSizeClassInstance.setPixelSize(appSettings.pixelSize ? appSettings.pixelSize : 1);
      this.fieldSizeClassInstance.setFieldSize(appSettings.fieldSize ? appSettings.fieldSize : '32x32');
    } else {
      // TODO: Rewrite this part and create separate method for ColorSwitcherClass to change values for colors
      document.getElementById('idPrimaryColor').value = settings.primaryColor;
      document.getElementById('idSecondaryColor').value = settings.secondaryColor;
      // ---- END TODO
      settings.colorSwitcherClassInstance.setSwitcherColor(settings.primaryColor);
      settings.colorSwitcherClassInstance.setSwitcherColor(settings.secondaryColor, true);
      this.setPaletteState(0);
      // this.setPixelSize(16);
      this.penSizeClassInstance.setPixelSize(1);
      this.fieldSizeClassInstance.setFieldSize('32x32');
    }
  }

  // TODO: Code below should be separated to classes
  setPaletteState(paletteState) {
    const pencilToolElement = document.getElementById('idPencilTool');
    const fillToolElement = document.getElementById('idPaintBucket');
    const eraserToolElement = document.getElementById('idEraserTool');
    const chooseColorToolElement = document.getElementById('idColorPickerTool');
    settings.selectedTool = paletteState;

    // TODO: Use Urls for each cursor state
    switch (paletteState) {
      // Fill bucket
      case 1:
        settings.isPencilState = false;
        settings.isFillState = true;
        settings.isEraserState = false;
        settings.isChooseColorState = false;
        settings.canvasClassInstance.canvasElement.style.cursor = 'default';
        settings.isDrawing = false;
        settings.isErasing = false;
        break;
      // Eraser
      case 2:
        settings.isPencilState = false;
        settings.isFillState = false;
        settings.isEraserState = true;
        settings.isChooseColorState = false;
        settings.canvasClassInstance.canvasElement.style.cursor = 'crosshair';
        settings.isDrawing = false;
        break;
      // Choose color
      case 3:
        settings.isPencilState = false;
        settings.isFillState = false;
        settings.isEraserState = false;
        settings.isChooseColorState = true;
        settings.canvasClassInstance.canvasElement.style.cursor = 'crosshair';
        settings.isDrawing = false;
        settings.isErasing = false;
        break;
      // Pencil
      case 0:
      default:
        settings.isPencilState = true;
        settings.isFillState = false;
        settings.isEraserState = false;
        settings.isChooseColorState = false;
        settings.canvasClassInstance.canvasElement.style.cursor = 'crosshair';
        settings.isErasing = false;
        break;
    }

    pencilToolElement.classList.toggle('active', settings.isPencilState);
    fillToolElement.classList.toggle('active', settings.isFillState);
    eraserToolElement.classList.toggle('active', settings.isEraserState);
    chooseColorToolElement.classList.toggle('active', settings.isChooseColorState);
  }

  resetCanvasState() {
    settings.canvasClassInstance.clearCanvas();
    this.saveAppState();
  }
}
