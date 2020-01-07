import settings from '../js/settings/settings';
import CanvasClass from './canvas/CanvasClass';
import PenSizeClass from './tools/pen-size/PenSizeClass';
import FieldSizeClass from './actions/field-size/FieldSizeClass';
import ColorSwitcherClass from './tools/color-switcher/ColorSwitcherClass';
import PenClass from './tools/pen/PenClass';
import EraserClass from './tools/eraser/EraserClass';
import PaintBucketClass from './tools/paint-bucket/PaintBucketClass';
import ColorPickerClass from './tools/color-picker/ColorPickerClass';
import StrokeClass from './tools/stroke/StrokeClass';
import FramesClass from './frames/FramesClass';
import PreviewClass from './preview/PreviewClass';

const APPLICATION_SAVE_NAME = 'applicationState';
const CANVAS_SAVE_NAME = 'canvasImage';

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
    this.strokeClassInstance = new StrokeClass(this);
    this.canvasClassInstance = new CanvasClass(
      this,
      this.penClassInstance,
      this.eraserClassInstance,
      this.paintBucketClassInstance,
      this.colorPickerClassInstance,
      this.strokeClassInstance,
    );
    this.penSizeClassInstance = new PenSizeClass();
    this.fieldSizeClassInstance = new FieldSizeClass(this.canvasClassInstance);
    this.framesClassInstance = new FramesClass(this);
    this.previewClassInstance = new PreviewClass(this);

    this.loadAppSate();
  }

  // saveSettings() {
  //   // const settingsPreferences = { language: settings.language, isCelsius: settings.isCelsius };
  //   localStorage.setItem('applicationSettings', JSON.stringify(settings));
  // }

  saveAppState() {
    // console.log('%c saveAppState() called', 'color: green;');
    try {
      // this.canvasClassInstance.saveCanvasState();
      // console.log('%c saveAppState() settings.frames', 'color: green;', settings.frames);
      // const dataToSave = { frames: settings.frames };
      // console.log('%c saveAppState() dataToSave', 'color: green;', dataToSave);
      // localStorage.removeItem(APPLICATION_SAVE_NAME);
      localStorage.setItem(
        APPLICATION_SAVE_NAME,
        JSON.stringify({
          tool: settings.selectedTool,
          primaryColor: settings.primaryColor,
          secondaryColor: settings.secondaryColor,
          pixelSize: settings.pixelSize,
          fieldSize: settings.fieldSize,
          frames: settings.frames,
          selectedFrame: settings.selectedFrame,
          fps: settings.fps,
        }),
      );
    } catch (err) {
      throw new Error(err);
    }
  }

  loadAppSate() {
    const canvasImageData = localStorage.getItem(CANVAS_SAVE_NAME);
    const applicationData = localStorage.getItem(APPLICATION_SAVE_NAME);

    // TODO: Rewrite this part and create separate method for CanvasClass to drawImage()
    // TODO: Improve canvasSize change for two variants of size change (scale and not scale)
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
      // console.log('loadAppSate() appSettings.frames:', appSettings.frames);
      settings.selectedFrame = appSettings.selectedFrame || 0;
      this.framesClassInstance.generateFramesList(appSettings.frames || []);
      settings.fps = appSettings.fps || 10;
      // console.log('appSettings.fps:', appSettings.fps);
      // console.log('set settings.fps to:', settings.fps);
    } else {
      this.colorSwitcherClassInstance.setSwitcherColor(settings.primaryColor);
      this.colorSwitcherClassInstance.setSwitcherColor(settings.secondaryColor, true);
      this.setPaletteState(0);
      // this.setPixelSize(16);
      this.penSizeClassInstance.setPixelSize(1);
      this.fieldSizeClassInstance.setFieldSize('32x32');
      this.framesClassInstance.generateFramesList([]);
    }

    this.previewClassInstance.changeFps(settings.fps);
  }

  setPaletteState(paletteState) {
    // console.log('called setPaletteState() with paletteState:', paletteState);
    const pencilToolElement = document.getElementById('idPencilTool');
    const fillToolElement = document.getElementById('idPaintBucketTool');
    const eraserToolElement = document.getElementById('idEraserTool');
    const chooseColorToolElement = document.getElementById('idColorPickerTool');
    const strokeToolElement = document.getElementById('idStrokeTool');
    settings.selectedTool = paletteState;

    // TODO: Use Urls for each cursor state
    switch (paletteState) {
      // Fill bucket
      case 1:
        settings.isPenState = false;
        settings.isFillState = true;
        settings.isEraserState = false;
        settings.isChooseColorState = false;
        settings.isStrokeState = false;
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
        settings.isStrokeState = false;
        this.canvasClassInstance.canvasElement.style.cursor = 'crosshair';
        settings.isDrawing = false;
        break;
      // Choose color
      case 3:
        settings.isPenState = false;
        settings.isFillState = false;
        settings.isEraserState = false;
        settings.isChooseColorState = true;
        settings.isStrokeState = false;
        this.canvasClassInstance.canvasElement.style.cursor = 'crosshair';
        settings.isDrawing = false;
        settings.isErasing = false;
        break;
      // Stroke
      case 4:
        settings.isPenState = false;
        settings.isFillState = false;
        settings.isEraserState = false;
        settings.isChooseColorState = false;
        settings.isStrokeState = true;
        this.canvasClassInstance.canvasElement.style.cursor = 'crosshair';
        settings.isDrawing = false;
        settings.isErasing = false;
        // console.log('settings.isStrokeState', settings.isStrokeState);
        break;
      // Pencil
      case 0:
      default:
        settings.isPenState = true;
        settings.isFillState = false;
        settings.isEraserState = false;
        settings.isChooseColorState = false;
        settings.isStrokeState = false;
        this.canvasClassInstance.canvasElement.style.cursor = 'crosshair';
        settings.isErasing = false;
        break;
    }

    pencilToolElement.classList.toggle('active', settings.isPenState);
    fillToolElement.classList.toggle('active', settings.isFillState);
    eraserToolElement.classList.toggle('active', settings.isEraserState);
    chooseColorToolElement.classList.toggle('active', settings.isChooseColorState);
    strokeToolElement.classList.toggle('active', settings.isStrokeState);
  }

  updateCurrentFrame(toDataURL) {
    // console.log('updateCurrentFrame() toDataURL:', toDataURL);
    this.framesClassInstance.updateFrame(settings.selectedFrame, toDataURL);
    // this.saveAppState();
  }

  updateMainCanvas(toDataURL) {
    // console.log('updateMainCanvas() toDataURL:', toDataURL);
    this.canvasClassInstance.clearCanvas();
    this.canvasClassInstance.drawImageOnCanvas(toDataURL);
    this.previewClassInstance.changeFps(settings.fps);
    this.saveAppState();
  }

  resetCanvasState() {
    this.canvasClassInstance.clearCanvas();
    this.updateCurrentFrame('');
    this.saveAppState();
  }
}
