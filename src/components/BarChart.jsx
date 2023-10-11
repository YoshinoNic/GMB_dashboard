import { useTheme } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import { tokens } from "../theme";

function renderTooltip(obj) {
  return (
    <div
      style={{
        background: "white",
        padding: "12px 16px",
        borderRadius: "4px",
        boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)",
        color: "black",
        display: "flex",
        alignItems: "center",
      }}
    >
      <span
        style={{
          display: "inline-block",
          width: "12px",
          height: "12px",
          background: obj.color,
          marginRight: "5px",
        }}
      ></span>
      <span style={{ color: obj.color }}>
        <strong>{obj.id}</strong>: {Math.round(obj.value).toLocaleString()}
      </span>
    </div>
  );
}

const BarChart = ({ data }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <ResponsiveBar
      data={data}
      tooltip={(obj) => renderTooltip(obj)}
      theme={{
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
        legends: {
          text: {
            fill: colors.grey[100],
          },
        },
      }}
      keys={[
        "Direction Requests",
        "Website Clicks",
        "Call Clicks",
        "Conversations",
      ]}
      indexBy="channel"
      margin={{ top: 40, right: 160, bottom: 100, left: 30 }}
      padding={0.3}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={[
        colors.greenAccent[300],
        colors.greenAccent[400],
        colors.greenAccent[500],
        colors.greenAccent[600],
      ]}
      borderRadius={2}
      borderColor={{
        from: "color",
        modifiers: [["darker", "1.6"]],
      }}
      axisBottom={{
        tickPadding: 10,
        tickRotation: 5,
        legendPosition: "middle",
      }}
      axisLeft={null}
      enableLabel={false}
      enableGridX={false}
      enableGridY={false}
      legends={[
        {
          dataFrom: "keys",
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 120,
          translateY: 0,
          itemsSpacing: 2,
          itemWidth: 100,
          itemHeight: 20,
          itemDirection: "left-to-right",
          itemOpacity: 0.85,
          symbolSize: 20,
          effects: [
            {
              on: "hover",
              style: {
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
    />
  );
};

export default BarChart;
