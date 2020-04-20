import settings from '../../common/settings/settings';

export default class CanvasClass {
  constructor(
    applicationRef,
    penClassInstanceRef,
    eraserClassInstanceRef,
    paintBucketClassInstanceRef,
    colorPickerClassInstanceRef,
    strokeClassInstanceRef,
  ) {
    this.canvasElement = document.getElementById('idCanvas');
    this.canvasContext = this.canvasElement.getContext('2d');

    this.applicationRef = applicationRef;
    this.penClassInstanceRef = penClassInstanceRef;
    this.eraserClassInstanceRef = eraserClassInstanceRef;
    this.paintBucketClassInstanceRef = paintBucketClassInstanceRef;
    this.colorPickerClassInstanceRef = colorPickerClassInstanceRef;
    this.strokeClassInstanceRef = strokeClassInstanceRef;

    this.canvasImageData = this.canvasContext.getImageData(0, 0, this.canvasElement.width, this.canvasElement.height);

    this.setCanvasHandlers();
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
      const isLeftMouse = evt.button < 1;
      if (settings.isPenState) {
        this.canvasContext.fillStyle = isLeftMouse ? settings.primaryColor : settings.secondaryColor;
        settings.lastX = Math.floor(evt.offsetX / settings.fieldSize);
        settings.lastY = Math.floor(evt.offsetY / settings.fieldSize);
        settings.isDrawing = true;
        this.penClassInstanceRef.draw(evt.offsetX, evt.offsetY, this.canvasContext);
      }
      if (settings.isFillState) {
        this.canvasContext.fillStyle = isLeftMouse ? settings.primaryColor : settings.secondaryColor;
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
        this.canvasContext.fillStyle = isLeftMouse ? settings.primaryColor : settings.secondaryColor;
        settings.startX = Math.floor(evt.offsetX / settings.fieldSize);
        settings.startY = Math.floor(evt.offsetY / settings.fieldSize);
        settings.isStroking = true;
        this.canvasImageData = this.canvasContext.getImageData(
          0,
          0,
          this.canvasElement.width,
          this.canvasElement.height,
        );
      }
    });

    this.canvasElement.addEventListener('mouseup', evt => {
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
    const canvasImageData = this.canvasElement.toDataURL();

    this.canvasElement.width = settings.canvasMarkupSize / canvasFieldSize;
    this.canvasElement.height = settings.canvasMarkupSize / canvasFieldSize;

    this.drawImageOnCanvas(canvasImageData);
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
    this.applicationRef.updateCurrentFrame(this.canvasElement.toDataURL());
  }
}
