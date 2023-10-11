import { Box, LinearProgress, useTheme } from "@mui/material";
import FiltersTab from "../../components/FiltersTab";
import HexagonMap from "../../components/HexagonMap";

import { usePlatformContext } from "../../context/PlatformContext";
import { tokens } from "../../theme";

const Geography = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { loading, mapChartData } = usePlatformContext();
  return (
    <Box m="20px" pb="20px">
      <FiltersTab
        title="GEOGRAPHY"
        subtitle="Request Volume By Store Location"
        colors={colors}
        theme={theme}
      />
      {loading && (
        <Box mb={2}>
          <LinearProgress
            style={{ width: "100%", height: "4px" }}
            color="secondary"
          />
        </Box>
      )}
      <Box height="80vh">
        <HexagonMap data={mapChartData} waterColor={colors.primary[500]} />
      </Box>
    </Box>
  );
};

export default Geography;
