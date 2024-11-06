import { useState } from "react";
import { ScrollView, TouchableOpacity } from "react-native";

import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup"

import * as ImagePicker from "expo-image-picker"
import * as FileSystem from "expo-file-system"
import * as yup from "yup"

import { Center, VStack, Text, useToast } from "@gluestack-ui/themed";

import { ScreenHeader } from "@components/ScreenHeader";
import { UserPhoto } from "@components/UserPhoto";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { ToastMessage } from "@components/ToastMessage";

import { api } from "@services/api";
import { useAuth } from "@hooks/UseAuth";
import { AppError } from "@utils/AppError";

type FormDataProps = {
  name: string;
  email: string;
  password?: string | null | undefined;
  old_password?: string;
  confirm_password?: string | null | undefined;
}

const profileSchema = yup.object({
  name: yup.string().required('Informe o nome.'),
  email: yup.string().required('Informe o email.'),
  password: 
  yup.string()
  .min(6, 'A senha deve ter pelo menos 6 caracteres')
  .nullable()
  .transform((value) => !!value ? value : null),
  confirm_password: 
  yup.string()
  .nullable()
  .transform((value) => !!value ? value : null)
  .oneOf([yup.ref('password'), null], 'As senhas precisam ser iguais.')
  .when('password', { 
    is: (Field: any) => Field,
    then: (schema) => schema
    .nullable()
    .required('Confirme a senha nova.')
    .transform((value) => !!value ? value : null)
  })
})

export function Profile() {
  const [isUpdatingUserProfile, setIsUpdatingUserProfile] = useState(false)
  const [userPhoto, setUserPhoto] = useState("https://github.com/danilocucharro.png")

  const { user, updateUserProfile } = useAuth()
  const toast = useToast()
  const { 
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormDataProps>({
    defaultValues: {
      name: user.name,
      email: user.email,
    },
    resolver: yupResolver(profileSchema)
  })

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

  async function handleUpdateProfile(data: FormDataProps) {
    try {
      setIsUpdatingUserProfile(true)

      await api.put('/users', data)

      const userUpdated = user
      userUpdated.name = data.name

      await updateUserProfile(userUpdated)

      toast.show({
        placement: "top",
        render: ({ id }) => (
          <ToastMessage 
            id={id}
            title="Sucesso!"
            description="O seu perfil foi atualizado."
            action="success"
            onClose={() => toast.close(id)}
          />
        )
      })

    } catch (error) {
      const isAppError = error instanceof AppError;

      const errorTitle = isAppError ? error.message : 'Não foi possivel atualizar os seus dados. Tente novamente mais tarde.'

      toast.show({
        placement: "top",
        render: ({ id }) => (
          <ToastMessage 
            id={id}
            title="Erro"
            description={errorTitle}
            action="error"
            onClose={() => toast.close(id)}
          />
        )
      })
    } finally {
      setIsUpdatingUserProfile(false)
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
            <Controller 
              control={control}
              name="name"
              render={({ field: {value, onChange} }) => (
                <Input 
                  placeholder="Nome" 
                  bg="$gray500" 
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.name?.message}
                />
              )}
            />
            
            <Input 
              value={user.email}
              bg="$gray500"
              isReadOnly
            />
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
            <Controller 
              control={control}
              name="old_password"
              render={({ field: {onChange} }) => (
                <Input 
                  placeholder="Senha antiga" 
                  bg="$gray600" 
                  secureTextEntry 
                  onChangeText={onChange}
                />
              )}
            />

            <Controller 
              control={control}
              name="password"
              render={({ field: {onChange} }) => (
                <Input 
                  placeholder="Nova senha" 
                  bg="$gray600" 
                  secureTextEntry 
                  onChangeText={onChange}
                  errorMessage={errors.password?.message}
                />
              )}
            />

            <Controller 
              control={control}
              name="confirm_password"
              render={({ field: {onChange} }) => (
                <Input 
                  placeholder="Confirme a nova senha" 
                  bg="$gray600" 
                  secureTextEntry 
                  onChangeText={onChange}
                  errorMessage={errors.confirm_password?.message}
                />
              )}
            />

            <Button 
              mt={4}
              title="Atualizar cadastro"
              onPress={handleSubmit(handleUpdateProfile)}
              isLoading={isUpdatingUserProfile}
            />
          </Center>
        </Center>
      </ScrollView>
    </VStack>
  )
}