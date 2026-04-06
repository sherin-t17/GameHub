import {
  Box,
  VStack,
  Text,
  HStack,
  Skeleton,
  Divider,
  useColorModeValue,
  Badge,
  Button,
} from "@chakra-ui/react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { IoFlame, IoTrophy, IoSparkles, IoTime } from "react-icons/io5";
import { GiConsoleController } from "react-icons/gi";
import { useGenres } from "../../hooks/useGenres";

const MotionBox = motion(Box);

interface SidebarProps {
  onClose: () => void;
}

const TOP_SECTIONS = [
  { label: "New Releases", icon: IoSparkles, filter: "new-releases", color: "#4fc3f7" },
  { label: "Top Rated", icon: IoTrophy, filter: "top-rated", color: "#c9a84c" },
  { label: "Most Played", icon: IoFlame, filter: "most-played", color: "#ef5350" },
  { label: "Coming Soon", icon: IoTime, filter: "coming-soon", color: "#ab47bc" },
];

const GENRE_COLORS: Record<string, string> = {
  action: "#ef5350",
  rpg: "#ab47bc",
  strategy: "#42a5f5",
  shooter: "#ff7043",
  adventure: "#26a69a",
  puzzle: "#ffca28",
  sports: "#66bb6a",
  racing: "#29b6f6",
  simulation: "#8d6e63",
  indie: "#ec407a",
  arcade: "#ffa726",
  fighting: "#d32f2f",
};

const genreColor = (slug: string) => GENRE_COLORS[slug.toLowerCase()] ?? "#c9a84c";

const Sidebar = ({ onClose }: SidebarProps) => {
  const { genres, isLoading } = useGenres();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeGenre = searchParams.get("genre");
  const activeSection = searchParams.get("filter");
  const activeSearch = searchParams.get("search");
  const hasActiveFilters = Boolean(activeGenre || activeSection || activeSearch);

  const setFilter = (key: string, value: string) => {
    setSearchParams({ [key]: value });
    onClose();
  };

  const clearFilters = () => {
    setSearchParams({});
    onClose();
  };

  const labelColor = useColorModeValue("gray.600", "text.muted");
  const hoverBg = useColorModeValue("light.panel", "brand.600");
  const activeBg = useColorModeValue("rgba(201,168,76,0.16)", "brand.700");
  const activeText = "brand.accent";

  return (
    <VStack align="stretch" spacing={0} px={4}>
      <Text
        fontSize="10px"
        fontFamily="heading"
        letterSpacing="0.15em"
        color={labelColor}
        textTransform="uppercase"
        mb={2}
      >
        Discover
      </Text>

      <Button
        justifyContent="flex-start"
        variant="ghost"
        size="sm"
        px={3}
        mb={2}
        color={hasActiveFilters ? "brand.accent" : "text.secondary"}
        _hover={{ bg: hoverBg }}
        onClick={clearFilters}
      >
        All Games
      </Button>

      <VStack align="stretch" spacing={1} mb={5}>
        {TOP_SECTIONS.map(({ label, icon: Icon, filter, color }, index) => {
          const isActive = activeSection === filter;

          return (
            <MotionBox
              key={filter}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, duration: 0.25 }}
            >
              <HStack
                px={3}
                py={2}
                borderRadius="md"
                cursor="pointer"
                bg={isActive ? activeBg : "transparent"}
                borderLeft="2px solid"
                borderColor={isActive ? "brand.accent" : "transparent"}
                _hover={{ bg: hoverBg, borderColor: "brand.accentDim" }}
                transition="all 0.18s ease"
                onClick={() => setFilter("filter", filter)}
                role="button"
              >
                <Box as={Icon} fontSize="15px" color={isActive ? "brand.accent" : color} />
                <Text
                  fontFamily="body"
                  fontWeight={isActive ? "600" : "400"}
                  fontSize="sm"
                  color={isActive ? activeText : "text.secondary"}
                  letterSpacing="0.02em"
                >
                  {label}
                </Text>
              </HStack>
            </MotionBox>
          );
        })}
      </VStack>

      <Divider borderColor={useColorModeValue("light.border", "brand.500")} mb={4} />

      <HStack justify="space-between" mb={2}>
        <Text
          fontSize="10px"
          fontFamily="heading"
          letterSpacing="0.15em"
          color={labelColor}
          textTransform="uppercase"
        >
          Genres
        </Text>
        {genres.length > 0 && (
          <Badge
            fontSize="9px"
            fontFamily="heading"
            bg="brand.600"
            color="text.muted"
            borderRadius="sm"
            px={1.5}
          >
            {genres.length}
          </Badge>
        )}
      </HStack>

      <VStack align="stretch" spacing={1}>
        {isLoading
          ? Array.from({ length: 8 }).map((_, index) => (
              <Skeleton
                key={index}
                h="34px"
                borderRadius="md"
                startColor="brand.700"
                endColor="brand.600"
              />
            ))
          : genres.map(({ id, name, slug }, index) => {
              const isActive = activeGenre === slug;
              const dot = genreColor(slug);

              return (
                <MotionBox
                  key={id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03, duration: 0.22 }}
                >
                  <HStack
                    px={3}
                    py={2}
                    borderRadius="md"
                    cursor="pointer"
                    bg={isActive ? activeBg : "transparent"}
                    borderLeft="2px solid"
                    borderColor={isActive ? "brand.accent" : "transparent"}
                    _hover={{ bg: hoverBg, borderColor: "brand.accentDim" }}
                    transition="all 0.18s ease"
                    onClick={() => setFilter("genre", slug)}
                    role="button"
                  >
                    <Box
                      w="7px"
                      h="7px"
                      borderRadius="full"
                      bg={dot}
                      flexShrink={0}
                      boxShadow={isActive ? `0 0 6px ${dot}` : "none"}
                      transition="box-shadow 0.2s"
                    />
                    <Text
                      fontFamily="body"
                      fontWeight={isActive ? "600" : "400"}
                      fontSize="sm"
                      color={isActive ? activeText : "text.secondary"}
                      letterSpacing="0.02em"
                      noOfLines={1}
                    >
                      {name}
                    </Text>
                  </HStack>
                </MotionBox>
              );
            })}
      </VStack>

      <Box mt={8} px={3}>
        <HStack spacing={2} opacity={0.35}>
          <Box as={GiConsoleController} fontSize="14px" color="brand.accent" />
          <Text fontSize="10px" fontFamily="heading" letterSpacing="0.1em" color="text.muted">
            GAMEHUB v1.0
          </Text>
        </HStack>
      </Box>
    </VStack>
  );
};

export default Sidebar;
