import React from 'react';
import { AuthSession } from 'expo';
import axios from 'axios';
import auth from '../services/auth';
import config from '../config';

describe('Auth Service', () => {
  describe('login', () => {
    beforeEach(() => {
      AuthSession.startAsync = jest.fn();
      axios.get = jest.fn();

      AuthSession.startAsync.mockResolvedValue({ params: {} });
      axios.get.mockResolvedValue({});
    });

    it('should call to auth session with auth url set', () => {
      const asyncResult = auth.login();

      return asyncResult.then(() => {
        expect(AuthSession.startAsync.mock.calls[0][0])
          .toEqual({ authUrl: config.authUrl });
      });
    });

    it('should call to fetch tokens using request token', () => {
      const requestToken = 'request-token';
      const accessToken = 'access-token';
      const refreshToken = 'refresh-token';
      AuthSession.startAsync
        .mockResolvedValue({ params: { code: requestToken } });
      const accessTokenResponse = {
        access_token: accessToken,
        refresh_token: refreshToken,
      };
      axios.get.mockResolvedValue(accessTokenResponse);

      const asyncResult = auth.login();

      return asyncResult.then((accessTokenResult) => {
        expect(accessTokenResult).toEqual({ accessToken, refreshToken });

        expect(axios.get.mock.calls[0][0])
          .toEqual(config.accessTokenUrl);
        expect(axios.get.mock.calls[0][1])
          .toEqual({ headers: { code: requestToken } });
      });
    });
  });

  describe('refresh', () => {
    beforeEach(() => {
      axios.get = jest.fn();
    });

    it('should call to fetch new tokens using refresh token', () => {
      const refreshToken = 'refresh-token';
      const newAccessToken = 'new-access-token';
      const refreshTokenResponse = {
        access_token: newAccessToken,
      };
      axios.get.mockResolvedValue(refreshTokenResponse);

      const asyncResult = auth.refresh(refreshToken);

      return asyncResult.then((refreshResult) => {
        expect(refreshResult).toEqual({ accessToken: newAccessToken });

        expect(axios.get.mock.calls[0][0])
          .toEqual(config.refreshTokenUrl);
        expect(axios.get.mock.calls[0][1])
          .toEqual({ headers: { rfToken: refreshToken } });
      });
    });
  });
});
