import { useState } from "react";

import { Center, Heading, Image, Text, VStack, ScrollView, useToast } from "@gluestack-ui/themed";

import { AuthNavigatorRoutesProps } from "@routes/auth.routes";
import { useNavigation } from "@react-navigation/native";

import { useForm, Controller } from "react-hook-form";
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"

import { useAuth } from "@hooks/UseAuth";

import BackGroundImg from "@assets/background.png";
import Logo from "@assets/logo.svg";

import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { ToastMessage } from "@components/ToastMessage";

import { AppError } from "@utils/AppError";

type FormDataType = {
  email: string;
  password: string;
}

const signInSchema = yup.object({
  email: yup.string().required('Informe o e-mail.').email('E-mail inválido.'),
  password: yup
    .string()
    .required('Informe a senha.')
    .min(6, 'A senha dever ter pelo menos 6 caracteres.'),
});

export function SignIn() {
  const [isLoading, setIsLoading] = useState(false)

  const { signIn } = useAuth()
  const toast = useToast()
  const navigation = useNavigation<AuthNavigatorRoutesProps>()

  const { 
    control, 
    handleSubmit, 
    formState: {errors} 
  } = useForm<FormDataType>({
    resolver: yupResolver(signInSchema)
  })

  async function handleSignIn({ email, password }: FormDataType) {
    try {
      setIsLoading(true)
      await signIn(email, password)

    } catch (error) {
      const isAppError = error instanceof AppError;

      const errorTitle = isAppError ? error.message : 'Não foi possivel entrar. Tente novamente mais tarde.'
      
      setIsLoading(false)

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

  function handleCreateNewAccount() {
    navigation.navigate("signUp")
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

          <Center gap="$2">
            <Heading color="$gray100">Acesse a conta</Heading>

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

            <Button
             title="Acessar" 
             onPress={handleSubmit(handleSignIn)} 
             isLoading={isLoading}
            />
          </Center>

          <Center flex={1} justifyContent="flex-end" mt="$4">
            <Text 
              color="$gray100" 
              fontSize="$sm" 
              mb="$3" 
              fontFamily="$body"
            >
              Ainda não tem acesso?
            </Text>

            <Button 
              title="Criar Conta" 
              variant="outline" 
              onPress={handleCreateNewAccount}
            />
          </Center>
        </VStack>
      </VStack>
    </ScrollView>
  )
}