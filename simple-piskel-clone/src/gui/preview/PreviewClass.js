import settings from '../../js/settings/settings';
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
    // console.log('this.previewComponentElement', this.previewComponentElement);
    this.previewCanvasElement = this.previewComponentElement.querySelector('canvas');
    // console.log('this.previewCanvasElement', this.previewCanvasElement);
    this.previewCanvasContext = this.previewCanvasElement.getContext('2d');

    // this.currentPreviewFrame = 0; // TODO: to delete????
    // this.fps = 10;
    this.stop = true;

    this.fpsControlClassInstance = new FpsControlClass(10, this);
  }

  toggleFullScreen() {
    // console.log('toggleFullScreen() called');
    // console.log('this', this);
    if (!document.fullscreenElement) {
      // document.getElementById('idPreviewComponent').requestFullscreen();
      this.previewCanvasElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }

  animatePreview(currentPreviewFrame) {
    // console.log('animatePreview() this', this);
    const width = settings.canvasMarkupSize / settings.fieldSize;
    const height = settings.canvasMarkupSize / settings.fieldSize;
    // console.log('settings.canvasMarkupSize / settings.fieldSize', settings.canvasMarkupSize / settings.fieldSize);

    // console.log(`--- animatePreview() width: ${width} , height: ${height}`);
    this.setCanvasPreviewSize(width, height);

    this.clearCanvas(this.previewCanvasContext, width, height);
    this.drawImageOnCanvas(settings.frames[currentPreviewFrame], this.previewCanvasContext, width, height);

    // if (currentPreviewFrame === settings.frames.length - 1) {
    //   currentPreviewFrame = 0;
    // } else {
    //   currentPreviewFrame++;
    // }
  }

  // setAnimationFps(fps = 10) {
  //   settings.fps = fps;
  //   settings.stop = false;
  //   this.startAnimating();
  // }

  // startAnimating() {
  //   console.log('startAnimating() this', this);
  //   settings.fpsInterval = 1000 / settings.fps;
  //   settings.then = Date.now();
  //   // settings.startTime = settings.then;
  //   settings.frameCount = 0;
  //   // this.stop = false;
  //   // console.log('settings.startTime', settings.startTime);

  //   function animate() {
  //     // console.log('animate() this', this);
  //     // console.log('animate() settings.stop', settings.stop);
  //     if (settings.stop) {
  //       return;
  //     }
  //     console.log('animate() called');

  //     requestAnimationFrame(animate());

  //     const now = Date.now();
  //     const elapsed = now - settings.then;

  //     if (elapsed > settings.fpsInterval) {
  //       // Get ready for next frame by setting then=now, but...
  //       // Also, adjust for fpsInterval not being multiple of 16.67
  //       settings.then = now - (elapsed % settings.fpsInterval);

  //       // draw stuff here
  //       // console.log('call animatePreview');

  //       // TESTING...Report #seconds since start and achieved fps.
  //       // const sinceStart = Math.round(((now - settings.startTime) / 1000) * 100);
  //       // const currentFps = Math.round((1000 / (sinceStart / ++settings.frameCount)) * 100) / 100;
  //       // console.log(`sinceStart: ${currentFps}, currentFps: ${currentFps}`);
  //     }
  //   }

  //   animate();
  // }

  // test2() {
  //   // function FpsCtrl(fps, callback) {
  //   //   let delay = 1000 / fps;
  //   //   let time = null;
  //   //   let frame = -1;
  //   //   let tref;
  //   //   function loop(timestamp) {
  //   //     if (time === null) time = timestamp;
  //   //     const seg = Math.floor((timestamp - time) / delay);
  //   //     if (seg > frame) {
  //   //       frame = seg;
  //   //       callback({
  //   //         time: timestamp,
  //   //         frame,
  //   //       });
  //   //     }
  //   //     tref = requestAnimationFrame(loop);
  //   //   }
  //   //   this.isPlaying = false;
  //   //   this.frameRate = function(newfps) {
  //   //     if (!arguments.length) return fps;
  //   //     fps = newfps;
  //   //     delay = 1000 / fps;
  //   //     frame = -1;
  //   //     time = null;
  //   //   };
  //   //   this.start = function() {
  //   //     if (!this.isPlaying) {
  //   //       this.isPlaying = true;
  //   //       tref = requestAnimationFrame(loop);
  //   //     }
  //   //   };
  //   //   this.pause = function() {
  //   //     if (this.isPlaying) {
  //   //       cancelAnimationFrame(tref);
  //   //       this.isPlaying = false;
  //   //       time = null;
  //   //       frame = -1;
  //   //     }
  //   //   };
  //   // }
  //   // // update canvas with some information and animation
  //   // const fps = new FpsCtrl(12, this.callbackFunction);
  //   // start the loop
  //   // if (this.stop) {
  //   //   this.fpsControlClassInstance.start();
  //   // } else {
  //   //   this.fpsControlClassInstance.stop();
  //   // }
  //   // this.stop = !this.stop;
  // }

  // callbackFunction() {
  //   // console.log(
  // `cB()! - evt.frame: ${evt.frame}, evt.time: ${evt.time}, evt.currentFrame: ${evt.currentFrame}`,
  //   // );
  //   // this.animatePreview(evt.currentFrame);
  //   // if (this.currentPreviewFrame === settings.frames.length - 1) {
  //   //   this.currentPreviewFrame = 0;
  //   // } else {
  //   //   this.currentPreviewFrame++;
  //   // }
  //   // console.log(`this.currentPreviewFrame: ${this.currentPreviewFrame}`);
  // }

  startAnimating() {
    // console.log('%c called startAnimating()', 'color: green;');
    if (!settings.isPlaying && settings.frames.length > 1) {
      this.fpsControlClassInstance.start();
    }
  }

  stopAnimating() {
    this.fpsControlClassInstance.stop();
  }

  changeFps(newFps) {
    // console.log('evt', evt);
    // console.log('evt.target.value', evt.target.value);
    // console.log('%c called changeFps()', 'color: blue;');
    settings.fps = newFps;
    // console.log('settings.fps:', settings.fps);
    this.previewDisplayFpsElement.textContent = `${newFps} fps`;
    this.fpsControlClassInstance.setFps(newFps);

    if (newFps === 0 || settings.frames.length === 1) {
      this.stopAnimating();
      this.animatePreview(0);
    } else if (!settings.isPlaying) {
      this.startAnimating();
    }

    // console.log('this.previewRangeFpsElement.value', +this.previewRangeFpsElement.value);
    if (+this.previewRangeFpsElement.value !== newFps) {
      this.previewRangeFpsElement.value = newFps;
    }

    this.applicationRef.saveAppState();
  }

  // animate() {
  //   // console.log('startAnimating() this', this);
  //   if (this.stop) {
  //     return;
  //   }

  //   requestAnimationFrame(this.animate());

  //   const now = Date.now();
  //   const elapsed = now - this.then;

  //   if (elapsed > this.fpsInterval) {
  //     // Get ready for next frame by setting then=now, but...
  //     // Also, adjust for fpsInterval not being multiple of 16.67
  //     this.then = now - (elapsed % this.fpsInterval);

  //     // draw stuff here
  //     // console.log('call animatePreview');

  //     // TESTING...Report #seconds since start and achieved fps.
  //     // var sinceStart = now - startTime;
  //     // var currentFps = Math.round(1000 / (sinceStart / ++frameCount) * 100) / 100;
  //   }
  // }

  setCanvasPreviewSize(width, height) {
    this.previewCanvasElement.width = width;
    this.previewCanvasElement.height = height;
  }

  drawImageOnCanvas(canvasImageData, canvasContext, width, height) {
    // console.log('drawImageOnCanvas() canvasImageData:', canvasImageData);
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
