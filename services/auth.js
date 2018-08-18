import { AuthSession } from 'expo';
import config from '../config';

function login() {
  return AuthSession.startAsync({
    authUrl: config.authUrl,
  })
    .then(authResponse => fetch(config.accessTokenUrl, {
      headers: {
        code: authResponse.params.code,
      },
    }))
    .then(response => response.json())
    .then(result => ({
      accessToken: result.access_token,
      refreshToken: result.refresh_token,
    }));
}

export default {
  login,
};
