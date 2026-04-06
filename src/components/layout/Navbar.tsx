import {
  Box,
  Flex,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Text,
  useColorMode,
  useColorModeValue,
  Button,
  Kbd,
} from "@chakra-ui/react";
import { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsSearch, BsX } from "react-icons/bs";
import { IoGameController } from "react-icons/io5";
import { MdOutlineWbSunny, MdNightlight } from "react-icons/md";
import { GiBookshelf } from "react-icons/gi";
import { motion, AnimatePresence } from "framer-motion";
import { useLibraryStore } from "../../store/useLibraryStore";

const MotionBox = motion(Box);

const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const navigate = useNavigate();
  const totalSaved = useLibraryStore(
    (store) =>
      store.wishlist.length +
      store.collection.length +
      store.backlog.length +
      store.history.length
  );

  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "/" && document.activeElement !== inputRef.current) {
        event.preventDefault();
        inputRef.current?.focus();
      }

      if (event.key === "Escape") {
        setQuery("");
        inputRef.current?.blur();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (query.trim()) {
      navigate(`/?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const navBg = useColorModeValue(
    "rgba(247,244,236,0.88)",
    scrolled ? "rgba(9,9,15,0.92)" : "rgba(9,9,15,0.75)"
  );

  return (
    <MotionBox
      as="nav"
      position="sticky"
      top={0}
      zIndex={100}
      bg={navBg}
      backdropFilter="blur(16px)"
      borderBottom="1px solid"
      borderColor={scrolled ? (isDark ? "brand.500" : "gray.200") : "transparent"}
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Flex
        maxW="1600px"
        mx="auto"
        px={{ base: 4, md: 8 }}
        py={3}
        align="center"
        gap={4}
      >
        <Link to="/">
          <HStack spacing={2} flexShrink={0} role="group">
            <Box
              as={IoGameController}
              fontSize="26px"
              color="brand.accent"
              transition="transform 0.3s ease"
              _groupHover={{ transform: "rotate(-15deg) scale(1.1)" }}
            />
            <Text
              fontFamily="heading"
              fontWeight="700"
              fontSize={{ base: "lg", md: "xl" }}
              letterSpacing="0.12em"
              bgGradient="linear(to-r, brand.accent, brand.accentHover)"
              bgClip="text"
              textTransform="uppercase"
            >
              GameHub
            </Text>
          </HStack>
        </Link>

        <Box as="form" onSubmit={handleSearch} flex={1} maxW="560px" mx="auto">
          <InputGroup size="md">
            <InputLeftElement pointerEvents="none" pl={1}>
              <Box
                as={BsSearch}
                color={isFocused ? "brand.accent" : "text.muted"}
                fontSize="15px"
                transition="color 0.2s"
              />
            </InputLeftElement>

            <Input
              ref={inputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Search games..."
              pl={9}
              pr={query ? 16 : 20}
              bg={isDark ? "brand.700" : "light.surface"}
              border="1px solid"
              borderColor={isFocused ? "brand.accent" : isDark ? "brand.500" : "light.border"}
              borderRadius="md"
              color={isDark ? "text.primary" : "gray.800"}
              fontFamily="body"
              fontSize="sm"
              letterSpacing="0.03em"
              _placeholder={{ color: "text.muted", fontFamily: "body" }}
              _hover={{ borderColor: isDark ? "brand.accentDim" : "light.400" }}
              _focus={{
                borderColor: "brand.accent",
                boxShadow: "0 0 0 1px #c9a84c, 0 0 16px rgba(201,168,76,0.15)",
                bg: isDark ? "brand.700" : "white",
              }}
              transition="all 0.2s ease"
            />

            <InputRightElement w="auto" pr={2}>
              <AnimatePresence mode="wait">
                {query ? (
                  <MotionBox
                    key="clear"
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                    transition={{ duration: 0.15 }}
                  >
                    <IconButton
                      aria-label="Clear search"
                      icon={<BsX />}
                      size="xs"
                      variant="ghost"
                      color="text.muted"
                      _hover={{ color: "brand.accent" }}
                      onClick={() => {
                        setQuery("");
                        inputRef.current?.focus();
                      }}
                    />
                  </MotionBox>
                ) : (
                  <MotionBox
                    key="hint"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Kbd
                      fontSize="10px"
                      bg={isDark ? "brand.600" : "gray.200"}
                      color="text.muted"
                      border="none"
                      borderRadius="sm"
                      px={1.5}
                      py={0.5}
                    >
                      /
                    </Kbd>
                  </MotionBox>
                )}
              </AnimatePresence>
            </InputRightElement>
          </InputGroup>
        </Box>

        <HStack spacing={2} flexShrink={0}>
          <Button
            as={Link}
            to="/library"
            leftIcon={<GiBookshelf />}
            variant="ghost"
            size="sm"
            fontFamily="heading"
            fontSize="xs"
            letterSpacing="0.08em"
            color="text.secondary"
            _hover={{
              color: "brand.accent",
              bg: isDark ? "brand.600" : "light.panel",
            }}
            display={{ base: "none", md: "flex" }}
          >
            My Library
            {totalSaved > 0 && (
              <Box
                as="span"
                ml={1}
                minW="20px"
                px={1.5}
                py={0.5}
                borderRadius="full"
                bg="brand.accent"
                color="brand.900"
                fontSize="10px"
                lineHeight="1"
              >
                {totalSaved}
              </Box>
            )}
          </Button>

          <Box position="relative" display={{ base: "flex", md: "none" }}>
            <IconButton
              as={Link}
              to="/library"
              aria-label="My Library"
              icon={<GiBookshelf />}
              variant="ghost"
              size="sm"
              color="text.secondary"
              _hover={{ color: "brand.accent" }}
            />
            {totalSaved > 0 && (
              <Box
                position="absolute"
                top="-4px"
                right="-4px"
                minW="18px"
                h="18px"
                px={1}
                borderRadius="full"
                bg="brand.accent"
                color="brand.900"
                fontFamily="heading"
                fontSize="10px"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                {totalSaved}
              </Box>
            )}
          </Box>

          <IconButton
            aria-label="Toggle color mode"
            icon={
              isDark ? (
                <MdOutlineWbSunny fontSize="17px" />
              ) : (
                <MdNightlight fontSize="17px" />
              )
            }
            onClick={toggleColorMode}
            variant="ghost"
            size="sm"
            color={isDark ? "brand.accent" : "gray.600"}
            _hover={{
              color: isDark ? "brand.accentHover" : "brand.accent",
              bg: isDark ? "brand.600" : "light.panel",
              transform: "rotate(20deg)",
            }}
            transition="all 0.25s ease"
          />
        </HStack>
      </Flex>
    </MotionBox>
  );
};

export default Navbar;
