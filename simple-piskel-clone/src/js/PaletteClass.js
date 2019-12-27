import CanvasFloodFillerClass from './CanvasFloodFillerClass';

export default class PaletteClass {
  constructor(canvasElement, canvasContext, width, height) {
    this.currentColor = '#ffffff';
    this.previousColor = '#ffffff';
    this.canvasElement = canvasElement;
    this.canvasContext = canvasContext;
    if (width > 0 && height > 0) {
      this.canvasElement.width = width;
      this.canvasElement.height = height;
      this.canvasContext.imageSmoothingEnabled = false;
    }
    this.isFillState = false;
    this.isChooseColorState = false;
    this.isPencilState = false;
    this.isDrawing = false;
    this.lastX = 0;
    this.lastY = 0;
    this.pixelSize = 4;
    this.selectedTool = 2;
  }

  initCanvasEvents() {
    this.canvasElement.addEventListener('mousemove', evt => {
      this.draw(evt);
    });

    this.canvasElement.addEventListener('mousedown', evt => {
      if (this.isPencilState) {
        this.canvasContext.fillStyle = this.currentColor;
        this.lastX = Math.floor(evt.offsetX / this.pixelSize);
        this.lastY = Math.floor(evt.offsetY / this.pixelSize);
        this.isDrawing = true;
        this.draw(evt);
      }
      if (this.isFillState) {
        this.canvasContext.fillStyle = this.currentColor;
        this.fillCanvas(evt.offsetX, evt.offsetY, this.currentColor);
      }
      if (this.isChooseColorState) {
        this.setColorAtPixelOnCanvas(evt);
      }
    });

    this.canvasElement.addEventListener('mouseup', () => {
      this.isDrawing = false;
      this.saveAppState();
    });

    this.canvasElement.addEventListener('mouseout', () => {
      this.isDrawing = false;
    });
  }

  hexToRGBA(hexStr) {
    return `rgba(${parseInt(hexStr.substr(0, 2), 16)}, ${parseInt(hexStr.substr(2, 2), 16)}, ${parseInt(
      hexStr.substr(4, 2),
      16,
    )}, 255)`;
  }

  setCurrentColor(colorVal) {
    if (colorVal.substr(0, 1) === '#') {
      colorVal = this.hexToRGBA(colorVal.substr(1));
    }
    if (colorVal.indexOf('a') === -1) {
      colorVal = colorVal.replace(')', ', 255)').replace('rgb', 'rgba');
    }
    if (colorVal === this.currentColor) {
      return;
    }
    this.previousColor = this.currentColor;
    this.currentColor = colorVal;
    const currentColorField = document.getElementById('idCurrentColorField');
    currentColorField.style.backgroundColor = this.currentColor;
    const previousColorField = document.getElementById('idPreviousColorField');
    previousColorField.style.backgroundColor = this.previousColor;
  }

  drawPixel(dx, dy, pxSize) {
    this.canvasContext.fillRect(dx, dy, pxSize, pxSize);
  }

  drawLineBH(x0, y0, x1, y1) {
    const deltaX = Math.abs(x1 - x0);
    const deltaY = Math.abs(y1 - y0);

    const signX = x0 < x1 ? 1 : -1;
    const signY = y0 < y1 ? 1 : -1;
    let err = deltaX - deltaY;

    while (x0 !== x1 || y0 !== y1) {
      this.drawPixel(x0, y0, 1);

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

    this.drawPixel(x0, y0, 1);
  }

  // Mode Draw
  draw(evt) {
    if (!this.isDrawing) {
      return;
    }

    const newX = Math.floor(evt.offsetX / this.pixelSize);
    const newY = Math.floor(evt.offsetY / this.pixelSize);
    this.drawLineBH(this.lastX, this.lastY, newX, newY);
    this.lastX = newX;
    this.lastY = newY;
  }

  // Mode Fill
  fillCanvas(x, y, fillColor) {
    const dx = Math.floor(x / this.pixelSize);
    const dy = Math.floor(y / this.pixelSize);
    const canvasFillerInstance = new CanvasFloodFillerClass(this.canvasContext, dx, dy, fillColor);
    canvasFillerInstance.floodFill();
  }

  // Mode ColorPicker
  setColorAtPixelOnCanvas(evt) {
    const dx = Math.floor(evt.offsetX / this.pixelSize);
    const dy = Math.floor(evt.offsetY / this.pixelSize);
    const colAtPixel = this.canvasContext.getImageData(dx, dy, 1, 1).data;
    const colRGBA = `rgba(${colAtPixel[0]}, ${colAtPixel[1]}, ${colAtPixel[2]}, ${colAtPixel[3]})`;
    this.setCurrentColor(colRGBA);
  }

  setPaletteState(paletteState) {
    const fillToolEl = document.getElementById('idFillTool');
    const chooseColorToolEl = document.getElementById('idColorTool');
    const pencilToolEl = document.getElementById('idPencilTool');
    this.selectedTool = paletteState;

    // TODO: Use Urls for each cursor state
    switch (paletteState) {
      // Fill bucket
      case 0:
        this.isFillState = true;
        this.isChooseColorState = false;
        this.isPencilState = false;
        this.canvasElement.style.cursor = 'default';
        this.isDrawing = false;
        break;
      // Choose color
      case 1:
        this.isFillState = false;
        this.isChooseColorState = true;
        this.isPencilState = false;
        this.canvasElement.style.cursor = 'crosshair';
        this.isDrawing = false;
        break;
      // Pencil
      default:
        this.isFillState = false;
        this.isChooseColorState = false;
        this.isPencilState = true;
        this.canvasElement.style.cursor = 'crosshair';
        break;
    }

    fillToolEl.classList.toggle('active', this.isFillState);
    chooseColorToolEl.classList.toggle('active', this.isChooseColorState);
    pencilToolEl.classList.toggle('active', this.isPencilState);
  }

  setPixelSize(pxNewSize) {
    this.pixelSize = pxNewSize;
    this.canvasElement.width = 512 / pxNewSize;
    this.canvasElement.height = 512 / pxNewSize;
    document.getElementById('btnSize32x32').classList.toggle('active', pxNewSize === 16);
    document.getElementById('btnSize64x64').classList.toggle('active', pxNewSize === 8);
    document.getElementById('btnSize128x128').classList.toggle('active', pxNewSize === 4);

    const canvasData = localStorage.getItem('canvasImage');

    if (canvasData) {
      const img = new Image();
      img.src = canvasData;
      img.onload = () => {
        this.canvasContext.drawImage(img, 0, 0, this.canvasElement.width, this.canvasElement.width);
      };
    }
  }

  saveAppState() {
    try {
      localStorage.setItem('canvasImage', this.canvasElement.toDataURL());
      localStorage.setItem(
        'applicationState',
        JSON.stringify({
          tool: this.selectedTool,
          curColor: this.currentColor,
          prevColor: this.previousColor,
          pxSize: this.pixelSize,
        }),
      );
    } catch (err) {
      throw new Error(err);
    }
  }

  loadAppSate() {
    const canvasData = localStorage.getItem('canvasImage');
    const appData = localStorage.getItem('applicationState');

    if (canvasData) {
      const img = new Image();
      img.src = canvasData;
      img.onload = () => {
        this.canvasContext.drawImage(img, 0, 0);
      };
    }

    if (appData) {
      const appSettings = JSON.parse(appData);
      this.setPaletteState(appSettings.tool);
      this.currentColor = appSettings.prevColor;
      this.setCurrentColor(appSettings.curColor);
      this.setPixelSize(appSettings.pxSize ? appSettings.pxSize : 4);
    } else {
      const currentColorEl = document.getElementById('idCurrentColor');
      currentColorEl.value = '#00ff00';
      this.currentColor = currentColorEl.value;
      this.setPaletteState(2);
      this.setPixelSize(4);
    }
  }

  resetCanvasState() {
    this.canvasContext.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
    this.saveAppState();
  }
}
