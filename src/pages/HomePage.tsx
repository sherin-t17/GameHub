import {
  Box,
  Button,
  HStack,
  SimpleGrid,
  Text,
  VStack,
  Badge,
  Wrap,
  WrapItem,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link, useSearchParams } from "react-router-dom";
import { IoArrowForward, IoSparkles, IoTrophy } from "react-icons/io5";
import { GiCrossedSwords, GiSpellBook, GiPerspectiveDiceSixFacesRandom } from "react-icons/gi";
import { motion } from "framer-motion";
import GameGrid from "../components/game/GameGrid";
import { mockGames } from "../mocks/mockGames";
import { useGenres } from "../hooks/useGenres";
import { useLibraryStore } from "../store/useLibraryStore";
import { getGenreFallbackImage } from "../utils/gameFallbackImage";

const MotionBox = motion(Box);

const quickModes = [
  { label: "Top Rated", icon: IoTrophy, filter: "top-rated", accent: "#c9a84c" },
  { label: "New Releases", icon: IoSparkles, filter: "new-releases", accent: "#4fc3f7" },
  { label: "Most Played", icon: GiCrossedSwords, filter: "most-played", accent: "#ef5350" },
];

const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { genres } = useGenres();
  const wishlistCount = useLibraryStore((store) => store.wishlist.length);
  const collectionCount = useLibraryStore((store) => store.collection.length);
  const backlogCount = useLibraryStore((store) => store.backlog.length);
  const historyCount = useLibraryStore((store) => store.history.length);
  const hasActiveView = [
    "genre",
    "platform",
    "ordering",
    "search",
    "filter",
    "page",
  ].some((key) => Boolean(searchParams.get(key)));

  const featuredGame = [...mockGames].sort((left, right) => right.rating - left.rating)[0];
  const heroImage = featuredGame.background_image ?? getGenreFallbackImage(featuredGame.name, featuredGame.genres);
  const panelBg = useColorModeValue("rgba(249,241,228,0.9)", "rgba(15,16,32,0.72)");
  const borderColor = useColorModeValue("rgba(140,115,80,0.2)", "rgba(201,168,76,0.18)");
  const subtleText = useColorModeValue("gray.700", "text.secondary");

  const setFilter = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    next.set(key, value);
    next.delete("page");
    setSearchParams(next);
  };

  return (
    <VStack align="stretch" spacing={8}>
      {!hasActiveView && (
        <MotionBox
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          position="relative"
          overflow="hidden"
          borderRadius="2xl"
          minH={{ base: "460px", lg: "520px" }}
          border="1px solid"
          borderColor={borderColor}
          bgImage={`linear-gradient(135deg, rgba(9,9,15,0.88), rgba(9,9,15,0.38)), url(${heroImage})`}
          bgSize="cover"
          bgPosition="center"
          boxShadow="0 24px 70px rgba(0,0,0,0.35)"
        >
          <Box
            position="absolute"
            inset={0}
            bgGradient="radial(circle at top right, rgba(201,168,76,0.25), transparent 35%)"
          />

          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} p={{ base: 6, md: 8, lg: 10 }}>
            <VStack align="start" spacing={5} justify="space-between" minH="100%">
              <VStack align="start" spacing={4} maxW="560px">
                <Text
                  fontFamily="heading"
                  fontSize={{ base: "3xl", md: "5xl" }}
                  fontWeight="800"
                  lineHeight="0.95"
                  letterSpacing="0.05em"
                  textTransform="uppercase"
                  color="white"
                  textShadow="0 6px 30px rgba(0,0,0,0.45)"
                >
                  {featuredGame.name}
                </Text>

                <HStack spacing={3} flexWrap="wrap">
                  <Badge bg="brand.accent" color="brand.900" px={3} py={1} borderRadius="full">
                    {featuredGame.rating.toFixed(1)} rating
                  </Badge>
                  <Badge bg="rgba(9,9,15,0.72)" color="white" px={3} py={1} borderRadius="full">
                    {featuredGame.playtime}h campaign
                  </Badge>
                  {featuredGame.genres.map((genre) => (
                    <Badge key={genre.id} bg="rgba(9,9,15,0.54)" color="text.secondary" px={3} py={1} borderRadius="full">
                      {genre.name}
                    </Badge>
                  ))}
                </HStack>

                <Text maxW="520px" color="whiteAlpha.880" fontSize="md" lineHeight="1.8">
                  Enter a polished arcade of top-rated adventures, dark fantasy epics, and stylish indies.
                  Track your wishlist, build a flex-worthy library, and jump into your next obsession fast.
                </Text>

                <HStack spacing={3} flexWrap="wrap">
                  <Button
                    as={Link}
                    to={`/games/${featuredGame.id}`}
                    rightIcon={<IoArrowForward />}
                    variant="accent"
                    size="md"
                  >
                    Enter Spotlight
                  </Button>
                  <Button
                    variant="outline"
                    borderColor="whiteAlpha.500"
                    color="white"
                    _hover={{ bg: "whiteAlpha.200", borderColor: "brand.accent" }}
                    onClick={() => setFilter("filter", "top-rated")}
                  >
                    Browse Top Rated
                  </Button>
                </HStack>
              </VStack>

              <Wrap spacing={3}>
                {quickModes.map(({ label, icon: Icon, filter, accent }) => (
                  <WrapItem key={filter}>
                    <Button
                      leftIcon={<Icon />}
                      variant="ghost"
                      bg="rgba(9,9,15,0.55)"
                      color="white"
                      border="1px solid"
                      borderColor="whiteAlpha.300"
                      _hover={{ borderColor: accent, color: accent, bg: "rgba(9,9,15,0.8)" }}
                      onClick={() => setFilter("filter", filter)}
                    >
                      {label}
                    </Button>
                  </WrapItem>
                ))}
              </Wrap>
            </VStack>

            <VStack align="stretch" justify="end" spacing={4}>
              <Box
                alignSelf={{ base: "stretch", lg: "flex-end" }}
                maxW="460px"
                w="100%"
                p={5}
                borderRadius="2xl"
                bg={panelBg}
                backdropFilter="blur(18px)"
                border="1px solid"
                borderColor={borderColor}
              >
                <Text fontFamily="heading" fontSize="sm" letterSpacing="0.14em" color="brand.accent" mb={4}>
                  COMMAND CENTER
                </Text>

                <SimpleGrid columns={2} spacing={3}>
                  <Box p={3} borderRadius="xl" bg="rgba(9,9,15,0.22)">
                    <Text fontFamily="heading" fontSize="2xl" color="text.primary">
                      {mockGames.length}
                    </Text>
                    <Text fontSize="xs" color={subtleText} textTransform="uppercase" letterSpacing="0.08em">
                      Playable picks
                    </Text>
                  </Box>
                  <Box p={3} borderRadius="xl" bg="rgba(9,9,15,0.22)">
                    <Text fontFamily="heading" fontSize="2xl" color="text.primary">
                      {genres.length || 12}
                    </Text>
                    <Text fontSize="xs" color={subtleText} textTransform="uppercase" letterSpacing="0.08em">
                      Genre lanes
                    </Text>
                  </Box>
                  <Box p={3} borderRadius="xl" bg="rgba(9,9,15,0.22)">
                    <Text fontFamily="heading" fontSize="2xl" color="text.primary">
                      {wishlistCount + collectionCount}
                    </Text>
                    <Text fontSize="xs" color={subtleText} textTransform="uppercase" letterSpacing="0.08em">
                      Saved games
                    </Text>
                  </Box>
                  <Box p={3} borderRadius="xl" bg="rgba(9,9,15,0.22)">
                    <Text fontFamily="heading" fontSize="2xl" color="text.primary">
                      {backlogCount + historyCount}
                    </Text>
                    <Text fontSize="xs" color={subtleText} textTransform="uppercase" letterSpacing="0.08em">
                      Progress queue
                    </Text>
                  </Box>
                </SimpleGrid>

                <Text mt={4} fontSize="sm" color={subtleText} lineHeight="1.7">
                  Quick jump:
                </Text>
                <Wrap mt={3} spacing={2}>
                  {genres.slice(0, 6).map((genre) => (
                    <WrapItem key={genre.id}>
                      <Button
                        size="sm"
                        variant="ghost"
                        bg="rgba(9,9,15,0.08)"
                        color="text.secondary"
                        _hover={{ color: "brand.accent", bg: "rgba(9,9,15,0.18)" }}
                        onClick={() => setFilter("genre", genre.slug)}
                        leftIcon={<GiPerspectiveDiceSixFacesRandom />}
                      >
                        {genre.name}
                      </Button>
                    </WrapItem>
                  ))}
                </Wrap>
              </Box>

              <HStack
                maxW="460px"
                w="100%"
                alignSelf={{ base: "stretch", lg: "flex-end" }}
                p={4}
                borderRadius="2xl"
                bg="rgba(9,9,15,0.64)"
                border="1px solid"
                borderColor="rgba(201,168,76,0.18)"
                justify="space-between"
                flexWrap="wrap"
                gap={3}
              >
                <VStack align="start" spacing={0}>
                  <Text fontFamily="heading" fontSize="sm" color="white">
                    Library Sync Online
                  </Text>
                  <Text fontSize="xs" color="whiteAlpha.700">
                    Wishlist, backlog, collection and play history are ready.
                  </Text>
                </VStack>
                <Button
                  as={Link}
                  to="/library"
                  variant="ghost"
                  color="brand.accent"
                  leftIcon={<GiSpellBook />}
                  _hover={{ bg: "whiteAlpha.100" }}
                >
                  Open Library
                </Button>
              </HStack>
            </VStack>
          </SimpleGrid>
        </MotionBox>
      )}

      <GameGrid />
    </VStack>
  );
};

export default HomePage;
