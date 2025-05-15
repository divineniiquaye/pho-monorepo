import { Link, Stack } from "expo-router";

import { buttonVariants, Text, VStack } from "@repo/design/ui";

export default function NotFound() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <VStack space="md" className="flex-1 items-center justify-center p-5">
        <Text role="heading" className="text-2xl font-bold">
          This screen doesn&apos;t exist.
        </Text>

        <Link href="/" className={buttonVariants({ variant: "link" })}>
          <Text className="text-[#2e78b7] text-xl">Go to home screen!</Text>
        </Link>
      </VStack>
    </>
  );
}
