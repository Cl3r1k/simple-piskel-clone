import config from './settings/config';
import settings from './settings/settings';

export default class AuthClass {
  async getGHUser(authKey) {
    const queryString = 'user';
    const requestURL = `${config.proxyURL}${config.githubBaseUrl}${queryString}`;
    const requestParams = {
      method: 'GET',
      withCredentials: true,
      headers: {
        Authorization: `token ${authKey}`,
      },
    };

    try {
      const response = await fetch(requestURL, requestParams);
      const data = await response.json();

      this.saveAuthData('github', data);
    } catch (err) {
      throw new Error(err);
    }
  }

  saveAuthData(providerName, providerData) {
    const authData = {
      provider: providerName,
      providerData,
    };

    localStorage.setItem('authData', JSON.stringify(authData));
    settings.isAuthenticated = true;
  }

  loadAuthData() {
    const data = JSON.parse(localStorage.getItem('authData'));

    if (data) {
      if (data.provider === 'github') {
        settings.githubLogin = data.providerData.login;
        settings.githubAvatarUrl = data.providerData.avatar_url;
        settings.isAuthenticated = true;
      }
    }
  }

  deleteAuthData() {
    localStorage.removeItem('authData');
    settings.isAuthenticated = false;
  }
}
