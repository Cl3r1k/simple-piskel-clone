import settings from '../../js/settings/settings';

const CANVAS_SAVE_NAME = 'canvasImage';

export default class CanvasClass {
  constructor(
    applicationRef,
    penClassInstanceRef,
    eraserClassInstanceRef,
    paintBucketClassInstanceRef,
    colorPickerClassInstanceRef,
    strokeClassInstanceRef,
  ) {
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

    this.applicationRef = applicationRef;
    this.penClassInstanceRef = penClassInstanceRef;
    this.eraserClassInstanceRef = eraserClassInstanceRef;
    this.paintBucketClassInstanceRef = paintBucketClassInstanceRef;
    this.colorPickerClassInstanceRef = colorPickerClassInstanceRef;
    this.strokeClassInstanceRef = strokeClassInstanceRef;

    this.canvasImageData = this.canvasContext.getImageData(0, 0, this.canvasElement.width, this.canvasElement.height);

    this.setCanvasHandlers();
    // console.log(`constr() canvas.width: ${this.canvasElement.width}, canvas.height: ${this.canvasElement.height}`);
  }

  setCanvasHandlers() {
    this.canvasElement.addEventListener('mousemove', evt => {
      if (settings.isDrawing) {
        this.penClassInstanceRef.draw(evt.offsetX, evt.offsetY, this.canvasContext);
      }

      if (settings.isErasing) {
        this.eraserClassInstanceRef.erase(evt.offsetX, evt.offsetY, this.canvasContext);
      }

      if (settings.isStroking) {
        const endX = Math.floor(evt.offsetX / settings.fieldSize);
        const endY = Math.floor(evt.offsetY / settings.fieldSize);
        this.canvasContext.putImageData(this.canvasImageData, 0, 0);
        this.strokeClassInstanceRef.drawStroke(settings.startX, settings.startY, endX, endY, this.canvasContext);
      }
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
      if (settings.isStrokeState) {
        // console.log('settings.isStrokeState evt', evt);
        this.canvasContext.fillStyle = isLeftMouse ? settings.primaryColor : settings.secondaryColor;
        settings.startX = Math.floor(evt.offsetX / settings.fieldSize);
        settings.startY = Math.floor(evt.offsetY / settings.fieldSize);
        settings.isStroking = true;
        // console.log('settings.isStroking', settings.isStroking);
        this.canvasImageData = this.canvasContext.getImageData(
          0,
          0,
          this.canvasElement.width,
          this.canvasElement.height,
        );

        // this.strokeClassInstanceRef.
        // this.colorPickerClassInstanceRef.getColorAtPixelOnCanvas(
        //   evt.offsetX,
        //   evt.offsetY,
        //   isLeftMouse,
        //   this.canvasContext,
        // );
      }
    });

    this.canvasElement.addEventListener('mouseup', evt => {
      // console.log('settings.isDrawing', settings.isDrawing);
      // console.log('settings.isErasing', settings.isErasing);
      // console.log('settings.isStroking', settings.isStroking);
      settings.isDrawing = false;
      settings.isErasing = false;
      if (settings.isStroking) {
        const endX = Math.floor(evt.offsetX / settings.fieldSize);
        const endY = Math.floor(evt.offsetY / settings.fieldSize);
        this.strokeClassInstanceRef.drawStroke(settings.startX, settings.startY, endX, endY, this.canvasContext);
        settings.isStroking = false;
      }
      this.saveCanvasState();
    });

    this.canvasElement.addEventListener('mouseout', () => {
      settings.isDrawing = false;
      settings.isErasing = false;
      this.saveCanvasState();
    });

    this.canvasElement.oncontextmenu = () => false;
  }

  setCanvasFieldSize(canvasFieldSize) {
    // console.log('setCanvasFieldSize() canvasFieldSize', canvasFieldSize);
    this.canvasElement.width = settings.canvasMarkupSize / canvasFieldSize;
    this.canvasElement.height = settings.canvasMarkupSize / canvasFieldSize;

    const canvasImageData = localStorage.getItem(CANVAS_SAVE_NAME);

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
    } else {
      this.clearCanvas();
    }
  }

  // Clear Canvas
  clearCanvas() {
    this.canvasContext.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
  }

  saveCanvasState() {
    // TODO: Remove -localStorage.setItem('canvasImage'...-
    // localStorage.setItem('canvasImage', this.canvasElement.toDataURL());
    this.applicationRef.updateCurrentFrame(this.canvasElement.toDataURL());
  }
}
