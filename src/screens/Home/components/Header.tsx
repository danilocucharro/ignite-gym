import { HStack, Text, Heading, VStack, Icon } from "@gluestack-ui/themed";

import { UserPhoto } from "@components/UserPhoto";

import { LogOut } from "lucide-react-native"

export function Header() {
  return(
    <HStack bg="$gray600" pt="$16" pb="$5" px="$8" alignItems="center" gap="$4">
      <UserPhoto 
        source={{ uri: "https://github.com/danilocucharro.png" }} 
        alt="user photo" 
        w="$16"
        h="$16"
      />
      <VStack flex={1}>
        <Text color="$gray100" fontSize="$sm">Olá,</Text>
        <Text color="$gray100" fontSize="$md" fontFamily="$heading">Danilo Cucharro</Text>
      </VStack>

      <Icon as={LogOut} color="$gray200" size="xl" /> 
    </HStack>
  )
}