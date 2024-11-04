import { useCallback, useState } from "react";
import { SectionList } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { VStack, Text, useToast } from "@gluestack-ui/themed";

import { ScreenHeader } from "../../components/ScreenHeader";
import { ToastMessage } from "@components/ToastMessage";
import { ExerciseHistoryCard } from "./components/ExerciseHistoryCard";

import { SectionHistoryDTO } from "@dtos/SectionHistoryDTO";

import { AppError } from "@utils/AppError";

import { api } from "@services/api";

export function History() {
  const [isLoading, setIsloading] = useState(true)
  const [exercises, setExercises] = useState<SectionHistoryDTO[]>([])
  const toast = useToast()

  async function fetchExerciceHistory() {
    try {
      setIsloading(true)
      const response = await api.get('/history')
      setExercises(response.data)
      
    } catch (error) {
      const isAppError = error instanceof AppError;
      const errorTitle = isAppError ? error.message : 'Não foi possivel carregar o historico.'

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
      setIsloading(false)
    }
  }

  useFocusEffect(useCallback(() => {
    fetchExerciceHistory()
  }, []))

  return(
    <VStack flex={1}>
      <ScreenHeader title="Histórico" />

      <SectionList 
        sections={exercises}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <ExerciseHistoryCard data={item} />}
        renderSectionHeader={({ section }) => (
          <Text color="$gray200" fontSize="$md" mt="$10" mb="$3" fontFamily="$heading">
            {section.title}
          </Text>
        )}
        style={{ paddingHorizontal: 32 }}
        contentContainerStyle={
          exercises.length === 0 && { flex: 1, justifyContent: "center" }
        }
        ListEmptyComponent={() => (
          <Text color="$gray100" textAlign="center">
            Nao ha exercicios registrados ainda. {"\n"}Vamos treinar hoje?
          </Text>
        )}
        showsVerticalScrollIndicator={false}
      />
    </VStack>
  )
}