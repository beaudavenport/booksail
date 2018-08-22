import React from 'react';
import { AuthSession } from 'expo';
import { AsyncStorage } from 'react-native';
import axios from 'axios';
import auth from '../services/auth';
import config from '../config';

describe('Auth Service', () => {
  describe('login', () => {
    beforeEach(() => {
      AuthSession.startAsync = jest.fn();
      axios.get = jest.fn();
      AsyncStorage.setItem = jest.fn();
      AsyncStorage.getItem = jest.fn();

      AuthSession.startAsync.mockResolvedValue({ params: {} });
      axios.get.mockResolvedValue({ data: {} });
      AsyncStorage.setItem.mockResolvedValue({});
    });

    it('should call to auth session with auth url set', () => {
      const asyncResult = auth.login();

      return asyncResult.then(() => {
        expect(AuthSession.startAsync.mock.calls[0][0])
          .toEqual({ authUrl: config.authUrl });
      });
    });

    it('should call to fetch tokens using request token and save locally', () => {
      const requestToken = 'request-token';
      const accessToken = 'access-token';
      const refreshToken = 'refresh-token';
      AuthSession.startAsync
        .mockResolvedValue({ params: { code: requestToken } });
      const accessTokenResponse = {
        data: {
          access_token: accessToken,
          refresh_token: refreshToken,
        },
      };
      axios.get.mockResolvedValue(accessTokenResponse);

      const asyncResult = auth.login();

      return asyncResult.then(() => {
        expect(AsyncStorage.setItem.mock.calls[0])
          .toEqual(['accessToken', accessToken]);
        expect(AsyncStorage.setItem.mock.calls[1])
          .toEqual(['refreshToken', refreshToken]);
        expect(axios.get.mock.calls[0])
          .toEqual([
            config.accessTokenUrl,
            { headers: { code: requestToken } },
          ]);
      });
    });
  });

  describe('refresh', () => {
    beforeEach(() => {
      axios.get = jest.fn();
      AsyncStorage.setItem = jest.fn();

      AsyncStorage.setItem.mockResolvedValue({});
    });

    it('should call to fetch new token using refresh token and save locally', () => {
      const newAccessToken = 'new-access-token';
      const refreshToken = 'refresh-token';
      const refreshTokenResponse = {
        data: {
          access_token: newAccessToken,
        },
      };
      AsyncStorage.getItem.mockResolvedValue(refreshToken);
      axios.get.mockResolvedValue(refreshTokenResponse);

      const asyncResult = auth.refresh();

      return asyncResult.then(() => {
        expect(AsyncStorage.getItem.mock.calls[0])
          .toEqual(['refreshToken']);
        expect(AsyncStorage.setItem.mock.calls[0])
          .toEqual(['accessToken', newAccessToken]);
        expect(axios.get.mock.calls[0])
          .toEqual([
            config.refreshTokenUrl,
            { headers: { rfToken: refreshToken } },
          ]);
      });
    });
  });
});
