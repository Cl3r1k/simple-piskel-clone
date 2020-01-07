import settings from '../../js/settings/settings';

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

    // const moveButton = document.createElement('button');
    // moveButton.classList.add('frame-icon-layout');
    // moveButton.classList.add('frame-move');
    // moveButton.classList.add('draggable');
    // // moveButton.addEventListener('click', evt => this.dragOverHandler(evt));
    // moveButton.addEventListener('dragstart', evt => this.dragStartHandler(evt));
    // moveButton.addEventListener('dragend', evt => this.dragEndHandler(evt));
    // moveButton.addEventListener('dragover', evt => this.dragOverHandler(evt));
    // moveButton.addEventListener('drop', evt => this.dragDropHandler(evt));
    // moveButton.draggable = true;

    liElement.append(
      // button,
      this.createButtonElement('frame-delete', scope => this.deleteFrame(scope)),
      this.createButtonElement('frame-copy', scope => this.copyFrame(scope)),
      this.createButtonElement('frame-move'),
      // moveButton,
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
    // console.log('canvas evt', evt);
    // evt += 1;
    // console.log('canvas evt.target.dataset.frame', evt.target.dataset.frame);
    // console.log('LI evt.target.parentElement.dataset.frame', evt.target.parentElement.dataset.frame);
    // console.log('typeof canvas evt.target.dataset.frame', typeof evt.target.dataset.frame);
    // evt.target.dataset.frame = +evt.target.dataset.frame + 1;
    this.setSelectedFrame(+evt.target.parentElement.dataset.frame);
  }

  setSelectedFrame(frameIndex) {
    // console.log('%c setSelectedFrame() frameIndex', 'color: blue', frameIndex);
    settings.selectedFrame = frameIndex;
    this.applicationRef.updateMainCanvas(settings.frames[frameIndex]);

    const frameElements = this.framesComponentElement.querySelectorAll('.frame');
    // console.log('setSelectedFrame() frameElements:', frameElements);
    frameElements.forEach((frameElement, index) => {
      // console.log(`setSelectedFrame() frameElement: ${frameElement}, index ${index}`);
      // console.log(`index(${index}) === frameIndex(${frameIndex}): ${index === frameIndex}`);
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

  dragStartHandler(evt) {
    // store a ref. on the dragged elem
    this.dragged = evt.target;
    // make it half transparent
    evt.target.style.opacity = 0.5;
  }

  dragEndHandler(evt) {
    // reset the transparency
    evt.target.style.opacity = '';
  }

  dragOverHandler(evt) {
    // prevent default to allow drop
    // console.log('dragover event:', evt);
    // console.log('dragover event:', event.toElement.innerText);
    evt.preventDefault();
  }

  dragDropHandler(evt) {
    // prevent default action (open as link for some elements)
    evt.preventDefault();
    // console.log('drop evt:', evt);
    // console.log('drop evt:', evt.toElement.innerText);
    // console.log('drop evt.target.className:', evt.target.className);

    // console.log('drop evt.target:', evt.target);
    // console.log('drop dragged:', this.dragged);

    const targetParentElement = evt.target.parentNode;
    // console.log('targetParentElement', targetParentElement);
    // console.log(`targetParentElement.hasAttribute('data-frame')`, targetParentElement.hasAttribute('data-frame'));
    // console.log(`targetParentElement.className`, targetParentElement.className);
    // move this.dragged elem to the selected drop target
    if (targetParentElement.hasAttribute('data-frame')) {
      // evt.target.style.background = '';  // TODO: Do we need this???
      const parentContainer = targetParentElement.parentNode;
      // console.log('parentContainer', parentContainer);
      // const newEl = document.createElement('li');
      // newEl.classList.add('frame');
      // newEl.classList.add('draggable');
      // newEl.draggable = true;
      // newEl.textContent = '123';
      // parentElement.removeChild(this.dragged);
      // evt.target.appendChild( newEl );
      // parentElement.insertBefore(newEl, evt.target);

      /* parentElement.appendChild( this.dragged ); */
      /* frameToCopyElement.parentNode.insertBefore(newFrameElement, frameToCopyElement.nextSibling); */

      // console.log('evt.target.dataset.frame', evt.target.dataset.frame);
      // console.log('this.dragged.dataset.frame', this.dragged.dataset.frame);

      // const movedImageData = settings.frames[this.dragged.dataset.frame];
      // console.log('settings.frames', settings.frames);
      const movedImageData = settings.frames.splice(this.dragged.dataset.frame, 1);
      // console.log('movedImageData', movedImageData);
      // console.log('settings.frames', settings.frames);
      settings.frames.splice(targetParentElement.dataset.frame, 0, ...movedImageData);
      // console.log('settings.frames', settings.frames);

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
