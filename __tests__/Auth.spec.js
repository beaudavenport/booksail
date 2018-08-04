import React from 'react';
import { AuthSession } from 'expo';
import { login } from '../services/auth';
import config from '../config';

describe('Auth Service', () => {
  describe('login', () => {
    beforeEach(() => {
      AuthSession.startAsync = jest.fn();
    });

    it('should call to auth session with auth url set', () => {
      login();

      expect(AuthSession.startAsync.mock.calls[0][0])
        .toEqual({ authUrl: config.authUrl });
    });
  });
});
