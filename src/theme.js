import { createContext, useState, useMemo, useCallback } from "react";
import { createTheme } from "@mui/material/styles";

// color design tokens export
export const tokens = (mode) => ({
  ...(mode === "dark"
    ? {
        grey: {
          100: "#e0e0e0",
          200: "#c2c2c2",
          300: "#a3a3a3",
          400: "#858585",
          500: "#666666",
          600: "#525252",
          700: "#3d3d3d",
          800: "#292929",
          900: "#141414",
        },
        primary: {
          100: "#d0d1d5",
          200: "#a1a4ab",
          300: "#727681",
          400: "#1F2A40",
          500: "#141b2d",
          600: "#101624",
          700: "#0c101b",
          800: "#080b12",
          900: "#040509",
        },
        greenAccent: {
          100: "#191825",
          200: "#865DFF",
          300: "#E384FF",
          400: "#FFA3FD",
          500: "#E384FF",
          600: "#865DFF",
          700: "#191825",
          800: "#191825",
          900: "#191825",
        },
        redAccent: {
          100: "#191825",
          200: "#191825",
          300: "#865DFF",
          400: "#E384FF",
          500: "#FFA3FD",
          600: "#E384FF",
          700: "#865DFF",
          800: "#191825",
          900: "#191825",
        },
        blueAccent: {
          100: "#FFA3FD",
          200: "#E384FF",
          300: "#865DFF",
          400: "#191825",
          500: "#191825",
          600: "#191825",
          700: "#865DFF",
          800: "#E384FF",
          900: "#FFA3FD",
        },
      }
    : {
        grey: {
          100: "#141414",
          200: "#292929",
          300: "#3d3d3d",
          400: "#525252",
          500: "#666666",
          600: "#858585",
          700: "#a3a3a3",
          800: "#c2c2c2",
          900: "#e0e0e0",
        },
        primary: {
          100: "#040509",
          200: "#080b12",
          300: "#0c101b",
          400: "#f2f0f0", // manually changed
          500: "#fcfcfc",
          600: "#1F2A40",
          700: "#727681",
          800: "#a1a4ab",
          900: "#d0d1d5",
        },
        greenAccent: {
          100: "#FAE5FF",
          200: "#F4C8FF",
          300: "#D9A7FF",
          400: "#C290FF",
          500: "#E384FF",
          600: "#C075FF",
          700: "#A566FF",
          800: "#8A58FF",
          900: "#6E49FF",
        },
        redAccent: {
          100: "#FFA3FD",
          200: "#E384FF",
          300: "#865DFF",
          400: "#191825",
          500: "#191825",
          600: "#191825",
          700: "#865DFF",
          800: "#E384FF",
          900: "#FFA3FD",
        },
        blueAccent: {
          100: "#F7F7F7", // Lightest grey, almost white
          200: "#EFEFEF",
          300: "#E7E7E7",
          400: "#DFDFDF",
          500: "#D7D7D7", // Mid-tone grey
          600: "#CFCFCF",
          700: "#C7C7C7",
          800: "#BFBFBF",
          900: "#B7B7B7", // Darker grey
        },
      }),
});

// mui theme settings
export const themeSettings = (mode) => {
  const colors = tokens(mode);
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            // palette values for dark mode
            primary: {
              main: colors.primary[500],
            },
            secondary: {
              main: colors.greenAccent[500],
            },
            neutral: {
              dark: colors.grey[700],
              main: colors.grey[500],
              light: colors.grey[100],
            },
            background: {
              default: colors.primary[500],
            },
          }
        : {
            // palette values for light mode
            primary: {
              main: colors.primary[100],
            },
            secondary: {
              main: colors.greenAccent[500],
            },
            neutral: {
              dark: colors.grey[700],
              main: colors.grey[500],
              light: colors.grey[100],
            },
            background: {
              default: "#fcfcfc",
            },
          }),
    },
    typography: {
      fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
      fontSize: 12,
      h1: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 40,
      },
      h2: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 32,
      },
      h3: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 24,
      },
      h4: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 20,
      },
      h5: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 16,
      },
      h6: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 14,
      },
    },
  };
};

export const ColorModeContext = createContext({
  toggleColorMode: () => {},
  mode: "dark",
});

export const useMode = () => {
  const [mode, setMode] = useState("dark");

  const toggleColorMode = useCallback(() => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  const colorMode = useMemo(
    () => ({
      toggleColorMode,
      mode,
    }),
    [toggleColorMode, mode]
  );

  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return [theme, colorMode];
};
