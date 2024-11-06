import { TouchableOpacity } from "react-native";

import { HStack, Text, VStack, Icon } from "@gluestack-ui/themed";

import { UserPhoto } from "@components/UserPhoto";

import { LogOut } from "lucide-react-native"
import defaultAvatarImg from "@assets/userPhotoDefault.png"

import { useAuth } from "@hooks/UseAuth";

import { api } from "@services/api";

export function Header() {
  const { user, signOut } = useAuth()

  return(
    <HStack bg="$gray600" pt="$16" pb="$5" px="$8" alignItems="center" gap="$4">
      <UserPhoto 
        source={ 
          user.avatar
          ? { uri: `${api.defaults.baseURL}/avatar/${user.avatar}` } 
          : defaultAvatarImg} 
        alt="user photo" 
        w="$16"
        h="$16"
      />
      <VStack flex={1}>
        <Text color="$gray100" fontSize="$sm">Olá,</Text>
        <Text color="$gray100" fontSize="$md" fontFamily="$heading">{user.name}</Text>
      </VStack>

      <TouchableOpacity onPress={signOut}>
        <Icon as={LogOut} color="$gray200" size="xl" /> 
      </TouchableOpacity>
    </HStack>
  )
}