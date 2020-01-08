import settings from '../../common/settings/settings';

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

    this.then = null;
    this.currentFrame = -1;
  }

  toggleFullScreen() {
    if (!document.fullscreenElement) {
      this.previewCanvasElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }

  animate() {
    if (!settings.isPlaying) {
      return;
    }

    this.fpsInterval = 1000 / settings.fps;

    // request another frame
    requestAnimationFrame(this.animate.bind(this));

    // calc elapsed time since last loop
    const now = Date.now();
    const elapsed = now - this.then;

    // if enough time has elapsed, draw the next frame
    if (elapsed > this.fpsInterval) {
      // Get ready for next frame by setting then=now, but...
      // Also, adjust for fpsInterval not being multiple of 16.67
      this.then = now - (elapsed % this.fpsInterval);

      if (this.currentFrame >= settings.frames.length - 1) {
        this.currentFrame = 0;
      } else {
        this.currentFrame++;
      }

      this.animatePreview(this.currentFrame);
    }
  }

  startAnimating() {
    if (!settings.isPlaying && settings.frames.length > 1) {
      settings.isPlaying = true;
      this.fpsInterval = 1000 / settings.fps;
      this.then = Date.now();
      this.animate();
    }
  }

  stopAnimating() {
    if (settings.isPlaying) {
      settings.isPlaying = false;
      this.then = null;
      this.currentFrame = -1;
    }
  }

  animatePreview(currentPreviewFrame) {
    const width = settings.canvasMarkupSize / settings.fieldSize;
    const height = settings.canvasMarkupSize / settings.fieldSize;
    this.setCanvasPreviewSize(width, height);

    this.clearCanvas(this.previewCanvasContext, width, height);
    this.drawImageOnCanvas(settings.frames[currentPreviewFrame], this.previewCanvasContext, width, height);
  }

  changeFps(newFps) {
    settings.fps = newFps;
    this.previewDisplayFpsElement.textContent = `${newFps} fps`;

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
