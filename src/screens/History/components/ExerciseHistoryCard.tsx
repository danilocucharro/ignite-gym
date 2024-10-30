import { HStack, Text, VStack } from "@gluestack-ui/themed";

export function ExerciseHistoryCard() {
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
      <VStack mr="$5" gap="$2">
        <Text 
          color="$white" 
          fontSize="$md" 
          textTransform="capitalize" 
          fontFamily="$heading"
        >
          Costas
        </Text>

        <Text color="$gray100" fontSize="$lg" numberOfLines={1}>
          Puxada frontal
        </Text>
      </VStack>

      <Text color="$gray300" fontSize="$md">8:30</Text>
    </HStack>
  )
}