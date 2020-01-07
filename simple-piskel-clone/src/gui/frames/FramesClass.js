import settings from '../../js/settings/settings';

export default class FramesClass {
  constructor(applicationRef) {
    this.applicationRef = applicationRef;
    settings.frames = [];
    this.framesComponentElement = document.getElementById('idFramesComponent');
    this.framesComponentElement
      .querySelector('.frame-new')
      .addEventListener('click', () => this.generateFramesList([], true));
    // this.framesComponentElement.querySelectorAll('canvas').addEventListener('click', this.selectCanvas);
  }

  updateFrame(index, toDataURL) {
    // console.log('updateFrame() index: ', index);
    const currentFrameCanvasElement = this.framesComponentElement.querySelector(`[data-frame="${index}"] > canvas`);
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
    liElement.dataset.frame = frameIndex || settings.frames.length || 0;
    const canvasElement = document.createElement('canvas');
    canvasElement.classList.add('frame-canvas');
    canvasElement.addEventListener('click', evt => this.canvasClickHandler(evt));
    canvasElement.width = settings.canvasMarkupSize / settings.fieldSize;
    canvasElement.height = settings.canvasMarkupSize / settings.fieldSize;
    const newFrameContext = canvasElement.getContext('2d');
    this.drawImageOnCanvas(toDataURL, newFrameContext, canvasElement.width, canvasElement.height);
    liElement.append(canvasElement);
    const frameNumberElement = document.createElement('span');
    frameNumberElement.classList.add('frame-icon-layout');
    frameNumberElement.classList.add('frame-number');
    frameNumberElement.textContent = (frameIndex || settings.frames.length || 0) + 1;
    liElement.append(frameNumberElement);

    // const button = document.createElement('button');
    // button.classList.add('frame-icon-layout');
    // button.classList.add('frame-delete');
    // button.addEventListener('click', evt => this.deleteFrame(evt));

    liElement.append(
      // button,
      this.createButtonElement('frame-delete', scope => this.deleteFrame(scope)),
      this.createButtonElement('frame-copy', scope => this.copyFrame(scope)),
      this.createButtonElement('frame-move', scope => this.moveFrame(scope)),
    );
    return liElement;
  }

  createButtonElement(className, eventHandler = null) {
    const button = document.createElement('button');
    button.classList.add('frame-icon-layout');
    button.classList.add(className);
    button.addEventListener('click', evt => eventHandler(evt));
    return button;
  }

  canvasClickHandler(evt) {
    // console.log('canvas evt', evt);
    // evt += 1;
    // console.log('canvas evt.target.dataset.frame', evt.target.dataset.frame);
    // console.log('LI evt.target.parentElement.dataset.frame', evt.target.parentElement.dataset.frame);
    // console.log('typeof canvas evt.target.dataset.frame', typeof evt.target.dataset.frame);
    // evt.target.dataset.frame = +evt.target.dataset.frame + 1;
    this.setSelectedFrame(+evt.target.parentElement.dataset.frame);
  }

  // TODO: ToDelete
  // addNewFrameHandler(classScope) {
  //   console.log('addNewFrameHandler() called');
  //   classScope.generateFramesList([], true);
  // }

  setSelectedFrame(frameIndex) {
    // console.log('%c setSelectedFrame() frameIndex', 'color: blue', frameIndex);
    settings.selectedFrame = frameIndex;
    this.applicationRef.updateMainCanvas(settings.frames[frameIndex]);

    const frameElements = this.framesComponentElement.querySelectorAll('.frame');
    // console.log('setSelectedFrame() frameElements:', frameElements);
    frameElements.forEach((frameElement, index) => {
      // console.log(`setSelectedFrame() frameElement: ${frameElement}, index ${index}`);
      frameElement.classList.toggle('selected', index === frameIndex);
    });
  }

  deleteFrame(evt) {
    // console.log('this', this);
    // console.log('deleteFrame() evt', evt);
    // console.log('deleteFrame() evt.target.parentElement.dataset.frame', evt.target.parentElement.dataset.frame);
    const indexFrameToDelete = +evt.target.parentElement.dataset.frame;
    // console.log('deleteFrame() indexFrameToDelete', indexFrameToDelete);
    // console.log('deleteFrame() settings.selectedFrame', settings.selectedFrame);

    settings.frames.splice(indexFrameToDelete, 1);
    // console.log('deleteFrame() settings.frames', settings.frames);
    // console.log('deleteFrame() typeof indexFrameToDelete', typeof indexFrameToDelete);

    const frameToDeleteElement = this.framesComponentElement.querySelector(`[data-frame="${indexFrameToDelete}"]`);
    frameToDeleteElement.parentNode.removeChild(frameToDeleteElement);

    this.updateDataset();

    this.setSelectedFrame(0);
    // if (indexFrameToDelete === settings.selectedFrame) {
    //   if (indexFrameToDelete === 0 || indexFrameToDelete !== settings.frames.length) {
    //     this.setSelectedFrame(indexFrameToDelete);
    //   } else {
    //     this.setSelectedFrame(indexFrameToDelete - 1);
    //   }
    // } else if (indexFrameToDelete === 0) {
    //   this.setSelectedFrame(indexFrameToDelete);
    // } else {
    //   this.setSelectedFrame(settings.selectedFrame - 1);
    // }
  }

  copyFrame(evt) {
    // console.log('this', this);
    // console.log('copyFrame() evt', evt);
    const indexFrameToCopy = +evt.target.parentElement.dataset.frame;
    const frameToCopyElement = this.framesComponentElement.querySelector(`[data-frame="${indexFrameToCopy}"]`);
    const frameToCopyCanvasElement = frameToCopyElement.querySelector('.frame-canvas');
    // const frameToCopyCanvasContext = frameToCopyCanvasElement.getContext('2d');

    const imageData = frameToCopyCanvasElement.toDataURL();
    // console.log('copyFrame() imageData', imageData);

    const newFrameElement = this.generateFrame(imageData, indexFrameToCopy + 1);
    // const newFrameCanvasElement = newFrameElement.querySelector('.frame-canvas');
    // const newFrameCanvasContext = newFrameCanvasElement.getContext('2d');

    // console.log('copyFrame() frameToCopyCanvasContext', frameToCopyCanvasContext);
    // console.log('copyFrame() newFrameCanvasContext', newFrameCanvasContext.get);

    settings.frames.splice(indexFrameToCopy + 1, 0, imageData);
    // settings.frames[indexFrameToCopy + 1] = frameToCopyCanvasElement.toDataURL();

    // this.drawImageOnCanvas(
    //   frameToCopyCanvasElement.toDataURL(),
    //   newFrameCanvasContext,
    //   frameToCopyCanvasElement.width,
    //   frameToCopyCanvasElement.height,
    // );

    frameToCopyElement.parentNode.insertBefore(newFrameElement, frameToCopyElement.nextSibling);

    this.updateDataset();

    this.setSelectedFrame(indexFrameToCopy + 1);
  }

  // moveFrame(evt) {
  //   // console.log('this', this);
  //   // console.log('moveFrame() evt', evt);
  // }

  updateDataset() {
    // console.log('%c updateDataset() called', 'color: green;');
    const frameElements = this.framesComponentElement.querySelectorAll('.frame');
    frameElements.forEach((frameElement, index) => {
      // console.log('updateDataset() frameElement.dataset.frame', frameElement.dataset.frame);
      const frameNumberElement = frameElement.querySelector('span');
      // console.log('updateDataset() frameNumberElement', frameNumberElement);
      // console.log('updateDataset() frameNumberElement.textContent', frameNumberElement.textContent);
      frameNumberElement.textContent = index + 1;
      frameElement.dataset.frame = index;
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
