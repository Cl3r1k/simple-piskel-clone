import './scss/main.scss';

// import settings from './js/settings/settings';
// import PaletteClass from './js/PaletteClass';
import ApplicationClass from './gui/ApplicationClass';
import AuthClass from './js/AuthClass';

// TODO: Use container handlers for tools, frames and animation, not separate eventListeners
// TODO: Improve paint/erase fro mouse out case

// let paletteClassInstance;
// let authClassInstance;

const initApp = () => {
  // New part
  const applicationClassInstance = new ApplicationClass();
  applicationClassInstance.initApp();

  window.addEventListener('beforeunload', () => {
    applicationClassInstance.saveAppState();
  });
  // End New part

  const authClassInstance = new AuthClass();

  // paletteClassInstance.loadAppSate();
  // paletteClassInstance.initCanvasEvents();

  // document.getElementById('idPencilTool').addEventListener('click', () => {
  //   paletteClassInstance.setPaletteState(0);
  // });

  // document.getElementById('idPaintBucket').addEventListener('click', () => {
  //   paletteClassInstance.setPaletteState(1);
  // });

  // document.getElementById('idEraserTool').addEventListener('click', () => {
  //   paletteClassInstance.setPaletteState(2);
  // });

  // document.getElementById('idColorPickerTool').addEventListener('click', () => {
  //   paletteClassInstance.setPaletteState(3);
  // });

  // const inputPrimaryColorElement = document.getElementById('idPrimaryColor');
  // inputPrimaryColorElement.addEventListener('change', () => {
  //   paletteClassInstance.setPaletteColor(inputPrimaryColorElement.value);
  // });

  // const inputSecondaryColorElement = document.getElementById('idSecondaryColor');
  // inputSecondaryColorElement.addEventListener('change', () => {
  //   paletteClassInstance.setPaletteColor(inputSecondaryColorElement.value, true);
  // });

  document.addEventListener('keypress', evt => {
    if (document.activeElement.tagName !== 'INPUT') {
      switch (evt.key) {
        case 'p': {
          applicationClassInstance.setPaletteState(0);
          break;
        }
        case 'b': {
          applicationClassInstance.setPaletteState(1);
          break;
        }
        case 'e': {
          applicationClassInstance.setPaletteState(2);
          break;
        }
        case 'c': {
          applicationClassInstance.setPaletteState(3);
          break;
        }
        case 'r': {
          applicationClassInstance.resetCanvasState();
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
  initApp();
});
