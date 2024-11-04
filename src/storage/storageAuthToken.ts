import AsyncStorage from "@react-native-async-storage/async-storage"

import { AUTH_TOKEN_STORAGE } from "./storageConfig"

export async function storageSaveAuthToken(token: string) {
  await AsyncStorage.setItem(AUTH_TOKEN_STORAGE, token)
}

export async function storageGetAuthToken() {
  const storagedToken = await AsyncStorage.getItem(AUTH_TOKEN_STORAGE)

  return storagedToken;
}

export async function storageRemoveAuthToken() {
  await AsyncStorage.removeItem(AUTH_TOKEN_STORAGE)
}