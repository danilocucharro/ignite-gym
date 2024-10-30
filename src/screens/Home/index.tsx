import { useState } from "react";
import { FlatList, Text } from "@gluestack-ui/themed";

import { HStack, VStack, Heading } from "@gluestack-ui/themed";

import { Header } from "./components/Header";
import { MuscleGroup } from "./components/MuscleGroup";
import { ExerciseCard } from "./components/ExerciseCard";

export function Home() {
  const [muscleGroupList, setMuscleGroupList] = useState([
    "Costas",
    "Ombro",
    "Bíceps",
    "Tríceps"
  ])
  const [exercisesList, setExercisesList] = useState([
    "Puxada frontal",
    "Remada curvada",
    "Remada unilateral",
    "levantamento terra",
    "3",
    "4",
    "5"
  ])
  const [groupSelected, setGroupSelected] = useState("Costas")

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

      <VStack px="$8" flex={1}>
        <HStack justifyContent="space-between" mb="$5" alignItems="center">
          <Heading color="$gray200" fontSize="$md" fontFamily="$heading">
            Exercícios
          </Heading>

          <Text color="$gray200" fontSize="$sm" fontFamily="$body">
            {exercisesList.length}
          </Text>
        </HStack>
        
        <FlatList 
          data={exercisesList}
          keyExtractor={item => item}
          renderItem={() => <ExerciseCard />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </VStack>
    </VStack>
  )
}