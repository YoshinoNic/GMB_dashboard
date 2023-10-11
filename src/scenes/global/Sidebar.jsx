import React, { memo } from "react";
import PropTypes from "prop-types";
import { Link as RouterLink } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme, IconButton, Typography } from "@mui/material";

import TocIcon from "@mui/icons-material/Toc";
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
import BarChartIcon from "@mui/icons-material/BarChart";
import TroubleshootIcon from "@mui/icons-material/Troubleshoot";
import MapIcon from "@mui/icons-material/Map";
import SsidChartIcon from "@mui/icons-material/SsidChart";
import AdUnitsIcon from "@mui/icons-material/AdUnits";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import InstagramIcon from "@mui/icons-material/Instagram";
import AccountTreeIcon from "@mui/icons-material/AccountTree";

import styled from "styled-components";
import { tokens } from "../../theme";

// Constants
const COMMON_HOVER_BG = `rgba(255, 255, 255, 0.3)`;
const COMMON_BLUR = "blur(5.5px)";
const PROFILE_IMAGE_URL = "/assets/profile.png";

// Styled components
const SidebarContainer = styled(motion.div)`
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const SidebarStyled = styled(motion.div)`
  display: flex;
  width: 14rem;
  height: 90%;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;
  padding: 15px;
  margin: 10px;
  border-radius: 10px;
`;

const LinesIcon = styled(motion.div)`
  display: flex;
  align-self: flex-end;
  border-radius: 5px;
`;

const Profile = styled(motion.div)`
  display: flex;
  align-items: center;
  border-radius: 50%;
  margin-bottom: 1rem;

  > img {
    width: 100%;
    border-radius: 50%;
  }
`;

const Groups = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Group = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1,
  align-items: ${({ open }) => (open ? "flex-start" : "center")};
`;

const Item = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 6px 10px 6px 7px;
  border-radius: 5px;
`;

const StyledLink = styled(RouterLink)`
  text-decoration: none;
  color: inherit;
`;

const GROUPS = [
  {
    title: "Analytics",
    items: [
      { icon: <SpaceDashboardIcon />, name: "Dashboard", path: "/" },
      {
        icon: <MapIcon />,
        name: "Geography",
        path: "/geography",
      },
      {
        icon: <BarChartIcon />,
        name: "Metrics",
        path: "/metrics",
      },
      {
        icon: <TroubleshootIcon />,
        name: "Keywords",
        path: "/keywords",
      },
    ],
  },
  {
    title: "Advertising",
    items: [
      {
        icon: <SsidChartIcon />,
        name: "Overview",
        path: "/overview",
      },
      {
        icon: <AdUnitsIcon />,
        name: "Programmatic",
        path: "/programmatic",
      },
      {
        icon: <ManageSearchIcon />,
        name: "Search",
        path: "/search",
      },
      {
        icon: <InstagramIcon />,
        name: "Social",
        path: "/social",
      },
    ],
  },
  {
    title: "Settings",
    items: [
      {
        icon: <AccountTreeIcon />,
        name: "Data sources",
        path: "/data-sources",
      },
    ],
  },
];

const SUBHEADING_VARIANTS = {
  open: { opacity: 1 },
  closed: { opacity: 0, display: "none" },
};

const VARIANTS = {
  sideContainer: {
    open: {},
    closed: {},
  },
  sidebar: {
    open: { width: "14rem" },
    closed: { width: "5rem" },
  },
  profile: {
    open: { alignSelf: "center", width: "4rem" },
    closed: { alignSelf: "flex-start", marginTop: "2rem", width: "3rem" },
  },
};

const TRANSITION = { duration: 0.4, ease: "easeInOut" };

const MenuItem = memo(function MenuItem({ icon, name, path, open, colors }) {
  return (
    <StyledLink to={path}>
      <Item
        whileHover={{
          cursor: "pointer",
          backgroundColor: colors.greenAccent[100],
        }}
      >
        <IconButton
          color="secondary"
          aria-label={`Navigate to ${name}`}
          style={{ backgroundColor: "transparent" }}
          sx={{
            "&:hover": {
              backgroundColor: "transparent",
            },
          }}
        >
          {icon}
        </IconButton>

        <motion.span
          variants={SUBHEADING_VARIANTS}
          initial={open ? "open" : "closed"}
          animate={open ? "open" : "closed"}
        >
          {name}
        </motion.span>
      </Item>
    </StyledLink>
  );
});

function Sidebar({ open, toggle }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <SidebarContainer
      data-open={open}
      variants={VARIANTS.sideContainer}
      initial="closed"
      animate={open ? "open" : "closed"}
      transition={TRANSITION}
    >
      <SidebarStyled
        animate={open ? "open" : "closed"}
        variants={VARIANTS.sidebar}
        transition={TRANSITION}
      >
        <LinesIcon
          whileHover={{
            scale: 1.1,
            rotate: 180,
            backgroundColor: COMMON_HOVER_BG,
            backdropFilter: COMMON_BLUR,
            WebkitBackdropFilter: COMMON_BLUR,
          }}
          onClick={toggle}
          transition={TRANSITION}
          aria-label="Toggle Menu"
        >
          <TocIcon />
        </LinesIcon>
        <Profile
          layout
          animate={open ? "open" : "closed"}
          variants={VARIANTS.profile}
          transition={TRANSITION}
          whileHover={{
            backgroundColor: COMMON_HOVER_BG,
            backdropFilter: COMMON_BLUR,
            WebkitBackdropFilter: COMMON_BLUR,
            cursor: "pointer",
          }}
        >
          <img src={PROFILE_IMAGE_URL} alt="Profile" />
        </Profile>
        <Groups>
          {GROUPS.map((group) => (
            <Group key={group.title} open={open}>
              <motion.div
                animate={{ opacity: open ? 1 : 0 }}
                transition={TRANSITION}
              >
                <Typography variant="h6" color={colors.primary}>
                  {group.title}
                </Typography>
              </motion.div>

              {group.items.map((item) => (
                <MenuItem
                  key={item.name}
                  icon={item.icon}
                  name={item.name}
                  path={item.path}
                  open={open}
                  colors={colors}
                />
              ))}
            </Group>
          ))}
        </Groups>
      </SidebarStyled>
    </SidebarContainer>
  );
}

Sidebar.propTypes = {
  open: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
};

export default Sidebar;
