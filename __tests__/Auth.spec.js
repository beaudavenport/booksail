import React from 'react';
import { AuthSession } from 'expo';
import auth from '../services/auth';
import config from '../config';

describe('Auth Service', () => {
  describe('login', () => {
    beforeEach(() => {
      AuthSession.startAsync = jest.fn();
      global.fetch = jest.fn();

      AuthSession.startAsync.mockResolvedValue({ params: {} });
      fetch.mockResolvedValue({ json: () => Promise.resolve({}) });
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
        json: () => Promise.resolve({
          access_token: accessToken,
          refresh_token: refreshToken,
        }),
      };
      fetch.mockResolvedValue(accessTokenResponse);

      const asyncResult = auth.login();

      return asyncResult.then((accessTokenResult) => {
        expect(accessTokenResult).toEqual({ accessToken, refreshToken });

        expect(fetch.mock.calls[0][0])
          .toEqual(config.accessTokenUrl);
        expect(fetch.mock.calls[0][1])
          .toEqual({ headers: { code: requestToken } });
      });
    });
  });

  describe('refresh', () => {
    beforeEach(() => {
      global.fetch = jest.fn();
    });

    it('should call to fetch new tokens using refresh token', () => {
      const refreshToken = 'refresh-token';
      const newAccessToken = 'new-access-token';
      const refreshTokenResponse = {
        json: () => Promise.resolve({
          access_token: newAccessToken,
        }),
      };
      fetch.mockResolvedValue(refreshTokenResponse);

      const asyncResult = auth.refresh(refreshToken);

      return asyncResult.then((refreshResult) => {
        expect(refreshResult).toEqual({ accessToken: newAccessToken });

        expect(fetch.mock.calls[0][0])
          .toEqual(config.refreshTokenUrl);
        expect(fetch.mock.calls[0][1])
          .toEqual({ headers: { rfToken: refreshToken } });
      });
    });
  });
});
