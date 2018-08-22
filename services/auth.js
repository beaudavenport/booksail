import { AuthSession } from 'expo';
import { get } from 'axios';
import config from '../config';

function login() {
  return AuthSession.startAsync({
    authUrl: config.authUrl,
  })
    .then(authResponse => get(config.accessTokenUrl, {
      headers: {
        code: authResponse.params.code,
      },
    }))
    .then(result => ({
      accessToken: result.access_token,
      refreshToken: result.refresh_token,
    }));
}

function refresh(refreshToken) {
  return get(config.refreshTokenUrl, {
    headers: {
      rfToken: refreshToken,
    },
  })
    .then(result => ({
      accessToken: result.access_token,
    }));
}

export default {
  login,
  refresh,
};
