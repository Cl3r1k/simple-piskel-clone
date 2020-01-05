import CanvasFloodFillerClass from '../tools/paint-bucket/CanvasFloodFillerClass';
import settings from '../../js/settings/settings';
import colors from '../../js/settings/colors';

export default class CanvasClass {
  constructor() {
    // const canvasEl = document.getElementById('idCanvas');
    // if (canvasEl.getContext) {
    //   const ctx = canvasEl.getContext('2d');
    //   ctx.fillStyle = '#f0f00f';
    //   ctx.fillRect(20, 20, 10, 10);
    //   console.log(`canvasEl.width: ${canvasEl.width}, canvasEl.height: ${canvasEl.height}`);
    // }

    this.canvasElement = document.getElementById('idCanvas');
    this.canvasContext = this.canvasElement.getContext('2d');
    // console.log('this.canvasElement', this.canvasElement);
    // console.log('this.canvasContext', this.canvasContext);
    // this.canvasElement.addEventListener('mousemove', evt => {
    //   // console.log(`evt.offsetX: ${evt.offsetX}, evt.offsetY: ${evt.offsetY}`);
    // });
    // this.canvasElement.addEventListener('mousedown', () => {
    //   this.canvasContext.fillStyle = '#ff00ff';
    //   this.canvasContext.fillRect(10, 10, 10, 10);
    //   console.log('canvas painted');
    //   console.log(`canvas.width: ${this.canvasElement.width}, canvas.height: ${this.canvasElement.height}`);
    // });
    this.setCanvasHandlers();
    // console.log(`constr() canvas.width: ${this.canvasElement.width}, canvas.height: ${this.canvasElement.height}`);
  }

  setCanvasHandlers() {
    this.canvasElement.addEventListener('mousemove', evt => {
      this.draw(evt);
      this.erase(evt);
    });

    this.canvasElement.addEventListener('mousedown', evt => {
      // console.log('evt', evt);
      const isLeftMouse = evt.button < 1;
      if (settings.isPencilState) {
        this.canvasContext.fillStyle = isLeftMouse ? settings.primaryColor : settings.secondaryColor;
        // console.log('this.canvasContext.fillStyle', this.canvasContext.fillStyle);
        settings.lastX = Math.floor(evt.offsetX / settings.fieldSize);
        settings.lastY = Math.floor(evt.offsetY / settings.fieldSize);
        // console.log('mousedown() settings.fieldSize', settings.fieldSize);
        settings.isDrawing = true;
        this.draw(evt);
      }
      if (settings.isFillState) {
        // console.log('before isFillState - this.canvasContext.fillStyle', this.canvasContext.fillStyle);
        this.canvasContext.fillStyle = isLeftMouse ? settings.primaryColor : settings.secondaryColor;
        // console.log('isFillState - this.canvasContext.fillStyle', this.canvasContext.fillStyle);
        // console.log('isFillState - settings.primaryColor', settings.primaryColor);
        // console.log('isFillState - settings.secondaryColor', settings.secondaryColor);
        this.fillCanvas(evt.offsetX, evt.offsetY, isLeftMouse ? settings.primaryColor : settings.secondaryColor);
      }
      if (settings.isEraserState) {
        settings.lastX = Math.floor(evt.offsetX / settings.fieldSize);
        settings.lastY = Math.floor(evt.offsetY / settings.fieldSize);
        settings.isErasing = true;
        this.erase(evt);
      }
      if (settings.isChooseColorState) {
        this.getColorAtPixelOnCanvas(evt, isLeftMouse);
      }
    });

    this.canvasElement.addEventListener('mouseup', () => {
      settings.isDrawing = false;
      settings.isErasing = false;
      this.saveCanvasState();
    });

    this.canvasElement.addEventListener('mouseout', () => {
      settings.isDrawing = false;
      settings.isErasing = false;
    });

    this.canvasElement.oncontextmenu = () => false;
  }

  setCanvasFieldSize(canvasFieldSize) {
    // console.log('setCanvasFieldSize() canvasFieldSize', canvasFieldSize);
    this.canvasElement.width = settings.canvasMarkupSize / canvasFieldSize;
    this.canvasElement.height = settings.canvasMarkupSize / canvasFieldSize;

    const canvasImageData = localStorage.getItem('canvasImage');

    if (canvasImageData) {
      this.drawImageOnCanvas(canvasImageData);
    }
  }

  drawImageOnCanvas(canvasImageData) {
    if (canvasImageData) {
      const img = new Image();
      img.src = canvasImageData;
      img.onload = () => {
        this.canvasContext.drawImage(img, 0, 0);
      };
    }
  }

  // TODO: Code below is not managed to different classes
  // Mode Draw
  draw(evt) {
    // console.log('settings.isDrawing', settings.isDrawing);
    if (!settings.isDrawing) {
      return;
    }

    const newX = Math.floor(evt.offsetX / settings.fieldSize);
    const newY = Math.floor(evt.offsetY / settings.fieldSize);
    if (this.canvasContext.fillStyle === colors.transparentColorRGBA) {
      // console.log('CallBack: this.erasePixel???');
      this.drawLineBH(
        settings.lastX,
        settings.lastY,
        newX,
        newY,
        settings.pixelSize,
        this.canvasContext,
        this.erasePixel,
      );
    } else {
      // console.log('CallBack: this.drawPixel???');
      this.drawLineBH(
        settings.lastX,
        settings.lastY,
        newX,
        newY,
        settings.pixelSize,
        this.canvasContext,
        this.drawPixel,
      );
    }

    settings.lastX = newX;
    settings.lastY = newY;
  }

  drawPixel(dx, dy, pixelSize, canvasContext) {
    // console.log(`drawPixel dx: ${dx}, dy: ${dy}, pixelSize: ${pixelSize}, canvasContext: ${canvasContext}`);
    canvasContext.fillRect(dx, dy, pixelSize, pixelSize);
    // canvasContext.fillStyle = 'red';
    // canvasContext.fillRect(0, 0, 10, 10);
  }

  erasePixel(dx, dy, pixelSize, canvasContext) {
    // console.log(`erasePixel dx: ${dx}, dy: ${dy}, pixelSize: ${pixelSize}, canvasContext: ${canvasContext}`);
    canvasContext.clearRect(dx, dy, pixelSize, pixelSize);
  }

  drawLineBH(x0, y0, x1, y1, pixelSize = 1, canvasContext, callBack) {
    const deltaX = Math.abs(x1 - x0);
    const deltaY = Math.abs(y1 - y0);

    const signX = x0 < x1 ? 1 : -1;
    const signY = y0 < y1 ? 1 : -1;
    let err = deltaX - deltaY;

    while (x0 !== x1 || y0 !== y1) {
      callBack(x0, y0, pixelSize, canvasContext);

      const err2 = err * 2;
      if (err2 > -deltaY) {
        err -= deltaY;
        x0 += signX;
      }
      if (err2 < deltaX) {
        err += deltaX;
        y0 += signY;
      }
    }

    callBack(x0, y0, pixelSize, canvasContext);
  }

  // Mode Fill
  fillCanvas(x, y, fillColor) {
    const dx = Math.floor(x / settings.fieldSize);
    const dy = Math.floor(y / settings.fieldSize);
    const canvasFillerInstance = new CanvasFloodFillerClass(this.canvasContext, dx, dy, fillColor);
    canvasFillerInstance.floodFill();
  }

  // Mode Erase
  erase(evt) {
    if (!settings.isErasing) {
      return;
    }
    const newX = Math.floor(evt.offsetX / settings.fieldSize);
    const newY = Math.floor(evt.offsetY / settings.fieldSize);
    // console.log(`clearRect(${newX}, ${newY}, 1, 1)`);
    this.drawLineBH(
      settings.lastX,
      settings.lastY,
      newX,
      newY,
      settings.pixelSize,
      this.canvasContext,
      this.erasePixel,
    );
    settings.lastX = newX;
    settings.lastY = newY;
  }

  // Mode ColorPicker
  getColorAtPixelOnCanvas(evt, isLeftMouse = true) {
    const dx = Math.floor(evt.offsetX / settings.fieldSize);
    const dy = Math.floor(evt.offsetY / settings.fieldSize);
    const colorAtPixel = this.canvasContext.getImageData(dx, dy, 1, 1).data;
    const colorRGBA = `rgba(${colorAtPixel[0]}, ${colorAtPixel[1]}, ${colorAtPixel[2]}, ${colorAtPixel[3]})`;
    // this.setPaletteColor(colRGBA, !isLeftMouse);
    settings.colorSwitcherClassInstance.setSwitcherColor(colorRGBA, !isLeftMouse);
  }

  // Clear Canvas
  clearCanvas() {
    this.canvasContext.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
  }

  saveCanvasState() {
    localStorage.setItem('canvasImage', this.canvasElement.toDataURL());
  }
}
