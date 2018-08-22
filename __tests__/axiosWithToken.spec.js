import axios from 'axios';
import { AsyncStorage } from 'react-native';
import auth from '../services/auth';
import { getWithToken } from '../services/axiosWithToken';

describe('getWithToken', () => {
  beforeEach(() => {
    axios.get = jest.fn();
    auth.refresh = jest.fn();
    AsyncStorage.getItem = jest.fn();
    auth.refresh.mockResolvedValue({});
  });

  it('makes axios GET request with access token and options', () => {
    const url = 'foo.com';
    const options = {
      params: {
        thing: 'yes',
      },
    };
    axios.get.mockResolvedValue('Some response');
    AsyncStorage.getItem.mockResolvedValue('my-access-token');

    const asyncResult = getWithToken(url, options);

    return asyncResult.then((getResult) => {
      expect(getResult).toEqual('Some response');

      expect(axios.get.mock.calls[0][0])
        .toEqual(url);
      expect(axios.get.mock.calls[0][1])
        .toEqual({
          headers: { authorization: 'Bearer my-access-token' },
          params: { thing: 'yes' },
        });
      expect(AsyncStorage.getItem.mock.calls[0][0])
        .toEqual('accessToken');
    });
  });

  it('calls to refresh token first if access token is invalid/expired', () => {
    const url = 'foo.com';
    const options = {
      params: {
        thing: 'yes',
      },
    };

    axios.get.mockRejectedValueOnce({ errorId: 1001 })
      .mockResolvedValueOnce('Some response');
    AsyncStorage.getItem.mockResolvedValueOnce('my-access-token')
      .mockResolvedValueOnce('new-access-token');

    const asyncResult = getWithToken(url, options);

    return asyncResult.then((getResult) => {
      expect(getResult).toEqual('Some response');
      expect(auth.refresh.mock.calls.length).toBe(1);
      expect(axios.get.mock.calls[0])
        .toEqual([
          url, {
            headers: { authorization: 'Bearer my-access-token' },
            params: { thing: 'yes' },
          },
        ]);
      expect(axios.get.mock.calls[1])
        .toEqual([
          url, {
            headers: { authorization: 'Bearer new-access-token' },
            params: { thing: 'yes' },
          },
        ]);
      expect(AsyncStorage.getItem.mock.calls[0][0])
        .toEqual('accessToken');
      expect(AsyncStorage.getItem.mock.calls[1][0])
        .toEqual('accessToken');
    });
  });
});
