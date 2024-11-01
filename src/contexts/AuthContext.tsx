import { createContext, ReactNode, useEffect, useState } from "react";

import { storageSaveUser, storageGetUser } from "@storage/storageUser";

import { api } from "@services/api";
import { UserDTO } from "@dtos/UserDTO";

export type AuthContextDataProps = {
  user: UserDTO;
  signIn: (email: string, password: string) => Promise<void>;
  isLoadingStoragedUserData: boolean
}

type AuthContextProviderProps = {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps);

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<UserDTO>({} as UserDTO)
  const [isLoadingStoragedUserData, setIsLoadingStoragedUserData] = useState(true);

  async function signIn(email: string, password: string) {
    try {
      const { data } = await api.post('/sessions', { email, password });

      if(data.user){
        setUser(data.user)
        storageSaveUser(data.user)
      }
    } catch (error) {
      throw error;
    }
  }

  async function loadUserData() {
    try {
      const userLogged = await storageGetUser();

      if(userLogged) {
        setUser(userLogged)
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
      isLoadingStoragedUserData
    }}>
      {children}
    </AuthContext.Provider>
  )
}