import { useState } from "react";
import { FlatList } from "@gluestack-ui/themed";

import { HStack, VStack } from "@gluestack-ui/themed";

import { Header } from "./components/Header";
import { MuscleGroup } from "./components/MuscleGroup";

export function Home() {
  const [muscleGroupList, setMuscleGroupList] = useState([
    "Costas",
    "Ombro",
    "Biceps",
    "Triceps"
  ])
  const [groupSelected, setGroupSelected] = useState("Costas")

  return(
    <VStack flex={1}>
      <Header />

      <FlatList 
        data={muscleGroupList}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <MuscleGroup 
            name={item}
            isActive={groupSelected === item} 
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
    </VStack>
  )
}