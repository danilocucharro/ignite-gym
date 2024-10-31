import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { FlatList } from "react-native";

import { Text } from "@gluestack-ui/themed";

import { HStack, VStack } from "@gluestack-ui/themed";

import { Header } from "./components/Header";
import { MuscleGroup } from "./components/MuscleGroup";
import { ExerciseCard } from "./components/ExerciseCard";

import { AppNavigationRoutesProps } from "@routes/app.routes";

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
  ])
  const [groupSelected, setGroupSelected] = useState("Costas")

  const navigation = useNavigation<AppNavigationRoutesProps>()

  function handleOpenExerciseInfo() {
    navigation.navigate("exercise")
  }

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
          <Text color="$gray200" fontSize="$md" fontFamily="$heading">
            Exercícios
          </Text>

          <Text color="$gray200" fontSize="$sm" fontFamily="$body">
            {exercisesList.length}
          </Text>
        </HStack>
        
        <FlatList 
          data={exercisesList}
          keyExtractor={item => item}
          renderItem={() => <ExerciseCard onPress={handleOpenExerciseInfo}/>}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </VStack>
    </VStack>
  )
}