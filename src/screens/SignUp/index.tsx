import { useState } from "react";
import { useNavigation } from "@react-navigation/native";

import { useForm, Controller } from "react-hook-form";
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"

import { AuthNavigatorRoutesProps } from "@routes/auth.routes";

import { Center, Heading, Image, Text, VStack, ScrollView, useToast } from "@gluestack-ui/themed";

import BackGroundImg from "@assets/background.png"
import Logo from "@assets/logo.svg"

import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { ToastMessage } from "@components/ToastMessage";

import { useAuth } from "@hooks/UseAuth";

import { api } from "@services/api";

import { AppError } from "@utils/AppError";

type FormDataType = {
  name: string;
  email: string;
  password: string;
  password_confirm: string;
}

const signUpSchema = yup.object({
  name: yup.string().required('Informe o nome.'),
  email: yup.string().required('Informe o e-mail.').email('E-mail inválido.'),
  password: yup
    .string()
    .required('Informe a senha.')
    .min(6, 'A senha dever ter pelo menos 6 caracteres.'),
  password_confirm: yup
  .string()
  .required('Confirme a senha.')
  .oneOf([yup.ref("password"), ""], "As senhas precisam ser iguais.")
});

export function SignUp() {
  const [isLoading, setIsloading] = useState(false)

  const { 
    control, 
    handleSubmit, 
    formState: {errors} 
  } = useForm<FormDataType>({
    resolver: yupResolver(signUpSchema)
  })

  const toast = useToast()
  const { signIn } = useAuth()

  const navigation = useNavigation<AuthNavigatorRoutesProps>()

  function handleBackToSignIn() {
    navigation.navigate("signIn")
  }

  async function handleSignUp({ name, email, password }: FormDataType) {
    try {
      setIsloading(true)

      await api.post("/users", { name, email, password })
      await signIn(email, password)

    } catch (error) {
      setIsloading(false)

      const isAppError = error instanceof AppError;
      const errorTitle = isAppError ? error.message : 'Não foi possivel criar a conta. Tente novamente mais tarde.'

      toast.show({
        placement: "top",
        render: ({ id }) => (
          <ToastMessage 
            id={id}
            title={errorTitle}
            action="error"
            onClose={() => toast.close(id)}
          />
        )
      })
    }
  }
  
  return(
    <ScrollView 
      contentContainerStyle={{flexGrow: 1}}
      showsVerticalScrollIndicator={false}
    >
      <VStack flex={1}>
        <Image
          w="$full"
          h={624}
          position="absolute"
          source={BackGroundImg}
          defaultSource={BackGroundImg}
          alt="Pessoas treinando"
        />

        <VStack flex={1} px="$10" pb="$16">
          <Center my="$24">
            <Logo />

            <Text color="$gray100" fontSize="$sm">
              Treine sua mente e o seu corpo.
            </Text>
          </Center>

          <Center gap="$2" flex={1}>
            <Heading color="$gray100">Crie sua conta</Heading>

            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, value } }) => (
                <Input 
                  placeholder="Nome" 
                  onChangeText={onChange} 
                  value={value}
                  errorMessage={errors.name?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <Input 
                  placeholder="E-mail" 
                  keyboardType="email-address" 
                  autoCapitalize="none"
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.email?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <Input 
                  placeholder="Senha" 
                  secureTextEntry
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.password?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="password_confirm"
              render={({ field: { onChange, value } }) => (
                <Input 
                  placeholder="Confirme a senha" 
                  secureTextEntry
                  onChangeText={onChange}
                  value={value}
                  onSubmitEditing={handleSubmit(handleSignUp)}
                  returnKeyType="send"
                  errorMessage={errors.password_confirm?.message}
                />
              )}
            />

            <Button 
              title="Criar e acessar" 
              onPress={handleSubmit(handleSignUp)}
              isLoading={isLoading}
            />
          </Center>

          <Button 
            title="Voltar para o login" 
            variant="outline" 
            mt="$12"
            onPress={handleBackToSignIn}
          />
        </VStack>
      </VStack>
    </ScrollView>
  )
}