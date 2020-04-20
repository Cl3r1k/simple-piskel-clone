export default class HotkeysClass {
  constructor(applicationRef, penSizeClassInstanceRef, framesClassInstanceRef) {
    document.addEventListener('keypress', evt => this.keypressHandler(evt));
    this.applicationRef = applicationRef;
    this.penSizeClassInstanceRef = penSizeClassInstanceRef;
    this.framesClassInstanceRef = framesClassInstanceRef;
  }

  keypressHandler(evt) {
    switch (evt.key) {
      case 'p':
      case 'з':
        this.applicationRef.setPaletteState(0);
        break;
      case 'b':
      case 'и':
        this.applicationRef.setPaletteState(1);
        break;
      case 'e':
      case 'у':
        this.applicationRef.setPaletteState(2);
        break;
      case 'c':
      case 'с':
        this.applicationRef.setPaletteState(3);
        break;
      case 'r':
      case 'к':
        this.applicationRef.resetCanvasState();
        break;
      case 'a':
      case 'ф':
        this.framesClassInstanceRef.generateFramesList([], true);
        break;
      case '1':
        this.penSizeClassInstanceRef.setPixelSize(1);
        break;
      case '2':
        this.penSizeClassInstanceRef.setPixelSize(2);
        break;
      case '3':
        this.penSizeClassInstanceRef.setPixelSize(3);
        break;
      case '4':
        this.penSizeClassInstanceRef.setPixelSize(4);
        break;
      default:
        break;
    }
  }
}
