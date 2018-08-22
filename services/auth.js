import { AuthSession } from 'expo';
import { AsyncStorage } from 'react-native';
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
    .then(result => Promise.all([
      AsyncStorage.setItem('accessToken', result.access_token),
      AsyncStorage.setItem('refreshToken', result.refresh_token),
    ]));
}

function refresh() {
  return AsyncStorage.getItem('refreshToken')
    .then(refreshToken => get(config.refreshTokenUrl, {
      headers: {
        rfToken: refreshToken,
      },
    }))
    .then(result => AsyncStorage.setItem('accessToken', result.access_token));
}

export default {
  login,
  refresh,
};
