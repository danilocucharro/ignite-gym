import { useCallback, useEffect, useState } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { FlatList } from "react-native";

import { Text, useToast, HStack, VStack } from "@gluestack-ui/themed";

import { Header } from "./components/Header";
import { MuscleGroup } from "./components/MuscleGroup";
import { ExerciseCard } from "./components/ExerciseCard";
import { ToastMessage } from "@components/ToastMessage";

import { AppNavigationRoutesProps } from "@routes/app.routes";
import { AppError } from "@utils/AppError";

import { api } from "@services/api";

import { ExerciseDTO } from "@dtos/ExerciseDTO";
import { Loading } from "@components/Loading";

export function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [muscleGroupList, setMuscleGroupList] = useState<string[]>()
  const [exercisesList, setExercisesList] = useState<ExerciseDTO[]>([])
  const [groupSelected, setGroupSelected] = useState("Costas")
  const toast = useToast()

  const navigation = useNavigation<AppNavigationRoutesProps>()

  function handleOpenExerciseInfo() {
    navigation.navigate("exercise")
  }

  async function fetchGroups() {
    try {
      const response = await api.get('/groups')
      setMuscleGroupList(response.data)

    } catch (error) {
      const isAppError = error instanceof AppError;
      const errorTitle = isAppError ? error.message : 'Não foi possivel carregar os grupos musculares.'

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

  async function fetchExercisesByGroup() {
    try {
      setIsLoading(true)
      const response = await api.get(`/exercises/bygroup/${groupSelected}`)
      setExercisesList(response.data)

    } catch (error) {
      const isAppError = error instanceof AppError;
      const errorTitle = isAppError ? error.message : 'Não foi possivel carregar os exercicios.'

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

  useEffect(() => {
    fetchGroups()
  }, [])

  useFocusEffect(useCallback(() => {
   fetchExercisesByGroup() 
  }, [groupSelected]))

  return(
    <VStack flex={1}>
      <Header />

      <FlatList 
        data={muscleGroupList}
        keyExtractor={item => item}
        renderItem={({ item }) => (
          <MuscleGroup 
            name={item}
            isActive={groupSelected.toLowerCase() === item.toLowerCase()} 
            onPress={() => setGroupSelected(item)}
          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 32 }}
        style={{
          marginVertical: 40,
          maxHeight: 44,
          minHeight: 44
        }}
      />

      {isLoading ? (
        <Loading />
      ) : (
        <VStack px="$8" flex={1}>
          <HStack justifyContent="space-between" mb="$5" alignItems="center">
            <Text color="$gray200" fontSize="$md" fontFamily="$heading">
              Exercícios
            </Text>

            <Text color="$gray200" fontSize="$sm" fontFamily="$body">
              {exercisesList.length}
            </Text>
          </HStack>
          
          <FlatList 
            data={exercisesList}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
            <ExerciseCard 
              data={item} 
              onPress={handleOpenExerciseInfo} 
            />
          )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        </VStack>
      )}
    </VStack>
  )
}