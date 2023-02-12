import axios from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import React, {createContext, useContext} from 'react';
import {AuthContext} from './AuthContext';
import * as Keychain from 'react-native-keychain';


const AxiosContext = createContext(null);
const {Provider} = AxiosContext;

const AxiosProvider = ({children}) => {
  const authContext = useContext(AuthContext);

  const authAxios = axios.create({
    baseURL: 'https://507c-2405-201-c013-b2e1-835-f3a7-94d4-c3e6.in.ngrok.io/api/v1/',
  });

  const publicAxios = axios.create({
    baseURL: 'https://507c-2405-201-c013-b2e1-835-f3a7-94d4-c3e6.in.ngrok.io/api/v1/',
  });

  authAxios.interceptors.request.use(
    config => {
      if (!config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${authContext.getAccessToken()}`;
      }

      return config;
    },
    error => {
      return Promise.reject(error);
    },
  );

  const refreshAuthLogic = failedRequest => {
    const data = {
      refreshToken: authContext.authState.refreshToken,
    };

    const options = {
      method: 'POST',
      data,
      url: 'http://localhost:3001/api/refreshToken',
    };

    return axios(options)
      .then(async tokenRefreshResponse => {
        failedRequest.response.config.headers.Authorization =
          'Bearer ' + tokenRefreshResponse.data.accessToken;

        authContext.setAuthState({
          ...authContext.authState,
          accessToken: tokenRefreshResponse.data.accessToken,
        });
        await Keychain.setGenericPassword(
          'token',
          JSON.stringify({
            accessToken: tokenRefreshResponse.data.accessToken,
            refreshToken: authContext.authState.refreshToken,
          }),
        );

        return Promise.resolve();
      })
      .catch(e => {
        authContext.setAuthState({
          accessToken: null,
          refreshToken: null,
        });
      });
  };
  createAuthRefreshInterceptor(authAxios, refreshAuthLogic, {});
  return (
    <Provider
      value={{
        authAxios,
        publicAxios,
      }}>
      {children}
    </Provider>
  );
};

export {AxiosContext, AxiosProvider};
