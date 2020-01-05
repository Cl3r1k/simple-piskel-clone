import settings from '../../js/settings/settings';

export default class CanvasClass {
  constructor(penClassInstanceRef, eraserClassInstanceRef, paintBucketClassInstanceRef, colorPickerClassInstanceRef) {
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

    this.penClassInstanceRef = penClassInstanceRef;
    this.eraserClassInstanceRef = eraserClassInstanceRef;
    this.paintBucketClassInstanceRef = paintBucketClassInstanceRef;
    this.colorPickerClassInstanceRef = colorPickerClassInstanceRef;
    this.setCanvasHandlers();
    // console.log(`constr() canvas.width: ${this.canvasElement.width}, canvas.height: ${this.canvasElement.height}`);
  }

  setCanvasHandlers() {
    this.canvasElement.addEventListener('mousemove', evt => {
      // TODO: Improve and call methods only after check
      this.penClassInstanceRef.draw(evt.offsetX, evt.offsetY, this.canvasContext);
      this.eraserClassInstanceRef.erase(evt.offsetX, evt.offsetY, this.canvasContext);
    });

    this.canvasElement.addEventListener('mousedown', evt => {
      // console.log('evt', evt);
      const isLeftMouse = evt.button < 1;
      if (settings.isPenState) {
        this.canvasContext.fillStyle = isLeftMouse ? settings.primaryColor : settings.secondaryColor;
        // console.log('this.canvasContext.fillStyle', this.canvasContext.fillStyle);
        settings.lastX = Math.floor(evt.offsetX / settings.fieldSize);
        settings.lastY = Math.floor(evt.offsetY / settings.fieldSize);
        // console.log('mousedown() settings.fieldSize', settings.fieldSize);
        settings.isDrawing = true;
        this.penClassInstanceRef.draw(evt.offsetX, evt.offsetY, this.canvasContext);
      }
      if (settings.isFillState) {
        // console.log('before isFillState - this.canvasContext.fillStyle', this.canvasContext.fillStyle);
        this.canvasContext.fillStyle = isLeftMouse ? settings.primaryColor : settings.secondaryColor;
        // console.log('isFillState - this.canvasContext.fillStyle', this.canvasContext.fillStyle);
        // console.log('isFillState - settings.primaryColor', settings.primaryColor);
        // console.log('isFillState - settings.secondaryColor', settings.secondaryColor);
        this.paintBucketClassInstanceRef.fillCanvas(
          evt.offsetX,
          evt.offsetY,
          isLeftMouse ? settings.primaryColor : settings.secondaryColor,
          this.canvasContext,
        );
      }
      if (settings.isEraserState) {
        settings.lastX = Math.floor(evt.offsetX / settings.fieldSize);
        settings.lastY = Math.floor(evt.offsetY / settings.fieldSize);
        settings.isErasing = true;
        this.eraserClassInstanceRef.erase(evt.offsetX, evt.offsetY, this.canvasContext);
      }
      if (settings.isChooseColorState) {
        this.colorPickerClassInstanceRef.getColorAtPixelOnCanvas(
          evt.offsetX,
          evt.offsetY,
          isLeftMouse,
          this.canvasContext,
        );
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

  // Clear Canvas
  clearCanvas() {
    this.canvasContext.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
  }

  saveCanvasState() {
    localStorage.setItem('canvasImage', this.canvasElement.toDataURL());
  }
}
