import { Box, Skeleton, SkeletonText, VStack, HStack } from "@chakra-ui/react";

const GameCardSkeleton = () => (
  <Box
    bg="brand.800"
    borderRadius="xl"
    overflow="hidden"
    border="1px solid"
    borderColor="brand.500"
  >
    <Skeleton h="180px" startColor="brand.700" endColor="brand.600" />
    <VStack align="stretch" spacing={3} px={4} pt={3} pb={4}>
      <HStack spacing={2}>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} w="14px" h="14px" borderRadius="sm"
            startColor="brand.700" endColor="brand.600" />
        ))}
      </HStack>
      <SkeletonText noOfLines={2} spacing={2}
        startColor="brand.700" endColor="brand.600" />
      <HStack justify="space-between">
        <Skeleton h="12px" w="60px" startColor="brand.700" endColor="brand.600" />
        <Skeleton h="12px" w="40px" startColor="brand.700" endColor="brand.600" />
      </HStack>
    </VStack>
  </Box>
);

export default GameCardSkeleton;