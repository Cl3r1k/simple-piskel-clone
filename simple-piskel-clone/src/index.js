import './scss/main.scss';

import PaletteClass from './js/PaletteClass';
import AuthClass from './js/AuthClass';

// TODO: Use container handlers for tools, frames and animation, not separate eventListeners

let paletteClassInstance;
let authClassInstance;

const initApp = () => {
  paletteClassInstance.loadAppSate();
  paletteClassInstance.initCanvasEvents();

  document.getElementById('idFillTool').addEventListener('click', () => {
    paletteClassInstance.setPaletteState(0);
  });

  document.getElementById('idColorTool').addEventListener('click', () => {
    paletteClassInstance.setPaletteState(1);
  });

  document.getElementById('idPencilTool').addEventListener('click', () => {
    paletteClassInstance.setPaletteState(2);
  });

  const inputColorEl = document.getElementById('idCurrentColor');
  inputColorEl.addEventListener('change', () => {
    paletteClassInstance.setCurrentColor(inputColorEl.value);
  });

  const prevColorEl = document.getElementById('idPreviousColorLabel');
  prevColorEl.addEventListener('click', () => {
    const prevColor = getComputedStyle(document.getElementById('idPreviousColorField')).backgroundColor;
    paletteClassInstance.setCurrentColor(prevColor);
  });

  const redColorEl = document.getElementById('idRedColorLabel');
  redColorEl.addEventListener('click', () => {
    const redColor = getComputedStyle(document.getElementById('idRedColorField')).backgroundColor;
    paletteClassInstance.setCurrentColor(redColor);
  });

  const blueColorEl = document.getElementById('idBlueColorLabel');
  blueColorEl.addEventListener('click', () => {
    const blueColor = getComputedStyle(document.getElementById('idBlueColorField')).backgroundColor;
    paletteClassInstance.setCurrentColor(blueColor);
  });

  document.getElementById('btnSize32x32').addEventListener('click', () => {
    paletteClassInstance.setPixelSize(16);
  });

  document.getElementById('btnSize64x64').addEventListener('click', () => {
    paletteClassInstance.setPixelSize(8);
  });

  document.getElementById('btnSize128x128').addEventListener('click', () => {
    paletteClassInstance.setPixelSize(4);
  });

  document.addEventListener('keypress', evt => {
    if (document.activeElement.tagName !== 'INPUT') {
      switch (evt.key) {
        case 'b': {
          paletteClassInstance.setPaletteState(0);
          break;
        }
        case 'p': {
          paletteClassInstance.setPaletteState(2);
          break;
        }
        case 'c': {
          paletteClassInstance.setPaletteState(1);
          break;
        }
        case 'r': {
          paletteClassInstance.resetCanvasState();
          break;
        }
        default: {
          break;
        }
      }
    }
  });

  authClassInstance.loadAuthData();

  const loginGHButton = document.getElementById('idLoginGHButton');
  if (authClassInstance.isAuthenticated) {
    loginGHButton.textContent = `Logout ${authClassInstance.login}`;
  } else {
    loginGHButton.textContent = 'Login with GitHub';
  }

  loginGHButton.addEventListener('click', async evt => {
    if (authClassInstance.isAuthenticated) {
      authClassInstance.deleteAuthData();
      evt.target.textContent = 'Login with GitHub';
    } else {
      // TODO: Fix eslint error
      // eslint-disable-next-line new-cap, no-undef
      const authenticator = new netlify.default({});
      authenticator.authenticate({ provider: 'github', scope: 'user' }, async (err, data) => {
        const authKey = err ? `Error Authenticating with GitHub: ${err}` : data.token;

        await authClassInstance.getGHUser(authKey);

        if (authClassInstance.isAuthenticated) {
          evt.target.textContent = `Logout ${authClassInstance.login}`;
        } else {
          evt.target.textContent = 'Login with GitHub';
        }
      });
    }
  });
};

document.addEventListener('DOMContentLoaded', () => {
  const canvasEl = document.getElementById('idCanvas');
  if (canvasEl.getContext) {
    const ctx = canvasEl.getContext('2d');

    authClassInstance = new AuthClass();
    paletteClassInstance = new PaletteClass(canvasEl, ctx, 512, 512);
    initApp();

    window.addEventListener('beforeunload', () => {
      paletteClassInstance.saveAppState();
    });
  }
});
