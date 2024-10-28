import { Center, Image, Text, VStack } from "@gluestack-ui/themed";

import BackGroundImg from "@assets/background.png"
import Logo from "@assets/logo.svg"

export function Signin() {
  return(
    <VStack flex={1} bg="$gray700">
      <Image
       w="$full"
       h={624}
       position="absolute"
       source={BackGroundImg}
       defaultSource={BackGroundImg}
       alt="Pessoas treinando"
      />

      <Center my="$24">
        <Logo />

        <Text color="$gray100" fontSize="$sm">
          Treine sua mente e o seu corpo.
        </Text>
      </Center>
    </VStack>
  )
}