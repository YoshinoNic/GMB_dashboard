import { useState, useCallback } from "react";
import { Routes, Route } from "react-router-dom";

import { PlatformProvider } from "./context/PlatformContext";

import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Geography from "./scenes/geography";
import Metrics from "./scenes/metrics";
import Keywords from "./scenes/keywords";
import Overview from "./scenes/overview";
import Programmatic from "./scenes/programmatic";
import Search from "./scenes/search";
import Social from "./scenes/social";
import Accounts from "./scenes/accounts";

import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";

function MainContent({ open }) {
  const contentStyle = {
    flexGrow: 1,
    marginLeft: open ? "14rem" : "5rem",
    transition: "margin-left 0.4s ease-in-out",
  };

  return (
    <main style={contentStyle}>
      <Topbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/geography" element={<Geography />} />
        <Route path="/metrics" element={<Metrics />} />
        <Route path="/keywords" element={<Keywords />} />
        <Route path="/overview" element={<Overview />} />
        <Route path="/programmatic" element={<Programmatic />} />
        <Route path="/search" element={<Search />} />
        <Route path="/social" element={<Social />} />
        <Route path="/data-sources" element={<Accounts />} />
      </Routes>
    </main>
  );
}

function App() {
  const [theme, colorMode] = useMode();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleSidebarToggle = useCallback(() => {
    setSidebarOpen((prevOpen) => !prevOpen);
  }, []);

  return (
    <PlatformProvider>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div className="app">
            <Sidebar open={sidebarOpen} toggle={handleSidebarToggle} />
            <MainContent open={sidebarOpen} />
          </div>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </PlatformProvider>
  );
}

export default App;
