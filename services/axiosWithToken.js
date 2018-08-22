import { get } from 'axios';
import { AsyncStorage } from 'react-native';
import auth from './auth';

function makeGetRequest(url, options) {
  return AsyncStorage.getItem('accessToken')
    .then(accessToken => get(url, {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      ...options,
    }));
}

export function getWithToken(url, options) {
  return makeGetRequest(url, options)
    .catch((error) => {
      if (error.errorId === 1001) {
        return auth.refresh().then(() => makeGetRequest(url, options));
      }
      throw error;
    });
}
