import { useState } from "react";
import { ScrollView, TouchableOpacity } from "react-native";

import * as ImagePicker from "expo-image-picker"
import * as FileSystem from "expo-file-system"

import { Center, VStack, Text, useToast } from "@gluestack-ui/themed";

import { ScreenHeader } from "@components/ScreenHeader";
import { UserPhoto } from "@components/UserPhoto";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { ToastMessage } from "@components/ToastMessage";

export function Profile() {
  const [userPhoto, setUserPhoto] = useState("https://github.com/danilocucharro.png")

  const toast = useToast()

  async function handleSelectUserPhoto() {
    try{
      const selectedPhoto = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // filtro para apenas selecionar imagens
        quality: 1, // pegar a melhor qualidade da imagem
        aspect: [4, 4], // proporcao da foto
        allowsEditing: true // usuario pode editar a foto
      })
  
      if(selectedPhoto.canceled) {
        return
      }
  
      const photoUri = selectedPhoto.assets[0].uri
  
      if(photoUri) {
        const photoInfo = await FileSystem.getInfoAsync(photoUri) as {
          size: number
        }
  
        if(photoInfo.size && (photoInfo.size / 1024 / 1024) > 5){
          return toast.show({
            placement: "top",
            render: ({ id }) => (
              <ToastMessage 
                id={id}
                title="Imagem muito grande"
                description="Essa imagem é muito grande. Escolha uma de até 5MB."
                action="error"
                onClose={() => toast.close(id)}
              />
            )
          })          
        }
  
        setUserPhoto(photoUri)
      }
    } catch(error) {

    }
  } 

  return(
    <VStack flex={1}>
      <ScreenHeader title="Perfil" />

      <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
        <Center mt="$6" px="$10">
          <UserPhoto 
            source={{ uri: userPhoto }} 
            alt="user photo"
            size="xl"
          />

          <TouchableOpacity onPress={handleSelectUserPhoto}>
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