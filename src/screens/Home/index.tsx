import { Center, VStack } from "@gluestack-ui/themed";

import { Header } from "./components/Header";

export function Home() {
  return(
    <VStack flex={1}>
      <Header />
    </VStack>
  )
}