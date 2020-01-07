import settings from '../../common/settings/settings';
import FpsControlClass from './FpsControlClass';

export default class PreviewClass {
  constructor(applicationRef) {
    this.applicationRef = applicationRef;
    this.previewComponentElement = document.getElementById('idPreviewComponent');
    this.previewComponentElement
      .querySelector('.preview-fullscreen')
      .addEventListener('click', () => this.toggleFullScreen());
    this.previewRangeFpsElement = this.previewComponentElement.querySelector('.preview-range-fps');
    this.previewRangeFpsElement.addEventListener('input', evt => this.changeFps(+evt.target.value));
    this.previewDisplayFpsElement = this.previewComponentElement.querySelector('.preview-display-fps');
    this.previewCanvasElement = this.previewComponentElement.querySelector('canvas');
    this.previewCanvasContext = this.previewCanvasElement.getContext('2d');

    this.fpsControlClassInstance = new FpsControlClass(10, this);
  }

  toggleFullScreen() {
    if (!document.fullscreenElement) {
      this.previewCanvasElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }

  animatePreview(currentPreviewFrame) {
    const width = settings.canvasMarkupSize / settings.fieldSize;
    const height = settings.canvasMarkupSize / settings.fieldSize;
    this.setCanvasPreviewSize(width, height);

    this.clearCanvas(this.previewCanvasContext, width, height);
    this.drawImageOnCanvas(settings.frames[currentPreviewFrame], this.previewCanvasContext, width, height);
  }

  startAnimating() {
    if (!settings.isPlaying && settings.frames.length > 1) {
      this.fpsControlClassInstance.start();
    }
  }

  stopAnimating() {
    this.fpsControlClassInstance.stop();
  }

  changeFps(newFps) {
    settings.fps = newFps;
    this.previewDisplayFpsElement.textContent = `${newFps} fps`;
    this.fpsControlClassInstance.setFps(newFps);

    if (newFps === 0 || settings.frames.length === 1) {
      this.stopAnimating();
      this.animatePreview(0);
    } else if (!settings.isPlaying) {
      this.startAnimating();
    }

    if (+this.previewRangeFpsElement.value !== newFps) {
      this.previewRangeFpsElement.value = newFps;
    }

    this.applicationRef.saveAppState();
  }

  setCanvasPreviewSize(width, height) {
    this.previewCanvasElement.width = width;
    this.previewCanvasElement.height = height;
  }

  drawImageOnCanvas(canvasImageData, canvasContext, width, height) {
    if (canvasImageData) {
      const img = new Image();
      img.src = canvasImageData;
      img.onload = () => {
        canvasContext.drawImage(img, 0, 0);
      };
    } else {
      this.clearCanvas(canvasContext, width, height);
    }
  }

  // Clear Canvas
  clearCanvas(canvasContext, width, height) {
    canvasContext.clearRect(0, 0, width, height);
  }
}
