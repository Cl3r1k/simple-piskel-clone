import settings from '../../common/settings/settings';

export default class FramesClass {
  constructor(applicationRef) {
    this.applicationRef = applicationRef;
    settings.frames = [];
    this.framesComponentElement = document.getElementById('idFramesComponent');
    this.framesComponentElement
      .querySelector('.frame-new')
      .addEventListener('click', () => this.generateFramesList([], true));
  }

  updateFrame(index, toDataURL) {
    const currentFrameCanvasElement = this.framesComponentElement.querySelector(`[data-frame="${index}"] > canvas`);
    const currentFrameContext = currentFrameCanvasElement.getContext('2d');

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
    if (frames.length) {
      frames.forEach((frameDataURL, index) => {
        framesListElement.append(this.generateFrame(frameDataURL, index));
        settings.frames.push(frameDataURL);
      });
    } else {
      framesListElement.append(this.generateFrame());
      settings.frames.push('');
    }

    if (isNewFrame) {
      settings.selectedFrame = settings.frames.length - 1;
    }

    this.setSelectedFrame(settings.selectedFrame);
  }

  generateFrame(toDataURL = '', frameIndex) {
    const liElement = document.createElement('li');
    liElement.classList.add('frame');
    liElement.classList.add('draggable');
    liElement.draggable = true;
    liElement.dataset.frame = frameIndex || settings.frames.length || 0;
    liElement.addEventListener('dragstart', evt => this.dragStartHandler(evt));
    liElement.addEventListener('dragend', evt => this.dragEndHandler(evt));
    liElement.addEventListener('dragover', evt => this.dragOverHandler(evt));
    liElement.addEventListener('drop', evt => this.dragDropHandler(evt));
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

    liElement.append(
      this.createButtonElement('frame-delete', scope => this.deleteFrame(scope)),
      this.createButtonElement('frame-copy', scope => this.copyFrame(scope)),
      this.createButtonElement('frame-move'),
    );

    return liElement;
  }

  createButtonElement(className, eventHandler = null) {
    const button = document.createElement('button');
    button.classList.add('frame-icon-layout');
    button.classList.add(className);
    if (eventHandler) {
      button.addEventListener('click', evt => eventHandler(evt));
    }

    return button;
  }

  canvasClickHandler(evt) {
    this.setSelectedFrame(+evt.target.parentElement.dataset.frame);
  }

  setSelectedFrame(frameIndex) {
    settings.selectedFrame = frameIndex;
    this.applicationRef.updateMainCanvas(settings.frames[frameIndex]);

    const frameElements = this.framesComponentElement.querySelectorAll('.frame');
    frameElements.forEach((frameElement, index) => {
      frameElement.classList.toggle('selected', index === frameIndex);
    });
  }

  deleteFrame(evt) {
    const indexFrameToDelete = +evt.target.parentElement.dataset.frame;

    settings.frames.splice(indexFrameToDelete, 1);

    const frameToDeleteElement = this.framesComponentElement.querySelector(`[data-frame="${indexFrameToDelete}"]`);
    frameToDeleteElement.parentNode.removeChild(frameToDeleteElement);

    this.updateDataset();

    this.setSelectedFrame(0);
  }

  copyFrame(evt) {
    const indexFrameToCopy = +evt.target.parentElement.dataset.frame;
    const frameToCopyElement = this.framesComponentElement.querySelector(`[data-frame="${indexFrameToCopy}"]`);
    const frameToCopyCanvasElement = frameToCopyElement.querySelector('.frame-canvas');

    const imageData = frameToCopyCanvasElement.toDataURL();

    const newFrameElement = this.generateFrame(imageData, indexFrameToCopy + 1);

    settings.frames.splice(indexFrameToCopy + 1, 0, imageData);

    frameToCopyElement.parentNode.insertBefore(newFrameElement, frameToCopyElement.nextSibling);

    this.updateDataset();

    this.setSelectedFrame(indexFrameToCopy + 1);
  }

  dragStartHandler(evt) {
    this.dragged = evt.target;
    evt.target.style.opacity = 0.5;
  }

  dragEndHandler(evt) {
    evt.target.style.opacity = '';
  }

  dragOverHandler(evt) {
    evt.preventDefault();
  }

  dragDropHandler(evt) {
    evt.preventDefault();

    const targetParentElement = evt.target.parentNode;
    if (targetParentElement.hasAttribute('data-frame')) {
      const parentContainer = targetParentElement.parentNode;
      const movedImageData = settings.frames.splice(this.dragged.dataset.frame, 1);
      settings.frames.splice(targetParentElement.dataset.frame, 0, ...movedImageData);

      parentContainer.removeChild(this.dragged);
      if (targetParentElement.dataset.frame < this.dragged.dataset.frame) {
        parentContainer.insertBefore(this.dragged, targetParentElement);
      } else {
        parentContainer.insertBefore(this.dragged, targetParentElement.nextSibling);
      }

      this.updateDataset();

      this.setSelectedFrame(+this.dragged.dataset.frame);
    }
  }

  updateDataset() {
    const frameElements = this.framesComponentElement.querySelectorAll('.frame');
    frameElements.forEach((frameElement, index) => {
      const frameNumberElement = frameElement.querySelector('span');
      frameNumberElement.textContent = index + 1;
      frameElement.dataset.frame = index;
    });
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
