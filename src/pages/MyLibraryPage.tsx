import {
  Box, HStack, VStack, Text, Image, Badge, Button,
  Tabs, TabList, Tab, TabPanels, TabPanel, IconButton,
  Menu, MenuButton, MenuList, MenuItem, useColorModeValue,
  Wrap, WrapItem, Tooltip, Divider, useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  IoBookmark, IoTrash, IoEllipsisVertical,
  IoGameController, IoStar, IoTime, IoArrowForward,
} from "react-icons/io5";
import { GiBookshelf, GiTrophy, GiSandsOfTime, GiOpenBook } from "react-icons/gi";
import { MdOutlineMoveDown } from "react-icons/md";
import { useLibraryStore } from "../store/useLibraryStore";
import type { LibrarySection } from "../store/useLibraryStore";
import type { Game } from "../types/game";
import { getRatingColor, getPlatformIcon } from "../utils/platformIcons";
import { getGenreFallbackImage } from "../utils/gameFallbackImage";
import { mockGames } from "../mocks/mockGames";

const MotionBox = motion(Box);

// ── Tab config ────────────────────────────────────────
const TABS: {
  key:   LibrarySection;
  label: string;
  icon:  React.ElementType;
  color: string;
  empty: string;
}[] = [
  {
    key:   "wishlist",
    label: "Wishlist",
    icon:  IoBookmark,
    color: "#c9a84c",
    empty: "No games in your wishlist yet.",
  },
  {
    key:   "collection",
    label: "Collection",
    icon:  GiTrophy,
    color: "#4caf50",
    empty: "Your collection is empty.",
  },
  {
    key:   "backlog",
    label: "Backlog",
    icon:  GiSandsOfTime,
    color: "#ab47bc",
    empty: "Your backlog is clear!",
  },
  {
    key:   "history",
    label: "Play History",
    icon:  GiOpenBook,
    color: "#42a5f5",
    empty: "No play history yet.",
  },
];

// ── Move-to options per section ───────────────────────
const MOVE_OPTIONS: Record<LibrarySection, LibrarySection[]> = {
  wishlist:   ["collection", "backlog", "history"],
  collection: ["wishlist",   "backlog", "history"],
  backlog:    ["wishlist",   "collection", "history"],
  history:    ["wishlist",   "collection", "backlog"],
};

// ── Single game row card ──────────────────────────────
interface GameRowProps {
  game:    Game;
  section: LibrarySection;
}

const GameRow = ({ game, section }: GameRowProps) => {
  const navigate  = useNavigate();
  const toast     = useToast();
  const { removeFromSection, moveGame } = useLibraryStore();
  const [imgFailed, setImgFailed] = useState(false);

  const cardBg      = useColorModeValue("light.surface", "brand.800");
  const borderColor = useColorModeValue("light.border", "brand.500");
  const mutedColor  = useColorModeValue("gray.600", "text.muted");
  const ratingColor = getRatingColor(game.rating);
  const previewImage = !imgFailed && game.background_image
    ? game.background_image
    : getGenreFallbackImage(game.name, game.genres);

  const handleRemove = () => {
    removeFromSection(section, game.id);
    toast({
      title: "Removed",
      description: `${game.name} removed from ${section}`,
      status: "info",
      duration: 2000,
      isClosable: true,
      position: "bottom-right",
    });
  };

  const handleMove = (to: LibrarySection) => {
    moveGame(section, to, game.id);
    toast({
      title: "Moved",
      description: `${game.name} moved to ${to}`,
      status: "success",
      duration: 2000,
      isClosable: true,
      position: "bottom-right",
    });
  };

  return (
    <MotionBox
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x:   0  }}
      exit={{    opacity: 0, x: -16  }}
      transition={{ duration: 0.22 }}
      layout
    >
      <Box
        bg={cardBg}
        border="1px solid"
        borderColor={borderColor}
        borderRadius="xl"
        overflow="hidden"
        _hover={{ borderColor: "brand.accent" }}
        transition="border-color 0.2s"
      >
        <HStack spacing={0} align="stretch">

          {/* Cover thumbnail */}
          <Box
            w={{ base: "80px", md: "110px" }}
            flexShrink={0}
            bg="brand.900"
            cursor="pointer"
            onClick={() => navigate(`/games/${game.id}`)}
            overflow="hidden"
          >
            {game.background_image ? (
              <Image
                src={previewImage}
                alt={game.name}
                w="100%"
                h="100%"
                objectFit="cover"
                onError={() => setImgFailed(true)}
                transition="transform 0.3s"
                _hover={{ transform: "scale(1.06)" }}
              />
            ) : (
              <Image
                src={previewImage}
                alt={game.name}
                w="100%"
                h="100%"
                objectFit="cover"
              />
            )}
          </Box>

          {/* Info */}
          <Box flex={1} px={{ base: 3, md: 4 }} py={3} minW={0}>
            <HStack justify="space-between" align="flex-start">
              <VStack align="start" spacing={1} flex={1} minW={0}>

                {/* Title */}
                <Text
                  fontFamily="heading"
                  fontWeight="600"
                  fontSize={{ base: "sm", md: "md" }}
                  letterSpacing="0.04em"
                  color="text.primary"
                  noOfLines={1}
                  cursor="pointer"
                  _hover={{ color: "brand.accent" }}
                  transition="color 0.2s"
                  onClick={() => navigate(`/games/${game.id}`)}
                >
                  {game.name}
                </Text>

                {/* Genre tags */}
                <Wrap spacing={1}>
                  {game.genres.slice(0, 3).map((g) => (
                    <WrapItem key={g.id}>
                      <Badge
                        fontSize="9px"
                        fontFamily="heading"
                        letterSpacing="0.08em"
                        px={1.5}
                        py={0.5}
                        borderRadius="sm"
                        bg="brand.700"
                        color="text.muted"
                      >
                        {g.name}
                      </Badge>
                    </WrapItem>
                  ))}
                </Wrap>

                {/* Meta row */}
                <HStack spacing={3} pt={1} flexWrap="wrap">
                  {/* Rating */}
                  <HStack spacing={1}>
                    <Box as={IoStar} fontSize="11px" color={ratingColor} />
                    <Text fontSize="xs" fontFamily="body"
                      fontWeight="600" color={ratingColor}>
                      {game.rating > 0 ? game.rating.toFixed(1) : "—"}
                    </Text>
                  </HStack>

                  {/* Playtime */}
                  {game.playtime > 0 && (
                    <HStack spacing={1}>
                      <Box as={IoTime} fontSize="11px" color={mutedColor} />
                      <Text fontSize="xs" color={mutedColor} fontFamily="body">
                        {game.playtime}h
                      </Text>
                    </HStack>
                  )}

                  {/* Metacritic */}
                  {game.metacritic && (
                    <Badge
                      fontSize="9px"
                      fontFamily="heading"
                      px={1.5}
                      borderRadius="sm"
                      bg="transparent"
                      border="1px solid"
                      borderColor="brand.accentDim"
                      color="brand.accent"
                    >
                      MC {game.metacritic}
                    </Badge>
                  )}

                  {/* Platforms */}
                  <HStack spacing={1.5}>
                    {game.parent_platforms?.slice(0, 3).map(({ platform }) => (
                      <Tooltip key={platform.id} label={platform.name}
                        fontSize="xs" hasArrow bg="brand.700">
                        <Box fontSize="11px" color={mutedColor}>
                          {getPlatformIcon(platform.slug)}
                        </Box>
                      </Tooltip>
                    ))}
                  </HStack>
                </HStack>
              </VStack>

              {/* Actions */}
              <HStack spacing={1} flexShrink={0} ml={2}>
                <Tooltip label="View game" fontSize="xs" hasArrow>
                  <IconButton
                    aria-label="View game"
                    icon={<IoArrowForward />}
                    size="xs"
                    variant="ghost"
                    color={mutedColor}
                    _hover={{ color: "brand.accent" }}
                    onClick={() => navigate(`/games/${game.id}`)}
                  />
                </Tooltip>

                {/* Move / Remove menu */}
                <Menu placement="bottom-end">
                  <MenuButton
                    as={IconButton}
                    aria-label="Options"
                    icon={<IoEllipsisVertical />}
                    size="xs"
                    variant="ghost"
                    color={mutedColor}
                    _hover={{ color: "brand.accent" }}
                  />
                  <MenuList
                    bg="brand.700"
                    border="1px solid"
                    borderColor="brand.500"
                    minW="160px"
                    py={1}
                  >
                    {MOVE_OPTIONS[section].map((target) => {
                      const tab = TABS.find((t) => t.key === target)!;
                      return (
                        <MenuItem
                          key={target}
                          bg="transparent"
                          fontFamily="body"
                          fontSize="sm"
                          color="text.secondary"
                          icon={<MdOutlineMoveDown />}
                          _hover={{ bg: "brand.600", color: "brand.accent" }}
                          onClick={() => handleMove(target)}
                        >
                          Move to {tab.label}
                        </MenuItem>
                      );
                    })}
                    <Divider borderColor="brand.500" my={1} />
                    <MenuItem
                      bg="transparent"
                      fontFamily="body"
                      fontSize="sm"
                      color="red.400"
                      icon={<IoTrash />}
                      _hover={{ bg: "brand.600" }}
                      onClick={handleRemove}
                    >
                      Remove
                    </MenuItem>
                  </MenuList>
                </Menu>
              </HStack>
            </HStack>
          </Box>
        </HStack>
      </Box>
    </MotionBox>
  );
};

// ── Empty state ───────────────────────────────────────
const EmptyState = ({
  message, section,
}: {
  message: string;
  section: LibrarySection;
}) => {
  const { addToSection } = useLibraryStore();
  const toast = useToast();

  const addSample = () => {
    const sample = mockGames.slice(0, 3);
    sample.forEach((g) => addToSection(section, g));
    toast({
      title: "Sample games added!",
      status: "success",
      duration: 2000,
      position: "bottom-right",
    });
  };

  return (
    <VStack py={16} spacing={4} opacity={0.6}>
      <Box as={IoGameController} fontSize="48px" color="brand.accent" />
      <Text fontFamily="heading" fontSize="sm"
        letterSpacing="0.1em" color="text.muted">
        {message.toUpperCase()}
      </Text>
      <Button
        size="sm"
        variant="outline"
        borderColor="brand.accent"
        color="brand.accent"
        fontFamily="heading"
        fontSize="xs"
        letterSpacing="0.08em"
        _hover={{ bg: "brand.accent", color: "brand.900" }}
        onClick={addSample}
      >
        ADD SAMPLE GAMES
      </Button>
    </VStack>
  );
};

// ── Main page ─────────────────────────────────────────
const MyLibraryPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const store   = useLibraryStore();
  const toast   = useToast();
  const borderC = useColorModeValue("light.border", "brand.500");

  const currentSection = TABS[activeTab].key;

  const handleClear = () => {
    store.clearSection(currentSection);
    toast({
      title: `${TABS[activeTab].label} cleared`,
      status: "info",
      duration: 2000,
      position: "bottom-right",
    });
  };

  // Total across all sections
  const totalGames = TABS.reduce((sum, t) => sum + store[t.key].length, 0);

  return (
    <MotionBox
      maxW="900px"
      mx="auto"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0  }}
      transition={{ duration: 0.3 }}
    >
      {/* ── Page header ── */}
      <HStack justify="space-between" align="flex-end" mb={6} flexWrap="wrap" gap={3}>
        <VStack align="start" spacing={0.5}>
          <HStack spacing={2}>
            <Box as={GiBookshelf} fontSize="22px" color="brand.accent" />
            <Text
              fontFamily="heading"
              fontWeight="700"
              fontSize={{ base: "xl", md: "2xl" }}
              letterSpacing="0.08em"
              textTransform="uppercase"
              color="text.primary"
            >
              My Library
            </Text>
          </HStack>
          <Text fontSize="xs" color="text.muted" fontFamily="body" pl={8}>
            {totalGames} game{totalGames !== 1 ? "s" : ""} across all sections
          </Text>
        </VStack>

        {/* Stats pills */}
        <HStack spacing={2} flexWrap="wrap">
          {TABS.map((t) => (
            <HStack
              key={t.key}
              spacing={1.5}
              px={2.5}
              py={1}
              borderRadius="full"
              bg="brand.700"
              border="1px solid"
              borderColor={borderC}
              cursor="pointer"
              onClick={() => setActiveTab(TABS.findIndex((x) => x.key === t.key))}
              _hover={{ borderColor: t.color }}
              transition="border-color 0.2s"
            >
              <Box as={t.icon} fontSize="11px" color={t.color} />
              <Text fontFamily="heading" fontSize="10px"
                letterSpacing="0.08em" color="text.muted">
                {store[t.key].length}
              </Text>
            </HStack>
          ))}
        </HStack>
      </HStack>

      {/* ── Tabs ── */}
      <Tabs
        index={activeTab}
        onChange={setActiveTab}
        variant="unstyled"
        isLazy
      >
        <TabList
          bg="brand.800"
          borderRadius="xl"
          p={1}
          border="1px solid"
          borderColor={borderC}
          mb={5}
          gap={1}
        >
          {TABS.map((t) => {
            const isActive = TABS[activeTab].key === t.key;
            return (
              <Tab
                key={t.key}
                flex={1}
                borderRadius="lg"
                py={2}
                px={3}
                fontFamily="heading"
                fontSize={{ base: "10px", md: "11px" }}
                letterSpacing="0.08em"
                color={isActive ? "brand.900" : "text.muted"}
                bg={isActive ? t.color : "transparent"}
                _hover={{ color: isActive ? "brand.900" : t.color }}
                transition="all 0.2s"
              >
                <HStack spacing={1.5} justify="center">
                  <Box as={t.icon} fontSize="13px" />
                  <Text display={{ base: "none", sm: "block" }}>
                    {t.label}
                  </Text>
                  {store[t.key].length > 0 && (
                    <Badge
                      fontSize="9px"
                      bg={isActive ? "rgba(0,0,0,0.2)" : "brand.600"}
                      color={isActive ? "brand.900" : "text.muted"}
                      borderRadius="full"
                      px={1.5}
                      minW="18px"
                      textAlign="center"
                    >
                      {store[t.key].length}
                    </Badge>
                  )}
                </HStack>
              </Tab>
            );
          })}
        </TabList>

        <TabPanels>
          {TABS.map((t) => (
            <TabPanel key={t.key} p={0}>

              {/* Section toolbar */}
              {store[t.key].length > 0 && (
                <HStack justify="space-between" mb={4}>
                  <Text fontSize="xs" color="text.muted" fontFamily="body">
                    {store[t.key].length} game
                    {store[t.key].length !== 1 ? "s" : ""}
                  </Text>
                  <Button
                    size="xs"
                    variant="ghost"
                    leftIcon={<IoTrash />}
                    fontFamily="heading"
                    fontSize="9px"
                    letterSpacing="0.08em"
                    color="red.400"
                    _hover={{ bg: "brand.700" }}
                    onClick={handleClear}
                  >
                    CLEAR ALL
                  </Button>
                </HStack>
              )}

              {/* Game list */}
              <AnimatePresence mode="popLayout">
                {store[t.key].length === 0 ? (
                  <EmptyState message={t.empty} section={t.key} />
                ) : (
                  <VStack align="stretch" spacing={3}>
                    {store[t.key].map((game) => (
                      <GameRow key={game.id} game={game} section={t.key} />
                    ))}
                  </VStack>
                )}
              </AnimatePresence>

            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </MotionBox>
  );
};

export default MyLibraryPage;
