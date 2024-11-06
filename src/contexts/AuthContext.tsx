import { createContext, ReactNode, useEffect, useState } from "react";

import { storageSaveAuthToken, storageGetAuthToken, storageRemoveAuthToken } from "@storage/storageAuthToken";
import { storageSaveUser, storageGetUser, storageRemoveUser } from "@storage/storageUser";

import { api } from "@services/api";
import { UserDTO } from "@dtos/UserDTO";

export type AuthContextDataProps = {
  user: UserDTO;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUserProfile: (userUpdated: UserDTO) => Promise<void>;
  isLoadingStoragedUserData: boolean
}

type AuthContextProviderProps = {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps);

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<UserDTO>({} as UserDTO)
  const [isLoadingStoragedUserData, setIsLoadingStoragedUserData] = useState(true);

  async function storageUserAndTokenSave(userData: UserDTO, token: string) {
    try {
      setIsLoadingStoragedUserData(true)

      await storageSaveUser(userData)
      await storageSaveAuthToken(token)

    } catch (error) {
      throw error
    } finally {
      setIsLoadingStoragedUserData(false)
    }
  }

  async function storageUserAndTokenUpdate(userData: UserDTO, token: string) {
    // anexando o token no header da requisicao http
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    setUser(userData)
  }

  async function signIn(email: string, password: string) {
    try {
      const { data } = await api.post('/sessions', { email, password });

      if(data.user && data.token){
        await storageUserAndTokenSave(data.user, data.token)
        storageUserAndTokenUpdate(data.user, data.token)
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingStoragedUserData(false)
    }
  }

  async function signOut() {
    try {
      setIsLoadingStoragedUserData(true)
      setUser({} as UserDTO)
      await storageRemoveUser()
      await storageRemoveAuthToken()

    } catch (error) {
      throw error
    } finally {
      setIsLoadingStoragedUserData(false)
    }
  }

  async function updateUserProfile(userUpdated: UserDTO) {
    try {
      setUser(userUpdated)// atualiza dados do user no estado
      await storageSaveUser(userUpdated)// atualiza os dados do user no armazenamento do dispositivo

    } catch (error) {
      throw error
    }
  }

  async function loadUserData() {
    try {
      setIsLoadingStoragedUserData(true)

      const userLogged = await storageGetUser(); // resgatando usuario salvo no AsyncStorage
      const token = await storageGetAuthToken(); // resgatando o token salvo no AsyncStorage

      if(token && userLogged) {
        storageUserAndTokenUpdate(userLogged, token)
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingStoragedUserData(false)
    }
  }
  
  useEffect(()  =>{
    loadUserData()
  }, [])

  return(
    <AuthContext.Provider value={{ 
      user,
      signIn,
      signOut,
      updateUserProfile, 
      isLoadingStoragedUserData
    }}>
      {children}
    </AuthContext.Provider>
  )
}