import {
  extendTheme,
  type ThemeConfig,
  type StyleFunctionProps,
} from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const colors = {
  brand: {
    900: "#09090f",
    800: "#0f1020",
    700: "#161830",
    600: "#1e2040",
    500: "#2a2d5a",
    accent: "#c9a84c",
    accentHover: "#e0c068",
    accentDim: "#8a6f2e",
  },
  light: {
    50: "#f1ede6",
    100: "#e7dfd2",
    200: "#d9cdb8",
    300: "#c6b291",
    400: "#a88d68",
    500: "#7b6348",
    surface: "rgba(248, 243, 235, 0.82)",
    panel: "rgba(237, 229, 216, 0.86)",
    border: "rgba(123, 99, 72, 0.20)",
  },
  text: {
    primary: "#f0eee8",
    secondary: "#a8a8b8",
    muted: "#5a5a72",
  },
};

const fonts = {
  heading: "'Orbitron', sans-serif",
  body: "'Rajdhani', sans-serif",
  mono: "'Rajdhani', monospace",
};

const styles = {
  global: (props: StyleFunctionProps) => ({
    html: {
      bg: props.colorMode === "dark" ? "#09090f" : "#f7f4ec",
    },
    body: {
      bg:
        props.colorMode === "dark"
          ? "radial-gradient(circle at top, rgba(58,134,255,0.12), transparent 28%), radial-gradient(circle at right top, rgba(201,168,76,0.12), transparent 24%), #09090f"
          : "radial-gradient(circle at top left, rgba(201,168,76,0.12), transparent 22%), radial-gradient(circle at top right, rgba(58,134,255,0.07), transparent 18%), linear-gradient(180deg, #f1ede6 0%, #e7dfd2 100%)",
      color: props.colorMode === "dark" ? "text.primary" : "gray.800",
      fontFamily: "body",
      backgroundAttachment: "fixed",
    },
    "::-webkit-scrollbar": {
      width: "6px",
    },
    "::-webkit-scrollbar-track": {
      bg: props.colorMode === "dark" ? "brand.900" : "light.100",
    },
    "::-webkit-scrollbar-thumb": {
      bg: props.colorMode === "dark" ? "brand.500" : "light.300",
      borderRadius: "full",
    },
    "::-webkit-scrollbar-thumb:hover": {
      bg: "brand.accent",
    },
  }),
};

const components = {
  Button: {
    baseStyle: {
      fontFamily: "heading",
      letterSpacing: "0.05em",
      borderRadius: "sm",
    },
    variants: {
      accent: {
        bg: "brand.accent",
        color: "brand.900",
        _hover: {
          bg: "brand.accentHover",
          transform: "translateY(-1px)",
          boxShadow: "0 4px 20px rgba(201, 168, 76, 0.35)",
        },
        _active: { transform: "translateY(0)" },
        transition: "all 0.2s ease",
      },
      ghost: {
        color: "text.secondary",
      },
    },
  },
  Card: {
    baseStyle: {
      container: {
        bg: "brand.800",
        borderRadius: "lg",
        borderWidth: "1px",
        borderColor: "brand.500",
        overflow: "hidden",
        transition: "all 0.25s ease",
        _hover: {
          borderColor: "brand.accent",
          transform: "translateY(-4px)",
          boxShadow: "0 8px 32px rgba(201, 168, 76, 0.15)",
        },
      },
    },
  },
  Badge: {
    variants: {
      accent: {
        bg: "brand.accentDim",
        color: "brand.accent",
        borderRadius: "sm",
        fontFamily: "heading",
        fontSize: "2xs",
        letterSpacing: "0.08em",
      },
    },
  },
  Heading: {
    baseStyle: {
      fontFamily: "heading",
      letterSpacing: "0.04em",
      color: "text.primary",
    },
  },
  Input: {
    variants: {
      filled: (props: StyleFunctionProps) => ({
        field: {
          bg: props.colorMode === "light" ? "light.surface" : "brand.700",
          border: "1px solid",
          borderColor: props.colorMode === "light" ? "light.border" : "brand.500",
          color: props.colorMode === "light" ? "gray.800" : "text.primary",
          _hover: {
            borderColor: "brand.accent",
            bg: props.colorMode === "light" ? "white" : "brand.600",
          },
          _focus: {
            borderColor: "brand.accent",
            boxShadow: "0 0 0 1px #c9a84c",
            bg: props.colorMode === "light" ? "white" : "brand.700",
          },
          _placeholder: {
            color: props.colorMode === "light" ? "gray.500" : "text.muted",
          },
        },
      }),
    },
    defaultProps: { variant: "filled" },
  },
  Select: {
    variants: {
      filled: (props: StyleFunctionProps) => ({
        field: {
          bg: props.colorMode === "light" ? "light.surface" : "brand.700",
          borderColor: props.colorMode === "light" ? "light.border" : "brand.500",
          color: props.colorMode === "light" ? "gray.800" : "text.primary",
          _hover: { borderColor: "brand.accent" },
          _focus: { borderColor: "brand.accent" },
        },
      }),
    },
    defaultProps: { variant: "filled" },
  },
};

const theme = extendTheme({
  config,
  colors,
  fonts,
  styles,
  components,
  radii: {
    sm: "4px",
    md: "8px",
    lg: "12px",
    xl: "16px",
  },
  shadows: {
    accent: "0 0 20px rgba(201, 168, 76, 0.25)",
    card: "0 4px 24px rgba(0, 0, 0, 0.5)",
  },
});

export default theme;
