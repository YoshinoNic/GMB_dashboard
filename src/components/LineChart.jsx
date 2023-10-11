import { ResponsiveLine } from "@nivo/line";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";

// Static configurations
const STATIC_THEME = {
  legends: {
    text: {
      fill: "#ccc",
    },
  },
  tooltip: {
    container: {
      color: "#333",
    },
  },
};

const getLineProperties = (data) => ({
  data,
  margin: { top: 50, right: 60, bottom: 80, left: 60 },
  xScale: { type: "point" },
  yScale: {
    type: "linear",
    min: "auto",
    max: "auto",
    stacked: false,
    reverse: false,
  },
  yFormat: " >-.2f",
  curve: "catmullRom",
  axisBottom: {
    tickRotation: -45,
    format: (value) => {
      const date = new Date(value);
      const month = date.toLocaleString("default", { month: "short" });
      return `${month} ${date.getDate()}`;
    },
  },
  enableGridX: false,
  enableGridY: false,
  pointSize: 8,
  pointColor: { theme: "background" },
  pointBorderWidth: 2,
  pointBorderColor: { from: "serieColor" },
  pointLabelYOffset: -12,
  useMesh: true,
});

const LineChart = ({ data }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Sort data by date for each dataset
  data.forEach((dataset) => {
    dataset.data.sort((a, b) => new Date(a.x) - new Date(b.x));
  });

  // Dynamic configurations based on props
  const dynamicTheme = {
    axis: {
      domain: {
        line: {
          stroke: colors.grey[100],
        },
      },
      legend: {
        text: {
          fill: colors.grey[100],
        },
      },
      ticks: {
        line: {
          stroke: colors.grey[100],
          strokeWidth: 1,
        },
        text: {
          fill: colors.grey[100],
        },
      },
    },
  };

  const lineProperties = getLineProperties(data);

  return (
    <ResponsiveLine
      {...lineProperties}
      theme={{ ...STATIC_THEME, ...dynamicTheme }}
      colors={{ datum: "color" }}
      axisBottom={{
        ...lineProperties.axisBottom,
      }}
      axisLeft={{
        tickValues: 5,
      }}
    />
  );
};

export default LineChart;
