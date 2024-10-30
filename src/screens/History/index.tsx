import { useState } from "react";
import { SectionList } from "react-native";

import { VStack, Text } from "@gluestack-ui/themed";

import { ScreenHeader } from "../../components/ScreenHeader";
import { ExerciseHistoryCard } from "./components/ExerciseHistoryCard";

export function History() {
  const [exercises, setExercises] = useState([
    {
      title: "22.07.24",
      data: ["Puxada frontal", "Remada unilateral"]
    },
    {
      title: "23.07.2024",
      data: ["Puxada frontal"]
    },
  ])

  return(
    <VStack flex={1}>
      <ScreenHeader title="Histórico" />

      <SectionList 
        sections={exercises}
        keyExtractor={item => item}
        renderItem={() => <ExerciseHistoryCard />}
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