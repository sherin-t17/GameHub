import { Box, Flex, useDisclosure, IconButton, Drawer,
  DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerBody,
  useColorModeValue,
} from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { useRef } from "react";
import { RiMenuFoldLine } from "react-icons/ri";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const SIDEBAR_WIDTH = "240px";

const Layout = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef<HTMLButtonElement>(null);
  const bgPage = useColorModeValue("light.50", "brand.900");
  const bgSidebar = useColorModeValue("light.surface", "brand.800");

  return (
    <Box minH="100vh" bg={bgPage} position="relative" overflow="hidden">
      <Box
        position="absolute"
        top="-120px"
        right="-80px"
        w="360px"
        h="360px"
        borderRadius="full"
        bg="rgba(201,168,76,0.08)"
        filter="blur(20px)"
        pointerEvents="none"
      />
      <Box
        position="absolute"
        bottom="-120px"
        left="-120px"
        w="420px"
        h="420px"
        borderRadius="full"
        bg="rgba(58,134,255,0.08)"
        filter="blur(26px)"
        pointerEvents="none"
      />
      <Navbar />

      <Flex maxW="1600px" mx="auto" px={{ base: 0, md: 4 }}>

        {/* ── Desktop Sidebar (always visible ≥ md) ── */}
        <Box
          as="aside"
          w={SIDEBAR_WIDTH}
          flexShrink={0}
          display={{ base: "none", md: "block" }}
          position="sticky"
          top="60px"           // height of navbar
          h="calc(100vh - 60px)"
          overflowY="auto"
          bg={bgSidebar}
          borderRight="1px solid"
          borderColor={useColorModeValue("light.border", "brand.500")}
          py={6}
          sx={{
            "&::-webkit-scrollbar": { width: "4px" },
            "&::-webkit-scrollbar-thumb": { background: "brand.500", borderRadius: "full" },
          }}
        >
          <Sidebar onClose={onClose} />
        </Box>

        {/* ── Mobile Drawer ── */}
        <Drawer
          isOpen={isOpen}
          placement="left"
          onClose={onClose}
          finalFocusRef={btnRef}
        >
          <DrawerOverlay bg="rgba(9,9,15,0.8)" backdropFilter="blur(4px)" />
          <DrawerContent
            bg={bgSidebar}
            maxW="260px"
            borderRight="1px solid"
            borderColor="brand.500"
          >
            <DrawerCloseButton color="text.secondary" top={4} right={3} />
            <DrawerBody px={0} pt={10} pb={6}>
              <Sidebar onClose={onClose} />
            </DrawerBody>
          </DrawerContent>
        </Drawer>

        {/* ── Main Content ── */}
        <Box flex={1} minW={0} px={{ base: 4, md: 6 }} py={6} position="relative" zIndex={1}>

          {/* Mobile menu trigger */}
          <IconButton
            ref={btnRef}
            aria-label="Open menu"
            icon={<RiMenuFoldLine />}
            onClick={onOpen}
            display={{ base: "flex", md: "none" }}
            variant="ghost"
            color="text.secondary"
            _hover={{ color: "brand.accent" }}
            mb={4}
            size="sm"
          />

          <Outlet />
        </Box>
      </Flex>
    </Box>
  );
};

export default Layout;
