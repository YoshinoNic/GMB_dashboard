import { Box, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import StorefrontIcon from "@mui/icons-material/Storefront";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import RouteIcon from "@mui/icons-material/Route";
import PhoneIcon from "@mui/icons-material/Phone";
import OpenInBrowserIcon from "@mui/icons-material/OpenInBrowser";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import SearchIcon from "@mui/icons-material/Search";
import PublicIcon from "@mui/icons-material/Public";

import { tokens } from "../theme";

const METRIC_IDS = {
  BUSINESS_DIRECTION_REQUESTS: "BUSINESS_DIRECTION_REQUESTS",
  CALL_CLICKS: "CALL_CLICKS",
  WEBSITE_CLICKS: "WEBSITE_CLICKS",
  BUSINESS_CONVERSATIONS: "BUSINESS_CONVERSATIONS",
  DESKTOP_SEARCH_IMPRESSIONS: "BUSINESS_IMPRESSIONS_DESKTOP_SEARCH",
  MOBILE_SEARCH_IMPRESSIONS: "BUSINESS_IMPRESSIONS_MOBILE_SEARCH",
  DESKTOP_MAP_IMPRESSIONS: "BUSINESS_IMPRESSIONS_DESKTOP_MAPS",
  MOBILE_MAP_IMPRESSIONS: "BUSINESS_IMPRESSIONS_MOBILE_MAPS",
};

const columns = [
  {
    field: "campaignName",
    headerName: "Campaign",
    flex: 1.5,
    renderHeader: (params) => (
      <Box display="flex" alignItems="center">
        <StorefrontIcon sx={{ mr: 1 }} />
        <span>{params.colDef.headerName}</span>
      </Box>
    ),
  },
  {
    field: "channel",
    headerName: "Channel",
    flex: 0.8,
    renderHeader: (params) => (
      <Box display="flex" alignItems="center">
        <LocationOnIcon sx={{ mr: 1 }} />
        <span>{params.colDef.headerName}</span>
      </Box>
    ),
  },
  {
    field: "cost",
    headerName: "Media cost",
    flex: 0.8,
    align: "center",
    renderHeader: (params) => (
      <Box display="flex" alignItems="center">
        <LocationOnIcon sx={{ mr: 1 }} />
        <span>{params.colDef.headerName}</span>
      </Box>
    ),
    renderCell: (params) => <span>{params.value.toLocaleString()} SEK</span>,
  },
  {
    field: "businessDirectionRequests",
    headerName: "Direction Requests",
    flex: 1,
    align: "center",
    renderHeader: (params) => (
      <Box display="flex" alignItems="center">
        <RouteIcon sx={{ mr: 1 }} />
        <span>{params.colDef.headerName}</span>
      </Box>
    ),
    renderCell: (params) => <span>{params.value.toLocaleString()}</span>,
  },
  {
    field: "callClicks",
    headerName: "Call Clicks",
    flex: 0.7,
    align: "center",
    renderHeader: (params) => (
      <Box display="flex" alignItems="center">
        <PhoneIcon sx={{ mr: 1 }} />
        <span>{params.colDef.headerName}</span>
      </Box>
    ),
    renderCell: (params) => <span>{params.value.toLocaleString()}</span>,
  },
  {
    field: "websiteClicks",
    headerName: "Website Clicks",
    flex: 0.8,
    align: "center",
    renderHeader: (params) => (
      <Box display="flex" alignItems="center">
        <OpenInBrowserIcon sx={{ mr: 1 }} />
        <span>{params.colDef.headerName}</span>
      </Box>
    ),
    renderCell: (params) => <span>{params.value.toLocaleString()}</span>,
  },
  {
    field: "businessConversations",
    headerName: "Conversations",
    flex: 0.8,
    align: "center",
    renderHeader: (params) => (
      <Box display="flex" alignItems="center">
        <QuestionAnswerIcon sx={{ mr: 1 }} />
        <span>{params.colDef.headerName}</span>
      </Box>
    ),
    renderCell: (params) => <span>{params.value.toLocaleString()}</span>,
  },
  {
    field: "searchImpressions",
    headerName: "Search Impressions",
    flex: 1,
    align: "center",
    renderHeader: (params) => (
      <Box display="flex" alignItems="center">
        <SearchIcon sx={{ mr: 1 }} />
        <span>{params.colDef.headerName}</span>
      </Box>
    ),
    renderCell: (params) => <span>{params.value.toLocaleString()}</span>,
  },
  {
    field: "mapImpressions",
    headerName: "Map Impressions",
    flex: 1,
    align: "center",
    renderHeader: (params) => (
      <Box display="flex" alignItems="center">
        <PublicIcon sx={{ mr: 1 }} />
        <span>{params.colDef.headerName}</span>
      </Box>
    ),
    renderCell: (params) => <span>{params.value.toLocaleString()}</span>,
  },
];

const calculateMetric = (business, metricId) => {
  const metric = business.metrics.find((m) => m.id === metricId);
  return metric ? metric.value : 0;
};

const CampaignsGrid = ({ data }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const rows = data.map((business) => {
    const { campaignName, channel, cost } = business;

    const businessDirectionRequests = calculateMetric(
      business,
      METRIC_IDS.BUSINESS_DIRECTION_REQUESTS
    );
    const callClicks = calculateMetric(business, METRIC_IDS.CALL_CLICKS);
    const websiteClicks = calculateMetric(business, METRIC_IDS.WEBSITE_CLICKS);
    const businessConversations = calculateMetric(
      business,
      METRIC_IDS.BUSINESS_CONVERSATIONS
    );

    const desktopSearchImpressions = calculateMetric(
      business,
      METRIC_IDS.DESKTOP_SEARCH_IMPRESSIONS
    );
    const mobileSearchImpressions = calculateMetric(
      business,
      METRIC_IDS.MOBILE_SEARCH_IMPRESSIONS
    );
    const searchImpressions =
      desktopSearchImpressions + mobileSearchImpressions;

    const desktopMapImpressions = calculateMetric(
      business,
      METRIC_IDS.DESKTOP_MAP_IMPRESSIONS
    );
    const mobileMapImpressions = calculateMetric(
      business,
      METRIC_IDS.MOBILE_MAP_IMPRESSIONS
    );
    const mapImpressions = desktopMapImpressions + mobileMapImpressions;

    return {
      id: campaignName,
      campaignName,
      channel,
      cost,
      businessDirectionRequests,
      callClicks,
      websiteClicks,
      businessConversations,
      searchImpressions,
      mapImpressions,
    };
  });

  return (
    <DataGrid
      rows={rows}
      columns={columns}
      initialState={{
        pagination: {
          paginationModel: {
            pageSize: 10,
          },
        },
      }}
      pageSizeOptions={[10]}
      disableRowSelectionOnClick
      sx={{
        "& .MuiDataGrid-columnHeader": {
          color: colors.greenAccent[400],
        },
      }}
    />
  );
};

export default CampaignsGrid;
