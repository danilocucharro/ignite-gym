import axios, { AxiosError, AxiosInstance } from "axios";

import { AppError } from "@utils/AppError";
import { storageGetAuthToken, storageSaveAuthToken } from "@storage/storageAuthToken";

type SignOut = () => void;

type PromiseType = {
  onSuccess: (token: string) => void;
  onFailure: (error: AxiosError) => void;
}

type APIInstanceProps = AxiosInstance & {
  registerInterceptTokenManager: (signOut: SignOut) => () => void
}

const api = axios.create({
  baseURL: "http://192.168.0.30:3333"
}) as APIInstanceProps

let failedQueue: Array<PromiseType> = [];
let isRefreshing = false;

api.registerInterceptTokenManager = signOut => {
  
  // interceptando as respostas recebidas do backend
  const interceptTokenManager = api.interceptors.response.use(response => response, async (requestError) =>{
    if(requestError.response.status === 401){
      // se o token estiver expirado ou invalido gerar um novo token caso nao, desloga o usuario
      if(requestError.response.data.message === 'token.expired' || requestError.response.data.message === 'token.invalid'){
        const { refresh_token } = await storageGetAuthToken();

        if(!refresh_token){
          signOut();
          return Promise.reject(requestError)
        }

        const originalRequestConfig = requestError.config;

        if(isRefreshing){
          return new Promise((resolve, reject) => {
            failedQueue.push({
              onSuccess: (token: string) => {
                originalRequestConfig.headers = { 'Authorization' : `Bearer ${token}` };
                resolve(api(originalRequestConfig))
              },
              onFailure: (error: AxiosError) => {
                reject(error)
              },
            })
          })
        }

        isRefreshing = true;

        return new Promise(async (resolve, reject) => {
          try {
            // solicitando um novo token
            const { data } = await api.post('/sessions/refresh-token', {refresh_token});
            await storageSaveAuthToken({ token: data.token, refresh_token: data.refresh_token })

            if(originalRequestConfig.data){
              originalRequestConfig.data = JSON.parse(originalRequestConfig);
            }

            originalRequestConfig.headers = { 'Authorization' : `Bearer ${data.token}` };
            api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`

            failedQueue.forEach(request => {
              request.onSuccess(data.token)
            });
 
            resolve(api(originalRequestConfig));

          } catch (error: any) {
            failedQueue.forEach(request => {
              request.onFailure(error)
            })

            signOut()
            reject(error)

          } finally {
            isRefreshing = false;
            failedQueue = []
          }
        })
      }

      signOut()
    }


    // caso nao seja um erro relacionado ao token
    if(requestError.response && requestError.response.data){
      const errorMessage = requestError.response.data.message
  
      return Promise.reject(new AppError(errorMessage))
    } else {
      return Promise.reject(new AppError(requestError.response.data))
    }
  });

  return () => {
    api.interceptors.response.eject(interceptTokenManager)
  };
}

export { api };