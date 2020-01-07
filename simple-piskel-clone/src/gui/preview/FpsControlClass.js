/* eslint-disable func-names */
import settings from '../../js/settings/settings';

export default class FpsControlClass {
  constructor(fps, previewClassRef) {
    let delay = 1000 / fps;
    // let time = null;
    // let frame = -1;
    let currentFrame = -1;
    let tref;
    let then = null;

    function loop(timestamp) {
      // console.log('timestamp', timestamp);

      // console.log('then', then);
      if (then === null) {
        then = timestamp;
      }
      const elapsed = timestamp - then;

      // console.log(`elapsed: ${elapsed} > delay: ${delay} --- ${elapsed > delay}`);
      if (elapsed > delay) {
        then = timestamp - (elapsed % delay);

        // draw stuff here
        // console.log('%c call animatePreview() currentFrame:', 'color: red;', currentFrame);
        if (currentFrame >= settings.frames.length - 1) {
          currentFrame = 0;
        } else {
          currentFrame++;
        }

        // console.log('loop() fps:', fps);

        previewClassRef.animatePreview(currentFrame);
      }
      // -------------------------------------------------------

      // if (time === null) {
      //   time = timestamp;
      // }

      // const seg = Math.floor((timestamp - time) / delay);
      // // console.log(`timestamp: ${timestamp}, time: ${time}, delay: ${delay}`);
      // // console.log(`seg: ${seg} > frame: ${frame} --- ${seg > frame}`);
      // if (seg > frame) {
      //   frame = seg;

      //   // if (currentFrame === settings.frames.length - 1) {
      //   //   currentFrame = 0;
      //   // } else {
      //   //   currentFrame++;
      //   // }

      //   // // console.log('loop() fps:', fps);

      //   // previewClassRef.animatePreview(currentFrame);

      //   // callback({
      //   //   time: timestamp,
      //   //   frame,
      //   //   currentFrame,
      //   // });
      // }
      tref = requestAnimationFrame(loop);
    }
    settings.isPlaying = false;

    this.setFps = function(newFps) {
      fps = newFps;
      delay = 1000 / fps;
      // frame = -1;
      // time = null;
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
        // time = null;
        // frame = -1;
        currentFrame = -1;
      }
    };
  }
}
