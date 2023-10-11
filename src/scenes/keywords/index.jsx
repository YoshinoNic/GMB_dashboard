import { Box, Chip, LinearProgress, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import StorefrontIcon from "@mui/icons-material/Storefront";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import TypeSpecimenIcon from "@mui/icons-material/TypeSpecimen";
import SearchIcon from "@mui/icons-material/Search";
import ShowChartIcon from "@mui/icons-material/ShowChart";

import FiltersTab from "../../components/FiltersTab";

import { usePlatformContext } from "../../context/PlatformContext";
import { tokens } from "../../theme";

const Keywords = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { loading, keywordsData } = usePlatformContext();

  const columns = [
    {
      field: "locationName",
      headerName: "Location",
      flex: 0.6,
      renderHeader: (params) => (
        <Box display="flex" alignItems="center">
          <StorefrontIcon sx={{ mr: 1 }} />
          <span>{params.colDef.headerName}</span>
        </Box>
      ),
    },
    {
      field: "storefrontAddress",
      headerName: "Address",
      flex: 1,
      renderHeader: (params) => (
        <Box display="flex" alignItems="center">
          <LocationOnIcon sx={{ mr: 1 }} />
          <span>{params.colDef.headerName}</span>
        </Box>
      ),
    },
    {
      field: "searchType",
      headerName: "Search Type",
      flex: 1,
      renderHeader: (params) => (
        <Box display="flex" alignItems="center">
          <TypeSpecimenIcon sx={{ mr: 1 }} />
          <span>{params.colDef.headerName}</span>
        </Box>
      ),
      renderCell: (params) => <Chip label="Generic" />,
    },
    {
      field: "searchKeyword",
      headerName: "Search Keyword",
      flex: 1.5,
      renderHeader: (params) => (
        <Box display="flex" alignItems="center">
          <SearchIcon sx={{ mr: 1 }} />
          <span>{params.colDef.headerName}</span>
        </Box>
      ),
      renderCell: (params) => (
        <Chip
          label={params.value}
          style={{
            backgroundColor: colors.blueAccent[400], // Adjust the color as needed
            color: "white",
          }}
        />
      ),
    },
    {
      field: "insightsValue",
      headerName: "Search Volume",
      flex: 1,
      renderHeader: (params) => (
        <Box display="flex" alignItems="center">
          <ShowChartIcon sx={{ mr: 1 }} />
          <span>{params.colDef.headerName}</span>
        </Box>
      ),
      renderCell: (params) => <span>{params.value.toLocaleString()}</span>,
    },
  ];

  const rows = keywordsData.flatMap((business) => {
    const locationName = business.name;
    const storefrontAddress =
      business.details.storefrontAddress.addressLines.join(", ");

    // Map each searchKeyword to its own row
    return business.searchKeywords
      .filter((keyword) => typeof keyword.insightsValue.value === "number")
      .map((keyword, index) => ({
        id: `${business.businessId}-${index}`, // Unique id for each row
        locationName,
        storefrontAddress,
        searchType: "Generic",
        searchKeyword: keyword.searchKeyword,
        insightsValue:
          keyword.insightsValue.value || keyword.insightsValue.threshold,
      }));
  });

  return (
    <Box m="20px" pb="20px">
      <FiltersTab
        title="KEYWORDS"
        subtitle="Search impressions in Google Search or Maps"
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
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 100,
              },
            },
          }}
          pageSizeOptions={[100]}
          disableRowSelectionOnClick
          sx={{
            "& .MuiDataGrid-columnHeader": {
              color: colors.greenAccent[400],
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default Keywords;
