import settings from '../../js/settings/settings';

export default class FramesClass {
  constructor(applicationRef) {
    this.applicationRef = applicationRef;
    settings.frames = [];
    this.framesComponentElement = document.getElementById('idFramesComponent');
    this.framesComponentElement
      .querySelector('button')
      .addEventListener('click', () => this.generateFramesList([], true));
    // this.framesComponentElement.querySelectorAll('canvas').addEventListener('click', this.selectCanvas);
  }

  updateFrame(index, toDataURL) {
    // console.log('updateFrame() index: ', index);
    const currentFrameCanvasElement = this.framesComponentElement.querySelector(`[data-frame="${index}"]`);
    const currentFrameContext = currentFrameCanvasElement.getContext('2d');

    // const currFr = this.framesComponentElement.querySelector(`[data-frame="${index}"]`);
    // console.log('currFr', currFr);

    this.drawImageOnCanvas(
      toDataURL,
      currentFrameContext,
      currentFrameCanvasElement.width,
      currentFrameCanvasElement.height,
    );

    settings.frames[index] = toDataURL;
  }

  generateFramesList(frames, isNewFrame = false) {
    const framesListElement = this.framesComponentElement.querySelector('.frames-list');
    // console.log('generateFramesList() frames:', frames);
    // console.log('generateFramesList() framesListElement:', framesListElement);
    if (frames.length) {
      // console.log('generateFramesList() frames.length:', frames.length);
      frames.forEach((frameDataURL, index) => {
        // console.log('generateFramesList() frameDataURL:', frameDataURL);
        framesListElement.append(this.generateFrame(frameDataURL, index));
        settings.frames.push(frameDataURL);
      });
    } else {
      framesListElement.append(this.generateFrame());
      settings.frames.push('');
    }

    // console.log('generateFramesList settings.selectedFrame', settings.selectedFrame);
    if (isNewFrame) {
      settings.selectedFrame = settings.frames.length - 1;
    }

    this.setSelectedFrame(settings.selectedFrame);
  }

  generateFrame(toDataURL = '', frameIndex) {
    // console.log('generateFrame() toDataURL', toDataURL);
    const liElement = document.createElement('li');
    liElement.classList.add('frame');
    const canvasElement = document.createElement('canvas');
    canvasElement.classList.add('frame-canvas');
    canvasElement.dataset.frame = frameIndex || settings.frames.length || 0;
    canvasElement.addEventListener('click', evt => this.canvasClickHandler(evt));
    canvasElement.width = settings.canvasMarkupSize / settings.fieldSize;
    canvasElement.height = settings.canvasMarkupSize / settings.fieldSize;
    const newFrameContext = canvasElement.getContext('2d');
    this.drawImageOnCanvas(toDataURL, newFrameContext, canvasElement.width, canvasElement.height);
    liElement.append(canvasElement);
    const frameNumberElement = document.createElement('span');
    frameNumberElement.classList.add('frame-icon-layout');
    frameNumberElement.classList.add('frame-number');
    frameNumberElement.textContent = frameIndex + 1;
    liElement.append(frameNumberElement);
    liElement.append(
      this.createButtonElement('frame-delete'),
      this.createButtonElement('frame-copy'),
      this.createButtonElement('frame-move'),
    );
    return liElement;
  }

  createButtonElement(className) {
    const button = document.createElement('button');
    button.classList.add('frame-icon-layout');
    button.classList.add(className);
    // button.addEventListener('click', buttonHandler);
    return button;
  }

  canvasClickHandler(evt) {
    // console.log('canvas evt', evt);
    // console.log('canvas evt', evt);
    // evt += 1;
    // console.log('canvas evt.target.dataset.frame', evt.target.dataset.frame);
    // console.log('typeof canvas evt.target.dataset.frame', typeof evt.target.dataset.frame);
    // evt.target.dataset.frame = +evt.target.dataset.frame + 1;
    this.setSelectedFrame(+evt.target.dataset.frame);
  }

  // TODO: ToDelete
  // addNewFrameHandler(classScope) {
  //   console.log('addNewFrameHandler() called');
  //   classScope.generateFramesList([], true);
  // }

  setSelectedFrame(frameIndex) {
    // console.log('setSelectedFrame() frameIndex', frameIndex);
    settings.selectedFrame = frameIndex;
    this.applicationRef.updateMainCanvas(settings.frames[frameIndex]);

    const frameElements = this.framesComponentElement.querySelectorAll('.frame');
    // console.log('setSelectedFrame() frameElements:', frameElements);
    frameElements.forEach((frameElement, index) => {
      // console.log(`setSelectedFrame() frameElement: ${frameElement}, index ${index}`);
      frameElement.classList.toggle('selected', index === frameIndex);
    });
  }

  // TODO: ToDelete
  // selectCanvas(evt) {
  //   console.log('selectCanvas() evt', evt);
  // }

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
