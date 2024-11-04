import { HistoryDTO } from "@dtos/HistoryDTO";

import { HStack, Text, VStack } from "@gluestack-ui/themed";

type ExerciseHistoryCardProps = {
  data: HistoryDTO;
}

export function ExerciseHistoryCard({ data }: ExerciseHistoryCardProps ) {
  return(
    <HStack 
      w="$full" 
      px="$5" 
      py="$4" 
      mb="$3" 
      bg="$gray600" 
      rounded="$md"
      alignItems="center"
      justifyContent="space-between"
    >
      <VStack mr="$5" gap="$2" flex={1}>
        <Text 
          color="$white" 
          fontSize="$md" 
          textTransform="capitalize" 
          fontFamily="$heading"
          numberOfLines={1}
        >
          {data.group}
        </Text>

        <Text color="$gray100" fontSize="$lg" numberOfLines={1}>
          {data.name}
        </Text>
      </VStack>

      <Text color="$gray300" fontSize="$md">{data.hour}</Text>
    </HStack>
  )
}