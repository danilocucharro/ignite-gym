import { Text, Center } from "@gluestack-ui/themed";

type HeaderProps = {
  title: string
}

export function ScreenHeader({ title }: HeaderProps) {
  return(
    <Center bg="$gray600" pb="$6" pt="$16">
      <Text color="$gray100" fontSize="$xl" fontFamily="$heading">
        {title}
      </Text>
    </Center>
  )
}