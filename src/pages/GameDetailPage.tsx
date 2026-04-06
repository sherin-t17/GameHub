import {
  Box, Grid, GridItem, HStack, VStack, Text, Badge,
  Button, Image, Skeleton, SkeletonText, Progress, Divider,
  Wrap, WrapItem, Tag, IconButton, useColorModeValue, Tooltip, useToast, SimpleGrid,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IoArrowBack, IoStar, IoTime, IoCalendar, IoGlobe,
  IoChevronBack, IoChevronForward, IoGameController, IoBookmark, IoBookmarkOutline,
} from "react-icons/io5";
import { GiTrophy } from "react-icons/gi";
import { useGameDetail } from "../hooks/useGameDetails";
import { getPlatformIcon, getRatingColor, getMetacriticColor } from "../utils/platformIcons";
import { getGenreFallbackImage } from "../utils/gameFallbackImage";
import { useLibraryStore } from "../store/useLibraryStore";
import type { LibrarySection } from "../store/useLibraryStore";

const MotionBox = motion(Box);
const MotionImage = motion(Image);

// ── Rating bar colors ──────────────────────────────────
const RATING_COLORS: Record<string, string> = {
  exceptional: "#4caf50",
  recommended: "#c9a84c",
  meh:         "#ff9800",
  skip:        "#ef5350",
};

const LIBRARY_ACTIONS: { section: LibrarySection; label: string }[] = [
  { section: "collection", label: "Add to Collection" },
  { section: "backlog", label: "Add to Backlog" },
  { section: "history", label: "Add to History" },
];

const GameDetailPage = () => {
  const { id }    = useParams<{ id: string }>();
  const navigate  = useNavigate();
  const toast = useToast();
  const { game, isLoading } = useGameDetail(Number(id));
  const toggleInSection = useLibraryStore((store) => store.toggleInSection);
  const getGameSections = useLibraryStore((store) => store.getGameSections);

  const [activeScreenshot, setActiveScreenshot] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [heroImageFailed, setHeroImageFailed] = useState(false);

  const cardBg      = useColorModeValue("light.surface", "brand.800");
  const borderColor = useColorModeValue("light.border", "brand.500");
  const mutedColor  = useColorModeValue("gray.600", "text.muted");
  const labelColor  = useColorModeValue("gray.500", "text.muted");

  const screenshots = game?.screenshots ?? [];
  const hasPrev     = activeScreenshot > 0;
  const hasNext     = activeScreenshot < screenshots.length - 1;

  // ── Loading skeleton ──────────────────────────────────
  if (isLoading) {
    return (
      <Box maxW="1100px" mx="auto">
        <Skeleton h={{ base: "260px", md: "420px" }} borderRadius="xl"
          startColor="brand.700" endColor="brand.600" mb={6} />
        <Grid templateColumns={{ base: "1fr", lg: "1fr 320px" }} gap={6}>
          <VStack align="stretch" spacing={4}>
            <Skeleton h="40px" w="60%" startColor="brand.700" endColor="brand.600" />
            <SkeletonText noOfLines={6} startColor="brand.700" endColor="brand.600" />
          </VStack>
          <VStack align="stretch" spacing={3}>
            {[1,2,3,4].map(i => (
              <Skeleton key={i} h="60px" borderRadius="md"
                startColor="brand.700" endColor="brand.600" />
            ))}
          </VStack>
        </Grid>
      </Box>
    );
  }

  if (!game) return null;

  const activeSections = getGameSections(game.id);
  const isWishlisted = activeSections.includes("wishlist");
  const ratingColor = getRatingColor(game.rating);
  const fallbackImage = getGenreFallbackImage(game.name, game.genres);
  const activeHeroImage = heroImageFailed
    ? fallbackImage
    : screenshots[activeScreenshot]?.image ?? game.background_image ?? fallbackImage;
  const descWords   = game.description_raw.split(" ");
  const isLong      = descWords.length > 60;
  const displayDesc = expanded || !isLong
    ? game.description_raw
    : descWords.slice(0, 60).join(" ") + "...";

  const handleSectionToggle = (section: LibrarySection) => {
    toggleInSection(section, game);
    const isActive = activeSections.includes(section);
    toast({
      title: isActive ? "Removed from library section" : "Added to library section",
      description: `${game.name} ${isActive ? "removed from" : "saved to"} ${section}`,
      status: isActive ? "info" : "success",
      duration: 2000,
      isClosable: true,
      position: "bottom-right",
    });
  };

  return (
    <MotionBox
      maxW="1100px"
      mx="auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {/* ── Back button ── */}
      <Button
        leftIcon={<IoArrowBack />}
        variant="ghost"
        size="sm"
        fontFamily="heading"
        fontSize="xs"
        letterSpacing="0.08em"
        color={mutedColor}
        _hover={{ color: "brand.accent" }}
        mb={5}
        px={{ base: 2, md: 3 }}
        onClick={() => navigate(-1)}
      >
        BACK
      </Button>

      {/* ── Hero image + screenshot gallery ── */}
      <Box
        position="relative"
        borderRadius="xl"
        overflow="hidden"
        mb={6}
        h={{ base: "220px", md: "380px", lg: "440px" }}
        bg="brand.900"
        border="1px solid"
        borderColor={borderColor}
      >
        <AnimatePresence mode="wait">
          <MotionImage
            key={activeHeroImage}
            src={activeHeroImage}
            alt={game.name}
            w="100%"
            h="100%"
            objectFit="cover"
            onError={() => setHeroImageFailed(true)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        </AnimatePresence>

        {/* Gradient overlay */}
        <Box
          position="absolute"
          inset={0}
          bgGradient="linear(to-t, brand.900 0%, transparent 50%)"
        />

        {/* Screenshot nav arrows */}
        {screenshots.length > 1 && (
          <>
            <IconButton
              aria-label="Previous screenshot"
              icon={<IoChevronBack />}
              position="absolute"
              left={{ base: 2, md: 3 }}
              top="50%"
              transform="translateY(-50%)"
              size={{ base: "xs", md: "sm" }}
              bg="rgba(9,9,15,0.7)"
              color="text.primary"
              border="1px solid"
              borderColor="brand.500"
              _hover={{ borderColor: "brand.accent", color: "brand.accent" }}
              isDisabled={!hasPrev}
              onClick={() => setActiveScreenshot((p) => p - 1)}
            />
            <IconButton
              aria-label="Next screenshot"
              icon={<IoChevronForward />}
              position="absolute"
              right={{ base: 2, md: 3 }}
              top="50%"
              transform="translateY(-50%)"
              size={{ base: "xs", md: "sm" }}
              bg="rgba(9,9,15,0.7)"
              color="text.primary"
              border="1px solid"
              borderColor="brand.500"
              _hover={{ borderColor: "brand.accent", color: "brand.accent" }}
              isDisabled={!hasNext}
              onClick={() => setActiveScreenshot((p) => p + 1)}
            />
          </>
        )}

        {/* Screenshot dots */}
        {screenshots.length > 1 && (
          <HStack
            position="absolute"
            bottom={3}
            left="50%"
            transform="translateX(-50%)"
            spacing={1.5}
          >
            {screenshots.map((_, i) => (
              <Box
                key={i}
                w={i === activeScreenshot ? "20px" : "6px"}
                h="6px"
                borderRadius="full"
                bg={i === activeScreenshot ? "brand.accent" : "whiteAlpha.500"}
                cursor="pointer"
                transition="all 0.2s"
                onClick={() => setActiveScreenshot(i)}
              />
            ))}
          </HStack>
        )}

        {/* Metacritic badge */}
        {game.metacritic && (
          <Badge
            position="absolute"
            top={4}
            right={4}
            fontSize="15px"
            fontFamily="heading"
            fontWeight="700"
            px={3}
            py={1}
            borderRadius="md"
            bg="rgba(9,9,15,0.85)"
            color={getMetacriticColor(game.metacritic)}
            border="2px solid"
            borderColor={getMetacriticColor(game.metacritic)}
            backdropFilter="blur(8px)"
          >
            {game.metacritic}
          </Badge>
        )}

        {/* Title overlay */}
        <Box position="absolute" bottom={0} left={0} right={0} p={{ base: 4, md: 6 }}>
          <Text
            fontFamily="heading"
            fontWeight="700"
            fontSize={{ base: "xl", md: "3xl", lg: "4xl" }}
            letterSpacing="0.06em"
            color="white"
            textShadow="0 2px 20px rgba(0,0,0,0.8)"
            noOfLines={2}
          >
            {game.name}
          </Text>
        </Box>
      </Box>

      {/* ── Thumbnail strip ── */}
      {screenshots.length > 1 && (
        <HStack spacing={2} mb={6} overflowX="auto" pb={1}
          sx={{ "&::-webkit-scrollbar": { display: "none" } }}>
          {screenshots.map((s, i) => (
            <Box
              key={s.id}
              flexShrink={0}
              w={{ base: "84px", md: "100px" }}
              h={{ base: "52px", md: "60px" }}
              borderRadius="md"
              overflow="hidden"
              cursor="pointer"
              border="2px solid"
              borderColor={i === activeScreenshot ? "brand.accent" : "transparent"}
              opacity={i === activeScreenshot ? 1 : 0.5}
              transition="all 0.2s"
              _hover={{ opacity: 1 }}
              onClick={() => setActiveScreenshot(i)}
            >
              <Image src={s.image} alt="" w="100%" h="100%" objectFit="cover" />
            </Box>
          ))}
        </HStack>
      )}

      {/* ── Main content grid ── */}
      <Grid
        templateColumns={{ base: "1fr", lg: "1fr 300px" }}
        gap={6}
        alignItems="start"
      >

        {/* ── Left: description + ratings ── */}
        <GridItem>
          <VStack align="stretch" spacing={6}>

            {/* Platform + genre tags */}
            <HStack spacing={{ base: 2, md: 3 }} flexWrap="wrap">
              {game.parent_platforms.map(({ platform }) => (
                <Tooltip key={platform.id} label={platform.name}
                  fontSize="xs" hasArrow bg="brand.700">
                  <Box fontSize="18px" color={mutedColor}
                    _hover={{ color: "brand.accent" }} transition="color 0.2s">
                    {getPlatformIcon(platform.slug)}
                  </Box>
                </Tooltip>
              ))}
              <Box w="1px" h="16px" bg={borderColor} />
              {game.genres.map((g) => (
                <Tag key={g.id} size="sm" bg="brand.700"
                  color="text.secondary" borderRadius="full"
                  fontFamily="body" fontSize="xs">
                  {g.name}
                </Tag>
              ))}
            </HStack>

            {/* About */}
            <Box>
              <Text fontFamily="heading" fontSize="sm" letterSpacing="0.12em"
                color={labelColor} textTransform="uppercase" mb={3}>
                About
              </Text>
              <Text fontFamily="body" fontSize="sm" lineHeight="1.8"
                color="text.secondary" letterSpacing="0.02em">
                {displayDesc}
              </Text>
              {isLong && (
                <Button
                  variant="ghost"
                  size="xs"
                  mt={2}
                  fontFamily="heading"
                  fontSize="10px"
                  letterSpacing="0.1em"
                  color="brand.accent"
                  _hover={{ color: "brand.accentHover", bg: "transparent" }}
                  onClick={() => setExpanded((e) => !e)}
                >
                  {expanded ? "SHOW LESS ▲" : "READ MORE ▼"}
                </Button>
              )}
            </Box>

            <Divider borderColor={borderColor} />

            {/* Ratings breakdown */}
            <Box>
              <HStack
                justify="space-between"
                align={{ base: "flex-start", md: "center" }}
                flexDir={{ base: "column", md: "row" }}
                gap={{ base: 2, md: 0 }}
                mb={4}
              >
                <Text fontFamily="heading" fontSize="sm" letterSpacing="0.12em"
                  color={labelColor} textTransform="uppercase">
                  Ratings
                </Text>
                <HStack spacing={1} flexWrap="wrap">
                  <Box as={IoStar} fontSize="14px" color={ratingColor} />
                  <Text fontFamily="heading" fontSize="md"
                    fontWeight="700" color={ratingColor}>
                    {game.rating.toFixed(1)}
                  </Text>
                  <Text fontSize="xs" color={mutedColor}>
                    / {game.rating_top} · {game.ratings_count.toLocaleString()} ratings
                  </Text>
                </HStack>
              </HStack>

              <VStack align="stretch" spacing={2.5}>
                {game.ratings.map((r) => (
                  <Box key={r.id}>
                    <HStack justify="space-between" mb={1}>
                      <Text fontFamily="body" fontSize="xs"
                        color="text.secondary" textTransform="capitalize">
                        {r.title}
                      </Text>
                      <Text fontFamily="heading" fontSize="10px"
                        color={RATING_COLORS[r.title.toLowerCase()] ?? "text.muted"}>
                        {r.percent}% · {r.count.toLocaleString()}
                      </Text>
                    </HStack>
                    <Progress
                      value={r.percent}
                      size="xs"
                      borderRadius="full"
                      bg="brand.600"
                      sx={{
                        "& > div": {
                          background: RATING_COLORS[r.title.toLowerCase()] ?? "#c9a84c",
                          borderRadius: "full",
                        },
                      }}
                    />
                  </Box>
                ))}
              </VStack>
            </Box>

          </VStack>
        </GridItem>

        {/* ── Right: info panel ── */}
        <GridItem>
          <VStack align="stretch" spacing={3}>

            <Box bg={cardBg} borderRadius="xl" border="1px solid" borderColor={borderColor} p={4}>
              <Text
                fontFamily="heading"
                fontSize="10px"
                letterSpacing="0.15em"
                color={labelColor}
                textTransform="uppercase"
                mb={3}
              >
                Library
              </Text>
              <VStack align="stretch" spacing={2}>
                <Button
                  leftIcon={isWishlisted ? <IoBookmark /> : <IoBookmarkOutline />}
                  variant={isWishlisted ? "solid" : "outline"}
                  bg={isWishlisted ? "brand.accent" : "transparent"}
                  color={isWishlisted ? "brand.900" : "brand.accent"}
                  borderColor="brand.accent"
                  fontFamily="heading"
                  fontSize="xs"
                  letterSpacing="0.08em"
                  w="full"
                  _hover={{
                    bg: isWishlisted ? "brand.accentHover" : "brand.700",
                  }}
                  onClick={() => handleSectionToggle("wishlist")}
                >
                  {isWishlisted ? "IN WISHLIST" : "SAVE TO WISHLIST"}
                </Button>

                <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={2}>
                  {LIBRARY_ACTIONS.map(({ section, label }) => {
                    const isActive = activeSections.includes(section);
                    return (
                      <Box key={section}>
                        <Button
                          size="sm"
                          variant="ghost"
                          bg={isActive ? "brand.600" : "transparent"}
                          color={isActive ? "brand.accent" : "text.secondary"}
                          border="1px solid"
                          borderColor={isActive ? "brand.accentDim" : "brand.500"}
                          fontFamily="heading"
                          fontSize="10px"
                          letterSpacing="0.08em"
                          w="full"
                          h="auto"
                          py={2.5}
                          whiteSpace="normal"
                          _hover={{ borderColor: "brand.accent", color: "brand.accent" }}
                          onClick={() => handleSectionToggle(section)}
                        >
                          {label}
                        </Button>
                      </Box>
                    );
                  })}
                </SimpleGrid>

                {activeSections.length > 0 && (
                  <Text fontSize="xs" color={mutedColor} fontFamily="body">
                    Saved in: {activeSections.join(", ")}
                  </Text>
                )}
              </VStack>
            </Box>

            {/* Stats card */}
            <Box bg={cardBg} borderRadius="xl" border="1px solid"
              borderColor={borderColor} p={4}>
              <VStack align="stretch" spacing={3} divider={<Divider borderColor={borderColor} />}>

                {/* Release date */}
                <HStack justify="space-between" align="flex-start" spacing={4}>
                  <HStack spacing={2}>
                    <Box as={IoCalendar} color={mutedColor} fontSize="14px" />
                    <Text fontFamily="body" fontSize="xs" color={mutedColor}>
                      Release Date
                    </Text>
                  </HStack>
                  <Text fontFamily="heading" fontSize="xs"
                    color="text.secondary" letterSpacing="0.06em" textAlign="right">
                    {game.released
                      ? new Date(game.released).toLocaleDateString("en-US", {
                          year: "numeric", month: "short", day: "numeric",
                        })
                      : "TBA"}
                  </Text>
                </HStack>

                {/* Playtime */}
                <HStack justify="space-between" align="flex-start" spacing={4}>
                  <HStack spacing={2}>
                    <Box as={IoTime} color={mutedColor} fontSize="14px" />
                    <Text fontFamily="body" fontSize="xs" color={mutedColor}>
                      Avg Playtime
                    </Text>
                  </HStack>
                  <Text fontFamily="heading" fontSize="xs"
                    color="text.secondary" letterSpacing="0.06em" textAlign="right">
                    {game.playtime > 0 ? `${game.playtime} hours` : "—"}
                  </Text>
                </HStack>

                {/* Metacritic */}
                {game.metacritic && (
                  <HStack justify="space-between" align="flex-start" spacing={4}>
                    <HStack spacing={2}>
                      <Box as={GiTrophy} color={mutedColor} fontSize="14px" />
                      <Text fontFamily="body" fontSize="xs" color={mutedColor}>
                        Metacritic
                      </Text>
                    </HStack>
                    <Badge
                      fontFamily="heading"
                      fontSize="xs"
                      px={2}
                      borderRadius="sm"
                      bg="transparent"
                      color={getMetacriticColor(game.metacritic)}
                      border="1px solid"
                      borderColor={getMetacriticColor(game.metacritic)}
                    >
                      {game.metacritic}
                    </Badge>
                  </HStack>
                )}

                {/* ESRB */}
                {game.esrb_rating && (
                  <HStack justify="space-between" align="flex-start" spacing={4}>
                    <HStack spacing={2}>
                      <Box as={IoGameController} color={mutedColor} fontSize="14px" />
                      <Text fontFamily="body" fontSize="xs" color={mutedColor}>
                        ESRB
                      </Text>
                    </HStack>
                    <Badge fontFamily="heading" fontSize="10px"
                      px={2} borderRadius="sm" bg="brand.600" color="text.secondary">
                      {game.esrb_rating.name}
                    </Badge>
                  </HStack>
                )}

              </VStack>
            </Box>

            {/* Developers */}
            <Box bg={cardBg} borderRadius="xl" border="1px solid"
              borderColor={borderColor} p={4}>
              <Text fontFamily="heading" fontSize="10px" letterSpacing="0.15em"
                color={labelColor} textTransform="uppercase" mb={3}>
                Developer
              </Text>
              <Wrap spacing={2}>
                {game.developers.map((d) => (
                  <WrapItem key={d.id}>
                    <Tag size="sm" bg="brand.700" color="text.secondary"
                      borderRadius="md" fontFamily="body">
                      {d.name}
                    </Tag>
                  </WrapItem>
                ))}
              </Wrap>
            </Box>

            {/* Publishers */}
            <Box bg={cardBg} borderRadius="xl" border="1px solid"
              borderColor={borderColor} p={4}>
              <Text fontFamily="heading" fontSize="10px" letterSpacing="0.15em"
                color={labelColor} textTransform="uppercase" mb={3}>
                Publisher
              </Text>
              <Wrap spacing={2}>
                {game.publishers.map((p) => (
                  <WrapItem key={p.id}>
                    <Tag size="sm" bg="brand.700" color="text.secondary"
                      borderRadius="md" fontFamily="body">
                      {p.name}
                    </Tag>
                  </WrapItem>
                ))}
              </Wrap>
            </Box>

            {/* Website */}
            {game.website && (
              <Button
                as="a"
                href={game.website}
                target="_blank"
                rel="noopener noreferrer"
                leftIcon={<IoGlobe />}
                variant="outline"
                size="sm"
                fontFamily="heading"
                fontSize="xs"
                letterSpacing="0.08em"
                borderColor="brand.accent"
                color="brand.accent"
                _hover={{
                  bg: "brand.accent",
                  color: "brand.900",
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 16px rgba(201,168,76,0.3)",
                }}
                transition="all 0.2s"
                w="full"
              >
                OFFICIAL WEBSITE
              </Button>
            )}

          </VStack>
        </GridItem>

      </Grid>
    </MotionBox>
  );
};

export default GameDetailPage;
