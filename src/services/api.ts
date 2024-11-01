import axios from "axios";

import { AppError } from "@utils/AppError";

const api = axios.create({
  baseURL: "http://192.168.0.29:3333"
})

// interceptando as respostas recebidas do backend
api.interceptors.response.use(response => response, error =>{
  if(error.response && error.response.data){
    const errorMessage = error.response.data.message

    return Promise.reject(new AppError(errorMessage))
  } else {
    return Promise.reject(new AppError(error.response.data))
  }
})

export { api };