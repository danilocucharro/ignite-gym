import { ScrollView, TouchableOpacity } from "react-native";

import { Center, VStack, Text } from "@gluestack-ui/themed";

import { ScreenHeader } from "@components/ScreenHeader";
import { UserPhoto } from "@components/UserPhoto";
import { Input } from "@components/Input";
import { Button } from "@components/Button";

export function Profile() {
  return(
    <VStack flex={1}>
      <ScreenHeader title="Perfil" />
      
      <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
        <Center mt="$6" px="$10">
          <UserPhoto 
            source={{ uri: "https://github.com/danilocucharro.png" }} 
            alt="user photo"
            size="xl"
          />

          <TouchableOpacity>
            <Text 
              color="$green500" 
              fontFamily="$heading" 
              fontSize="$md" 
              mt="$2" 
              mb="$8"
            >
              Alterar foto
            </Text>
          </TouchableOpacity>

          <Center w="$full" gap="$4">
            <Input placeholder="Nome" bg="$gray500" />
            <Input value="danicucharro@outlook.com" bg="$gray500" isReadOnly />
          </Center>

          <Text 
            alignSelf="flex-start" 
            fontFamily="$heading"
            color="$gray200"
            fontSize="$md"
            mt="$12"
            mb="$2"
          >
            Alterar senha
          </Text>

          <Center w="$full" gap="$4">
            <Input placeholder="Senha antiga" bg="$gray600" secureTextEntry />
            <Input placeholder="Nova senha" bg="$gray600" secureTextEntry />
            <Input placeholder="Confirme a nova senha" bg="$gray600" secureTextEntry />

            <Button title="Atualizar cadastro"/>
          </Center>
        </Center>
      </ScrollView>
    </VStack>
  )
}