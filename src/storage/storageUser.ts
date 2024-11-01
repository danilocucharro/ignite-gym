import AsyncStorage from "@react-native-async-storage/async-storage";

import { UserDTO } from "@dtos/UserDTO";
import { USER_STORAGE } from "./storageConfig"

export async function storageSaveUser(user: UserDTO) {
  await AsyncStorage.setItem(USER_STORAGE, JSON.stringify(user))
}

export async function storageGetUser() {
  const storagedUser = await AsyncStorage.getItem(USER_STORAGE);

  const user: UserDTO = storagedUser ? JSON.parse(storagedUser) : {};

  return user;
}