import {
  Box,
  SimpleGrid,
  Text,
  HStack,
  VStack,
  Button,
  Select,
  Wrap,
  WrapItem,
  Tag,
  TagLabel,
  TagCloseButton,
  useColorModeValue,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { IoFunnel, IoChevronBack, IoChevronForward } from "react-icons/io5";
import { useGames } from "../../hooks/useGames";
import GameCard from "./GameCard";
import GameCardSkeleton from "./GameCardSkeleton";

const MotionBox = motion(Box);

const SORT_OPTIONS = [
  { label: "Relevance", value: "" },
  { label: "Top Rated", value: "-rating" },
  { label: "New Releases", value: "-released" },
  { label: "Most Played", value: "-added" },
  { label: "Name A-Z", value: "name" },
  { label: "Name Z-A", value: "-name" },
];

const PLATFORM_OPTIONS = [
  { label: "All Platforms", value: "" },
  { label: "PC", value: "4" },
  { label: "PlayStation", value: "187" },
  { label: "Xbox", value: "186" },
  { label: "Nintendo", value: "7" },
  { label: "iOS", value: "3" },
  { label: "Android", value: "21" },
];

const GameGrid = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { games, isLoading, error, totalCount, hasMore, query } = useGames();

  const mutedColor = useColorModeValue("gray.600", "text.muted");
  const selectBg = useColorModeValue("light.surface", "brand.700");
  const selectBorder = useColorModeValue("light.border", "brand.500");

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    next.delete("page");
    setSearchParams(next);
  };

  const clearParam = (key: string) => setParam(key, "");

  const goToPage = (page: number) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(page));
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const chips: { key: string; label: string }[] = [];
  if (query.genre) chips.push({ key: "genre", label: `Genre: ${query.genre}` });
  if (query.platform) {
    chips.push({ key: "platform", label: `Platform: ${query.platform}` });
  }
  if (query.filter) {
    chips.push({ key: "filter", label: query.filter.replace("-", " ") });
  }
  if (query.search) {
    chips.push({ key: "search", label: `"${query.search}"` });
  }

  const heading = query.search
    ? `Results for "${query.search}"`
    : query.genre
      ? `${query.genre.charAt(0).toUpperCase()}${query.genre.slice(1)} Games`
      : query.filter
        ? query.filter
            .split("-")
            .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
            .join(" ")
        : "All Games";

  const currentPage = query.page ?? 1;
  const totalPages = Math.ceil(totalCount / 20);

  return (
    <VStack align="stretch" spacing={5}>
      <HStack justify="space-between" align="flex-start" flexWrap="wrap" gap={3}>
        <Box>
          <Text
            fontFamily="heading"
            fontSize={{ base: "xl", md: "2xl" }}
            fontWeight="700"
            letterSpacing="0.06em"
            color="text.primary"
            textTransform="uppercase"
          >
            {heading}
          </Text>
          {!isLoading && totalCount > 0 && (
            <Text fontSize="xs" color={mutedColor} fontFamily="body" mt={0.5}>
              {totalCount.toLocaleString()} games found
            </Text>
          )}
        </Box>

        <HStack spacing={3} flexWrap="wrap">
          <Select
            size="sm"
            value={query.platform ?? ""}
            onChange={(event) => setParam("platform", event.target.value)}
            bg={selectBg}
            borderColor={selectBorder}
            borderRadius="md"
            fontFamily="body"
            fontSize="sm"
            color="text.secondary"
            w="150px"
            icon={<IoFunnel />}
            _focus={{ borderColor: "brand.accent" }}
          >
            {PLATFORM_OPTIONS.map((platform) => (
              <option key={platform.value} value={platform.value}>
                {platform.label}
              </option>
            ))}
          </Select>

          <Select
            size="sm"
            value={query.ordering ?? ""}
            onChange={(event) => setParam("ordering", event.target.value)}
            bg={selectBg}
            borderColor={selectBorder}
            borderRadius="md"
            fontFamily="body"
            fontSize="sm"
            color="text.secondary"
            w="150px"
            _focus={{ borderColor: "brand.accent" }}
          >
            {SORT_OPTIONS.map((sortOption) => (
              <option key={sortOption.value} value={sortOption.value}>
                {sortOption.label}
              </option>
            ))}
          </Select>
        </HStack>
      </HStack>

      <AnimatePresence>
        {chips.length > 0 && (
          <MotionBox
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Wrap spacing={2}>
              {chips.map(({ key, label }) => (
                <WrapItem key={key}>
                  <Tag
                    size="sm"
                    bg="brand.700"
                    color="brand.accent"
                    border="1px solid"
                    borderColor="brand.accentDim"
                    borderRadius="full"
                    fontFamily="body"
                    fontSize="xs"
                    letterSpacing="0.04em"
                  >
                    <TagLabel textTransform="capitalize">{label}</TagLabel>
                    <TagCloseButton
                      color="brand.accentDim"
                      _hover={{ color: "brand.accent" }}
                      onClick={() => clearParam(key)}
                    />
                  </Tag>
                </WrapItem>
              ))}
            </Wrap>
          </MotionBox>
        )}
      </AnimatePresence>

      {error && (
        <Alert status="error" bg="brand.700" borderRadius="md">
          <AlertIcon color="red.400" />
          <Text fontFamily="body" fontSize="sm" color="text.secondary">
            {error}
          </Text>
        </Alert>
      )}

      <SimpleGrid columns={{ base: 1, sm: 2, md: 2, lg: 3, xl: 4 }} spacing={5}>
        {isLoading
          ? Array.from({ length: 20 }).map((_, index) => (
              <GameCardSkeleton key={index} />
            ))
          : games.map((game, index) => (
              <MotionBox
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03, duration: 0.25 }}
              >
                <GameCard game={game} />
              </MotionBox>
            ))}
      </SimpleGrid>

      {!isLoading && games.length === 0 && !error && (
        <VStack py={16} spacing={3} opacity={0.5}>
          <Text fontSize="3xl">No results</Text>
          <Text
            fontFamily="heading"
            fontSize="sm"
            letterSpacing="0.1em"
            color={mutedColor}
          >
            NO GAMES FOUND
          </Text>
          <Text fontSize="xs" color={mutedColor} fontFamily="body">
            Try adjusting your filters
          </Text>
        </VStack>
      )}

      {!isLoading && totalCount > 20 && (
        <HStack justify="center" spacing={3} pt={4}>
          <Button
            size="sm"
            leftIcon={<IoChevronBack />}
            variant="ghost"
            fontFamily="heading"
            fontSize="xs"
            letterSpacing="0.08em"
            color="text.secondary"
            isDisabled={currentPage <= 1}
            _hover={{ color: "brand.accent" }}
            onClick={() => goToPage(currentPage - 1)}
          >
            Prev
          </Button>

          <HStack spacing={1}>
            {Array.from({ length: Math.min(5, totalPages) }, (_, index) => {
              const page = index + 1;
              const isActive = page === currentPage;

              return (
                <Button
                  key={page}
                  size="xs"
                  variant={isActive ? "solid" : "ghost"}
                  bg={isActive ? "brand.accent" : "transparent"}
                  color={isActive ? "brand.900" : "text.muted"}
                  fontFamily="heading"
                  fontSize="xs"
                  _hover={{ bg: isActive ? "brand.accentHover" : "brand.600" }}
                  onClick={() => goToPage(page)}
                  minW="32px"
                >
                  {page}
                </Button>
              );
            })}
          </HStack>

          <Button
            size="sm"
            rightIcon={<IoChevronForward />}
            variant="ghost"
            fontFamily="heading"
            fontSize="xs"
            letterSpacing="0.08em"
            color="text.secondary"
            isDisabled={!hasMore}
            _hover={{ color: "brand.accent" }}
            onClick={() => goToPage(currentPage + 1)}
          >
            Next
          </Button>
        </HStack>
      )}
    </VStack>
  );
};

export default GameGrid;
