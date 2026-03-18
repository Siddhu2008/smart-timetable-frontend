import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import App from "./App.jsx";
import { ColorModeProvider, useColorModeTheme } from "./theme.jsx";
import "./index.css";

const Root = () => {
  const { theme } = useColorModeTheme();
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ColorModeProvider>
      <Root />
    </ColorModeProvider>
  </React.StrictMode>
);
