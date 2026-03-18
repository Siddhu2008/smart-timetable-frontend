import React, { createContext, useContext, useMemo, useState } from "react";
import { createTheme } from "@mui/material/styles";

const ColorModeContext = createContext({
  mode: "light",
  toggleColorMode: () => {}
});

export const ColorModeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    const stored = localStorage.getItem("color-mode");
    return stored === "dark" || stored === "light" ? stored : "light";
  });

  const toggleColorMode = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  React.useEffect(() => {
    localStorage.setItem("color-mode", mode);
  }, [mode]);

  const value = useMemo(() => ({ mode, toggleColorMode }), [mode]);
  return <ColorModeContext.Provider value={value}>{children}</ColorModeContext.Provider>;
};

export const useColorMode = () => useContext(ColorModeContext);

export const useColorModeTheme = () => {
  const { mode } = useColorMode();
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: "#0f2d3a" },
          secondary: { main: "#e2a03f" },
          info: { main: "#2e7bcf" },
          success: { main: "#1c7c54" },
          background: {
            default: mode === "light" ? "#f3f5fb" : "#0b1220",
            paper: mode === "light" ? "#ffffff" : "#0f172a"
          }
        },
        typography: {
          fontFamily: "'Manrope', 'Segoe UI', sans-serif",
          h1: { fontFamily: "'Sora', 'Manrope', sans-serif", fontWeight: 700, letterSpacing: -1 },
          h2: { fontFamily: "'Sora', 'Manrope', sans-serif", fontWeight: 700, letterSpacing: -0.8 },
          h3: { fontFamily: "'Sora', 'Manrope', sans-serif", fontWeight: 700, letterSpacing: -0.6 },
          h4: { fontFamily: "'Sora', 'Manrope', sans-serif", fontWeight: 700, letterSpacing: -0.4 },
          h5: { fontFamily: "'Sora', 'Manrope', sans-serif", fontWeight: 700 },
          h6: { fontFamily: "'Sora', 'Manrope', sans-serif", fontWeight: 700 }
        },
        shape: { borderRadius: 16 },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                "--app-bg":
                  mode === "light"
                    ? "radial-gradient(900px 500px at 10% 10%, rgba(158, 208, 255, 0.35), transparent 60%), radial-gradient(800px 500px at 85% -10%, rgba(255, 207, 137, 0.4), transparent 60%), linear-gradient(180deg, #f5f7fd 0%, #eef2f8 100%)"
                    : "radial-gradient(900px 500px at 15% 10%, rgba(35, 64, 93, 0.6), transparent 60%), radial-gradient(800px 500px at 85% 0%, rgba(49, 78, 96, 0.5), transparent 60%), linear-gradient(180deg, #0b1220 0%, #0f172a 100%)",
                "--app-text": mode === "light" ? "#0b1f2a" : "#e2e8f0"
              }
            }
          },
          MuiAppBar: {
            styleOverrides: {
              root: {
                backgroundImage: "linear-gradient(120deg, #0f2d3a 0%, #1b4d63 55%, #2a6d7c 100%)",
                boxShadow: "0 12px 35px rgba(15, 23, 42, 0.25)"
              }
            }
          },
          MuiDrawer: {
            styleOverrides: {
              paper: {
                borderRight: "1px solid rgba(15, 23, 42, 0.08)",
                backgroundImage:
                  mode === "light"
                    ? "linear-gradient(160deg, rgba(255,255,255,0.98) 0%, rgba(246,249,255,0.95) 50%, rgba(255,255,255,0.9) 100%)"
                    : "linear-gradient(160deg, rgba(15,23,42,0.98) 0%, rgba(12,19,33,0.96) 50%, rgba(9,14,25,0.94) 100%)"
              }
            }
          },
          MuiCard: {
            styleOverrides: {
              root: {
                border: mode === "light" ? "1px solid rgba(15, 23, 42, 0.08)" : "1px solid rgba(148, 163, 184, 0.2)",
                boxShadow:
                  mode === "light"
                    ? "0 18px 40px rgba(15, 23, 42, 0.08)"
                    : "0 20px 45px rgba(2, 6, 23, 0.55)",
                backgroundImage:
                  mode === "light"
                    ? "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(249,250,255,0.95) 100%)"
                    : "linear-gradient(180deg, rgba(15,23,42,0.95) 0%, rgba(13,19,33,0.95) 100%)"
              }
            }
          },
          MuiListItemButton: {
            styleOverrides: {
              root: {
                "&.Mui-selected": {
                  background:
                    mode === "light"
                      ? "linear-gradient(135deg, rgba(15,45,58,0.15) 0%, rgba(46,123,207,0.12) 100%)"
                      : "linear-gradient(135deg, rgba(46,123,207,0.2) 0%, rgba(226,160,63,0.12) 100%)"
                }
              }
            }
          },
          MuiChip: {
            styleOverrides: {
              root: {
                "&.MuiChip-colorSuccess": {
                  color: mode === "light" ? "#0f5132" : "#d1fae5"
                }
              }
            }
          },
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 12,
                textTransform: "none",
                fontWeight: 600
              }
            }
          },
          MuiButtonBase: {
            styleOverrides: {
              root: {
                "&.MuiButton-outlined": {
                  borderColor: mode === "light" ? "rgba(15, 23, 42, 0.28)" : "rgba(226, 232, 240, 0.45)",
                  color: mode === "light" ? "#0f2d3a" : "#e2e8f0",
                  backgroundColor: mode === "light" ? "transparent" : "rgba(15, 23, 42, 0.35)"
                }
              }
            }
          },
          MuiTableCell: {
            styleOverrides: {
              head: {
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: 0.6,
                fontSize: 12,
                backgroundColor: "rgba(15, 23, 42, 0.04)"
              }
            }
          },
          MuiTextField: {
            defaultProps: {
              variant: "outlined",
              size: "small"
            }
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: "none"
              }
            }
          }
        }
      }),
    [mode]
  );

  return { theme };
};
