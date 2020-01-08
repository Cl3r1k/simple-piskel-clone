import settings from '../common/settings/settings';
import LandingClass from './landing/LandingClass';
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
import HotkeysClass from './actions/hotkeys/HotkeysClass';

const APPLICATION_SAVE_NAME = 'applicationState';
const DEFAULT_PIXEL_SIZE = 1;
const DEFAULT_FIELD_SIZE = 8;
const DEFAULT_SELECTED_FRAME = 0;
const DEFAULT_PALETTE_TOOL = 0;

export default class ApplicationClass {
  initApp() {
    this.landingClassInstance = new LandingClass();
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
    this.fieldSizeClassInstance = new FieldSizeClass(this);
    this.framesClassInstance = new FramesClass(this);
    this.previewClassInstance = new PreviewClass(this);
    this.hotkeysClassInstance = new HotkeysClass(this, this.penSizeClassInstance, this.framesClassInstance);

    this.loadAppSate();
  }

  saveAppState() {
    try {
      // console.log('saveAppState() settings.fps', settings.fps);
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
          isLandingSkip: settings.isLandingSkip,
        }),
      );
    } catch (err) {
      throw new Error(err);
    }
  }

  loadAppSate() {
    const applicationData = localStorage.getItem(APPLICATION_SAVE_NAME);

    if (applicationData) {
      const appSettings = JSON.parse(applicationData);
      this.setPaletteState(appSettings.tool);
      this.colorSwitcherClassInstance.setSwitcherColor(appSettings.primaryColor);
      this.colorSwitcherClassInstance.setSwitcherColor(appSettings.secondaryColor, true);
      this.penSizeClassInstance.setPixelSize(appSettings.pixelSize ? appSettings.pixelSize : DEFAULT_PIXEL_SIZE);
      this.fieldSizeClassInstance.setFieldSize(appSettings.fieldSize ? appSettings.fieldSize : DEFAULT_FIELD_SIZE);
      settings.selectedFrame = appSettings.selectedFrame || DEFAULT_SELECTED_FRAME;
      this.framesClassInstance.generateFramesList(appSettings.frames || []);
      settings.fps = appSettings.fps;
      if (appSettings.isLandingSkip) {
        this.landingClassInstance.showApp();
      }
      this.previewClassInstance.changeFps(settings.fps);
    } else {
      this.colorSwitcherClassInstance.setSwitcherColor(settings.primaryColor);
      this.colorSwitcherClassInstance.setSwitcherColor(settings.secondaryColor, true);
      this.setPaletteState(DEFAULT_PALETTE_TOOL);
      this.penSizeClassInstance.setPixelSize(DEFAULT_PIXEL_SIZE);
      this.fieldSizeClassInstance.setFieldSize(DEFAULT_FIELD_SIZE);
      this.framesClassInstance.generateFramesList([]);
    }
  }

  setPaletteState(paletteState) {
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
    this.framesClassInstance.updateFrame(settings.selectedFrame, toDataURL);
  }

  updateMainCanvas(toDataURL) {
    this.canvasClassInstance.clearCanvas();
    this.canvasClassInstance.drawImageOnCanvas(toDataURL);
    this.previewClassInstance.changeFps(settings.fps);
    this.saveAppState();
  }

  setFieldSize(fieldSize) {
    this.canvasClassInstance.setCanvasFieldSize(fieldSize);
    this.framesClassInstance.setFramesFieldSize(fieldSize);
  }

  resetCanvasState() {
    this.canvasClassInstance.clearCanvas();
    this.updateCurrentFrame('');
    this.saveAppState();
  }
}
