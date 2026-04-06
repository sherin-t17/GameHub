import {
  Box,
  Text,
  HStack,
  VStack,
  Badge,
  Image,
  Skeleton,
  IconButton,
  useColorModeValue,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { IoBookmark, IoBookmarkOutline, IoStar, IoTime } from "react-icons/io5";
import type { Game } from "../../types/game";
import {
  getPlatformIcon,
  getRatingColor,
  getMetacriticColor,
} from "../../utils/platformIcons";
import { getGenreFallbackImage } from "../../utils/gameFallbackImage";
import { useLibraryStore } from "../../store/useLibraryStore";

const MotionBox = motion(Box);

interface Props {
  game: Game;
}

const GameCard = ({ game }: Props) => {
  const navigate = useNavigate();
  const toast = useToast();
  const toggleInWishlist = useLibraryStore((store) => store.toggleInSection);
  const isBookmarked = useLibraryStore((store) => store.isInSection("wishlist", game.id));
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const cardBg = useColorModeValue("light.surface", "brand.800");
  const borderCol = useColorModeValue("light.border", "brand.500");
  const mutedColor = useColorModeValue("gray.500", "text.muted");
  const ratingColor = getRatingColor(game.rating);

  const platforms = game.parent_platforms?.slice(0, 5) ?? [];
  const releaseYear = game.released
    ? new Date(game.released).getFullYear()
    : null;
  const fallbackImage = getGenreFallbackImage(game.name, game.genres);
  const previewImage = !imgFailed && game.background_image
    ? game.background_image
    : fallbackImage;
  const showPreviewSkeleton = Boolean(game.background_image) && !imgFailed && !imgLoaded;

  const handleBookmarkToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    toggleInWishlist("wishlist", game);
    toast({
      title: isBookmarked ? "Removed from wishlist" : "Added to wishlist",
      description: game.name,
      status: isBookmarked ? "info" : "success",
      duration: 1800,
      isClosable: true,
      position: "bottom-right",
    });
  };

  return (
    <MotionBox
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      cursor="pointer"
      onClick={() => navigate(`/games/${game.id}`)}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      role="group"
    >
      <Box
        bg={cardBg}
        borderRadius="xl"
        overflow="hidden"
        border="1px solid"
        borderColor={isHovered ? "brand.accent" : borderCol}
        boxShadow={
          isHovered
            ? "0 12px 40px rgba(201,168,76,0.18), 0 4px 16px rgba(0,0,0,0.4)"
            : "0 2px 12px rgba(0,0,0,0.3)"
        }
        transition="all 0.25s ease"
      >
        <Box position="relative" h="180px" overflow="hidden" bg="brand.900">
          {showPreviewSkeleton && (
            <Skeleton
              position="absolute"
              inset={0}
              startColor="brand.700"
              endColor="brand.600"
            />
          )}

          <Image
            src={previewImage}
            alt={game.name}
            w="100%"
            h="100%"
            objectFit="cover"
            onLoad={() => setImgLoaded(true)}
            onError={() => {
              setImgFailed(true);
              setImgLoaded(true);
            }}
            opacity={imgLoaded ? 1 : 0}
            transition="all 0.4s ease"
            transform={isHovered ? "scale(1.06)" : "scale(1)"}
          />

          <Box
            position="absolute"
            bottom={0}
            left={0}
            right={0}
            h="60px"
            bgGradient="linear(to-t, brand.900, transparent)"
          />

          <Tooltip
            label={isBookmarked ? "Remove bookmark" : "Save to wishlist"}
            fontSize="xs"
            hasArrow
            placement="left"
            bg="brand.700"
          >
            <IconButton
              aria-label={isBookmarked ? "Remove bookmark" : "Save to wishlist"}
              icon={isBookmarked ? <IoBookmark /> : <IoBookmarkOutline />}
              position="absolute"
              top={2}
              left={2}
              size="sm"
              borderRadius="full"
              bg="rgba(9,9,15,0.82)"
              color={isBookmarked ? "brand.accent" : "text.secondary"}
              border="1px solid"
              borderColor={isBookmarked ? "brand.accentDim" : "whiteAlpha.300"}
              _hover={{ color: "brand.accent", borderColor: "brand.accent" }}
              onClick={handleBookmarkToggle}
            />
          </Tooltip>

          {game.metacritic && (
            <Badge
              position="absolute"
              top={2}
              right={2}
              fontSize="11px"
              fontFamily="heading"
              fontWeight="700"
              px={2}
              py={0.5}
              borderRadius="sm"
              bg="brand.900"
              color={getMetacriticColor(game.metacritic)}
              border="1px solid"
              borderColor={getMetacriticColor(game.metacritic)}
              letterSpacing="0.05em"
            >
              {game.metacritic}
            </Badge>
          )}

          <AnimatePresence>
            {isHovered && game.genres?.length > 0 && (
              <MotionBox
                position="absolute"
                top={2}
                left={2}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18 }}
              >
                <HStack spacing={1} flexWrap="wrap">
                  {game.genres.slice(0, 2).map((genre) => (
                    <Badge
                      key={genre.id}
                      fontSize="9px"
                      fontFamily="heading"
                      letterSpacing="0.08em"
                      px={1.5}
                      py={0.5}
                      borderRadius="sm"
                      bg="rgba(9,9,15,0.85)"
                      color="text.secondary"
                      backdropFilter="blur(4px)"
                    >
                      {genre.name}
                    </Badge>
                  ))}
                </HStack>
              </MotionBox>
            )}
          </AnimatePresence>
        </Box>

        <VStack align="stretch" spacing={2.5} px={4} pt={3} pb={4}>
          <HStack spacing={2} minH="18px">
            {platforms.map(({ platform }) => (
              <Tooltip
                key={platform.id}
                label={platform.name}
                fontSize="xs"
                hasArrow
                placement="top"
                bg="brand.700"
                color="text.primary"
              >
                <Box
                  fontSize="13px"
                  color={isHovered ? "brand.accent" : mutedColor}
                  transition="color 0.2s"
                >
                  {getPlatformIcon(platform.slug)}
                </Box>
              </Tooltip>
            ))}
          </HStack>

          {isBookmarked && (
            <Badge
              alignSelf="flex-start"
              bg="brand.accentDim"
              color="brand.accent"
              fontFamily="heading"
              fontSize="9px"
              letterSpacing="0.08em"
              px={2}
              py={0.5}
              borderRadius="full"
            >
              WISHLIST
            </Badge>
          )}

          <Text
            fontFamily="heading"
            fontWeight="600"
            fontSize="sm"
            letterSpacing="0.04em"
            color={isHovered ? "brand.accent" : "text.primary"}
            transition="color 0.2s"
            noOfLines={2}
            lineHeight="1.4"
            minH="38px"
          >
            {game.name}
          </Text>

          <HStack justify="space-between" align="center">
            <HStack spacing={1}>
              <Box as={IoStar} fontSize="12px" color={ratingColor} />
              <Text
                fontSize="xs"
                fontFamily="body"
                fontWeight="600"
                color={ratingColor}
                letterSpacing="0.03em"
              >
                {game.rating > 0 ? game.rating.toFixed(1) : "-"}
              </Text>
              {game.ratings_count > 0 && (
                <Text fontSize="10px" color={mutedColor}>
                  ({game.ratings_count.toLocaleString()})
                </Text>
              )}
            </HStack>

            <HStack spacing={2}>
              {game.playtime > 0 && (
                <HStack spacing={0.5}>
                  <Box as={IoTime} fontSize="11px" color={mutedColor} />
                  <Text fontSize="10px" color={mutedColor} fontFamily="body">
                    {game.playtime}h
                  </Text>
                </HStack>
              )}

              {releaseYear && (
                <Text
                  fontSize="10px"
                  color={mutedColor}
                  fontFamily="heading"
                  letterSpacing="0.06em"
                >
                  {releaseYear}
                </Text>
              )}
            </HStack>
          </HStack>
        </VStack>
      </Box>
    </MotionBox>
  );
};

export default GameCard;
