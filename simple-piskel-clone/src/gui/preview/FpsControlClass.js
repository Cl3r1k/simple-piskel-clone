/* eslint-disable func-names */
import settings from '../../common/settings/settings';

export default class FpsControlClass {
  constructor(fps, previewClassRef) {
    let delay = 1000 / fps;
    let currentFrame = -1;
    let tref;
    let then = null;

    function loop(timestamp) {
      if (then === null) {
        then = timestamp;
      }
      const elapsed = timestamp - then;

      if (elapsed > delay) {
        then = timestamp - (elapsed % delay);
        if (currentFrame >= settings.frames.length - 1) {
          currentFrame = 0;
        } else {
          currentFrame++;
        }

        previewClassRef.animatePreview(currentFrame);
      }
      tref = requestAnimationFrame(loop);
    }
    settings.isPlaying = false;

    this.setFps = function(newFps) {
      fps = newFps;
      delay = 1000 / fps;
      then = null;
    };

    this.start = function() {
      if (!settings.isPlaying) {
        settings.isPlaying = true;
        tref = requestAnimationFrame(loop);
      }
    };

    this.stop = function() {
      if (settings.isPlaying) {
        cancelAnimationFrame(tref);
        settings.isPlaying = false;
        then = null;
        currentFrame = -1;
      }
    };
  }
}
