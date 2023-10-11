import React, { useEffect } from "react";
import {
  Box,
  Select,
  OutlinedInput,
  MenuItem,
  Chip,
  Typography,
  LinearProgress,
  useTheme,
} from "@mui/material";

import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import OpenInBrowserIcon from "@mui/icons-material/OpenInBrowser";

import FiltersTab from "../../components/FiltersTab";
import StatBox from "../../components/StatBox";
import LineChart from "../../components/LineChart";
import PieChart from "../../components/PieChart";
import StreamChart from "../../components/StreamChart";
import BarChart from "../../components/BarChart";
import HexagonMap from "../../components/HexagonMap";
import CampaignsGrid from "../../components/CampaignsGrid";

import { usePlatformContext } from "../../context/PlatformContext";
import { tokens } from "../../theme";

import { kpiChartAggregation } from "../../aggregators";

import { METRIC_DISPLAY_COLORS, METRIC_NAMES } from "../../constants";

// Constants
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MENU_PROPS = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
const previousMetrics = {
  BUSINESS_CONVERSATIONS: 6000,
  CALL_CLICKS: 6000,
  BUSINESS_DIRECTION_REQUESTS: 30000,
  WEBSITE_CLICKS: 25000,
};
const maxProgressMetrics = {
  BUSINESS_CONVERSATIONS: 6000,
  CALL_CLICKS: 6000,
  BUSINESS_DIRECTION_REQUESTS: 30000,
  WEBSITE_CLICKS: 25000,
};

// Helper Functions
const getMenuStyles = (name, selected, theme) => {
  const isSelected = selected.includes(name);
  return {
    fontWeight: isSelected
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
    backgroundColor: isSelected ? "#865DFF" : "transparent",
    color: isSelected ? "white" : "inherit",
  };
};

function getDynamicValues(
  metricId,
  marketingSource,
  stores,
  startDate,
  endDate,
  impactPerCampaign
) {
  const currentTotal = kpiChartAggregation({
    metricId,
    marketingSource,
    stores,
    startDate,
    endDate,
    impact: true,
    data: impactPerCampaign,
  });
  const previousTotal = previousMetrics[metricId] || 0;
  const maxProgress = maxProgressMetrics[metricId] || 1; // Avoid division by 0

  const increase = ((currentTotal - previousTotal) / previousTotal) * 100;
  const progress = currentTotal / maxProgress;

  return {
    title: currentTotal.toLocaleString(),
    increase: increase.toFixed(2) + "%",
    progress: progress.toFixed(2),
  };
}

function getStatBoxes(
  stores,
  marketingSource,
  startDate,
  endDate,
  impactPerCampaign
) {
  const boxes = [
    {
      ...getDynamicValues(
        "BUSINESS_CONVERSATIONS",
        marketingSource,
        stores,
        startDate,
        endDate,
        impactPerCampaign
      ),
      subtitle: "CONVERSATIONS",
      icon: EmailIcon,
    },
    {
      ...getDynamicValues(
        "CALL_CLICKS",
        marketingSource,
        stores,
        startDate,
        endDate,
        impactPerCampaign
      ),
      subtitle: "CALL CLICKS",
      icon: PointOfSaleIcon,
    },
    {
      ...getDynamicValues(
        "BUSINESS_DIRECTION_REQUESTS",
        marketingSource,
        stores,
        startDate,
        endDate,
        impactPerCampaign
      ),
      subtitle: "DIRECTION REQUESTS",
      icon: LocationOnIcon,
    },
    {
      ...getDynamicValues(
        "WEBSITE_CLICKS",
        marketingSource,
        stores,
        startDate,
        endDate,
        impactPerCampaign
      ),
      subtitle: "WEBSITE CLICKS",
      icon: OpenInBrowserIcon,
    },
  ];
  return boxes;
}

const getColorForId = (id) => {
  return METRIC_DISPLAY_COLORS[id] || null;
};

const toTitleCase = (str) => {
  return str.replace(/_/g, " ").replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

const sumYValues = (data) => {
  return data.reduce((totalSum, item) => {
    return totalSum + item.data.reduce((sum, entry) => sum + entry.y, 0);
  }, 0);
};

// Styles
const getStyles = (theme) => ({
  icon: {
    fontSize: "26px",
    color: theme.greenAccent[500],
  },
});

// Sub Components
const StatBoxWrapper = ({ box, colors }) => (
  <Box
    gridColumn="span 3"
    backgroundColor={colors.primary[400]}
    display="flex"
    alignItems="center"
    justifyContent="center"
  >
    <StatBox
      title={box.title}
      subtitle={box.subtitle}
      progress={box.progress}
      increase={box.increase}
      icon={React.cloneElement(<box.icon />, {
        sx: getStyles(colors).icon,
      })}
    />
  </Box>
);

const Overview = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const {
    loading,
    sources,
    marketingSource,
    setMarketingSource,
    stores,
    startDate,
    endDate,
    lineMetrics,
    setLineMetrics,
    impactLineGraphData,
    channelPieChartData,
    impactMapChartData,
    streamChartData,
    barChartData,
    campaignGridData,
    impactPerCampaign,
  } = usePlatformContext();

  const currentStatBoxes = getStatBoxes(
    stores,
    marketingSource,
    startDate,
    endDate,
    impactPerCampaign
  );

  const totalRequests = sumYValues(impactLineGraphData);

  const handleMetrics = (event) => {
    const { value } = event.target;
    if (value.length <= 2) {
      setLineMetrics([...value]);
    } else {
      alert("You can only visualize 2 metrics at once.");
    }
  };

  const handleSources = (event) => {
    const { value } = event.target;
    setMarketingSource(value);
  };

  useEffect(() => {
    setMarketingSource(sources);
    // eslint-disable-next-line
  }, []);

  return (
    <Box m="20px" pb="20px">
      <FiltersTab
        title="ADVERTISING"
        subtitle="Advertising Performance Data"
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
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {currentStatBoxes.map((box, index) => (
          <StatBoxWrapper key={index} box={box} colors={colors} />
        ))}

        {/* ROW 2 */}
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.grey[100]}
              >
                Attributed Requests
              </Typography>
              <Typography
                variant="h3"
                fontWeight="bold"
                color={colors.greenAccent[500]}
              >
                {totalRequests.toLocaleString()}
              </Typography>
            </Box>

            <Box display="flex" alignItems="center" height="50px">
              <Select
                labelId="marketing-sources-label"
                id="marketing-source-name"
                multiple
                value={marketingSource}
                onChange={handleSources}
                input={
                  <OutlinedInput
                    label="Sources"
                    id="select-multiple-chip"
                    sx={{
                      ".MuiOutlinedInput-notchedOutline": {
                        borderStyle: "none",
                      },
                    }}
                  />
                }
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((source) => (
                      <Chip key={source} label={source} />
                    ))}
                  </Box>
                )}
                MenuProps={MENU_PROPS}
              >
                {sources.map((name) => (
                  <MenuItem
                    key={name}
                    value={name}
                    style={getMenuStyles(name, marketingSource, theme)}
                  >
                    {name}
                  </MenuItem>
                ))}
              </Select>

              <Select
                labelId="multiple-metrics-label"
                id="multiple-metrics"
                multiple
                value={lineMetrics}
                onChange={handleMetrics}
                input={
                  <OutlinedInput id="select-multiple-metrics" label="Chip" />
                }
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((metric) => (
                      <Chip
                        key={metric}
                        label={toTitleCase(metric)}
                        style={{
                          backgroundColor: getColorForId(metric),
                          color: "white",
                        }}
                      />
                    ))}
                  </Box>
                )}
                sx={{
                  ".MuiOutlinedInput-notchedOutline": { borderStyle: "none" },
                }}
                MenuProps={MENU_PROPS}
              >
                {METRIC_NAMES.map((name) => (
                  <MenuItem
                    key={name}
                    value={name}
                    style={getMenuStyles(name, lineMetrics, theme)}
                  >
                    {toTitleCase(name)}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </Box>
          <Box height="250px" m="-20px 0 0 0">
            <LineChart data={impactLineGraphData} />
          </Box>
        </Box>

        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ mt: "30px", ml: "25px" }}
          >
            Channel Ad Spend
          </Typography>
          <StreamChart data={streamChartData} keys={marketingSource} />
        </Box>

        {/* ROW 3 */}
        <Box
          gridColumn="span 8"
          gridRow="span 4"
          backgroundColor={colors.primary[400]}
          position="relative"
        >
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 0.5,
              position: "absolute",
              top: 20,
              left: 20,
            }}
          >
            {lineMetrics.map((metric) => (
              <Chip
                key={metric}
                label={toTitleCase(metric)}
                style={{
                  zIndex: 1,
                  backgroundColor: getColorForId(metric),
                  color: "white",
                }}
              />
            ))}
          </Box>
          {impactMapChartData.length ? (
            <HexagonMap
              data={impactMapChartData}
              waterColor={colors.primary[400]}
            />
          ) : null}
        </Box>

        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="30px"
        >
          <Typography variant="h5" fontWeight="600">
            Channel Distribution
          </Typography>
          <PieChart data={channelPieChartData} />
        </Box>

        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          position="relative"
          // p="30px"
        >
          <Box mt="25px" p="0 30px">
            <Typography variant="h5" fontWeight="600">
              Requests Per Channel
            </Typography>
          </Box>

          <BarChart data={barChartData} />
        </Box>

        {/* ROW 4 */}
        <Box
          gridColumn="1 / -1"
          gridRow="span 3"
          backgroundColor={colors.primary[400]}
          position="relative"
        >
          <CampaignsGrid data={campaignGridData} />
        </Box>
      </Box>
    </Box>
  );
};

export default Overview;
