import { View } from "react-native";

import { Skeleton, SkeletonText } from "../themed/skeleton";
import { HStack, VStack } from "../themed/stack";

export const LayoutPlaceholder = () => {
  return (
    <View className="gap-y-2 mt-4">
      <Skeleton className="h-6 mb-3 rounded" />
      <HStack className="mb-5 rounded-xl h-14 gap-5">
        <Skeleton className="size-10 rounded-full" />
        <VStack space="sm" className="flex-1">
          <SkeletonText className="h-4" />
          <SkeletonText className="h-3 w-[90%]" />
        </VStack>
      </HStack>
      <HStack className="mb-5 rounded-xl h-14 gap-5">
        <Skeleton className="size-10 rounded-full" />
        <VStack space="sm" className="flex-1">
          <SkeletonText className="h-4" />
          <SkeletonText className="h-3 w-[90%]" />
        </VStack>
      </HStack>
    </View>
  );
};
