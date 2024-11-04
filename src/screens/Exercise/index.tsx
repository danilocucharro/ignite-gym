import { useEffect, useState } from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

import { VStack, Icon, HStack, Text, Image, Box, useToast } from "@gluestack-ui/themed";

import { Button } from "@components/Button";
import { ToastMessage } from "@components/ToastMessage";
import { Loading } from "@components/Loading";

import BodySvg from "@assets/body.svg"
import SeriesSvg from "@assets/series.svg"
import RepetitionsSvg from "@assets/repetitions.svg"
import { ArrowLeft } from "lucide-react-native";

import { AppNavigationRoutesProps } from "@routes/app.routes";

import { ExerciseDTO } from "@dtos/ExerciseDTO";

import { AppError } from "@utils/AppError";
import { api } from "@services/api";

type RouteParamsProps = {
  exerciseId: string
}

export function Exercise() {
  const [isRegisteringExercise, setIsRegisteringExercise] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [exercise, setExercise] = useState<ExerciseDTO>({} as ExerciseDTO)

  const navigation = useNavigation<AppNavigationRoutesProps>()

  const route = useRoute();
  const toast = useToast()

  const { exerciseId } = route.params as RouteParamsProps
  function handleBackToHome() {
    navigation.goBack()
  }

  async function fetchExerciseDetails() {
    try {
      setIsLoading(true)
      const response = await api.get(`/exercises/${exerciseId}`)
      setExercise(response.data)

    } catch (error) {
      const isAppError = error instanceof AppError;
      const errorTitle = isAppError ? error.message : 'Não foi possivel os detalhes do exercicio.'

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
    } finally {
      setIsLoading(false)
    }
  }

  async function handleRegisterExercise() {
    try {
      setIsRegisteringExercise(true)
      await api.post('/history', { exercise_id: exerciseId })

      toast.show({
        placement: "top",
        render: ({ id }) => (
          <ToastMessage 
            id={id}
            title="Parabens! O exercicio foi registrado no seu historico."
            action="success"
            onClose={() => toast.close(id)}
          />
        )
      })

      navigation.navigate('history')

    } catch (error) {
      const isAppError = error instanceof AppError;
      const errorTitle = isAppError ? error.message : 'Não foi possivel registrar o exercicio.'

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
    } finally {
      setIsRegisteringExercise(false)
    }
  }

  useEffect(() => {
    fetchExerciseDetails()
  }, [exerciseId])

  return(
    <VStack flex={1}>
      <VStack px="$8" bg="$gray600" pt="$12">
        <TouchableOpacity onPress={handleBackToHome}>
          <Icon as={ArrowLeft} color="$green500" size="xl" />
        </TouchableOpacity>

        <HStack justifyContent="space-between" alignItems="center" mt="$4" pb="$8">
          <Text 
            color="$gray100" 
            fontFamily="$heading"
            fontSize="$lg"
            flexShrink={1}
          >
            {exercise.name}
          </Text>

          <HStack alignItems="center" >
            <BodySvg />

            <Text 
              color="$gray200"
              ml="$1"
              textTransform="capitalize"
            >
              {exercise.group}
            </Text>
          </HStack>
        </HStack>
      </VStack>

      {isLoading ? (
        <Loading />
      ) : (
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 32
          }}
        >
          <VStack p="$8">
            <Image 
              source={{ 
                uri: `${api.defaults.baseURL}/exercise/demo/${exercise.demo}`
              }}
              alt="exercise image"
              mb="$3"
              resizeMode="cover"
              rounded="$lg"
              w="$full"
              h="$80"
            />

            <Box bg="$gray600" rounded="$md" pb="$4" px="$4">
              <HStack alignItems="center" justifyContent="space-around" mb="$6" mt="$5">
                <HStack alignItems="center">
                  <SeriesSvg />
                  <Text color="$gray200" ml="$2">
                    {exercise.series} séries
                  </Text>
                </HStack>

                <HStack alignItems="center">
                  <RepetitionsSvg />
                  <Text color="$gray200" ml="$2">
                    {exercise.repetitions} repetições
                  </Text>
                </HStack>
              </HStack>

              <Button 
                title="Marcar como realizado" 
                isLoading={isRegisteringExercise}
                onPress={handleRegisterExercise}
              />
            </Box>
          </VStack>
        </ScrollView>
      )}
    </VStack>
  )
}