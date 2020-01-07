import './scss/main.scss';

import ApplicationClass from './gui/ApplicationClass';
import AuthClass from './common/AuthClass';

const initApp = () => {
  const applicationClassInstance = new ApplicationClass();
  applicationClassInstance.initApp();

  window.addEventListener('beforeunload', () => {
    applicationClassInstance.saveAppState();
  });

  const authClassInstance = new AuthClass();

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
