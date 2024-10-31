import { ScrollView, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { VStack, Icon, HStack, Text, Image, Box } from "@gluestack-ui/themed";

import { Button } from "@components/Button";

import BodySvg from "@assets/body.svg"
import SeriesSvg from "@assets/series.svg"
import RepetitionsSvg from "@assets/repetitions.svg"
import { ArrowLeft } from "lucide-react-native";

import { AppNavigationRoutesProps } from "@routes/app.routes";

export function Exercise() {
  const navigation = useNavigation<AppNavigationRoutesProps>()

  function handleBackToHome() {
    navigation.goBack()
  }

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
            Puxada frontal
          </Text>

          <HStack alignItems="center" >
            <BodySvg />

            <Text 
              color="$gray200"
              ml="$1"
              textTransform="capitalize"
            >
              Costas
            </Text>
          </HStack>
        </HStack>
      </VStack>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 32
        }}
      >
        <VStack p="$8">
          <Image 
            source={{ 
              uri: "https://i.pinimg.com/236x/26/a4/31/26a4312ea5c9d9ca5415cef6670f88f0.jpg"
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
                  3 séries
                </Text>
              </HStack>

              <HStack alignItems="center">
                <RepetitionsSvg />
                <Text color="$gray200" ml="$2">
                  12 repetições
                </Text>
              </HStack>
            </HStack>

            <Button title="Marcar como realizado" />
          </Box>
        </VStack>
      </ScrollView>
    </VStack>
  )
}