const settings = {
  isAuthenticated: false,
  githubLogin: '',
  githubAvatarUrl: '',
  transparentColorRGBA: 'rgba(0, 0, 0, 0)',
  primaryColor: 'rgba(128, 128, 255, 255)',
  secondaryColor: 'rgba(255, 255, 0, 255)',
  pixelSize: 1,
  fieldSize: '32x32',
  canvasMarkupSize: 512,
  isPenState: false,
  isFillState: false,
  isEraserState: false,
  isChooseColorState: false,
  isStrokeState: false,
  lastX: 0,
  lastY: 0,
  isDrawing: false,
  isErasing: false,
  isStroking: false,
  selectedTool: 0,
  frames: [],
  selectedFrame: 0,
  isPlaying: false,
  fps: 10,
};

export default settings;