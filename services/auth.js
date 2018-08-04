import { AuthSession } from 'expo';
import config from '../config';

export function login() {
  AuthSession.startAsync({
    authUrl: config.authUrl,
  });
}
