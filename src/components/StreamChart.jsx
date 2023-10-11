import { ResponsiveStream } from "@nivo/stream";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";

const renderStackTooltip = ({ slice }) => {
  return (
    <div style={{ background: "white", padding: "10px", borderRadius: "5px" }}>
      {slice.stack.map((point) => (
        <div
          key={point.layerId}
          style={{ marginBottom: "6px", marginTop: "6px" }}
        >
          <span
            style={{
              display: "inline-block",
              width: "12px",
              height: "12px",
              background: point.color,
              marginRight: "5px",
            }}
          ></span>
          <span style={{ color: point.color }}>
            <strong>{point.layerLabel}:</strong>{" "}
            {Number(
              parseFloat(point.formattedValue).toFixed(0)
            ).toLocaleString()}{" "}
            SEK
          </span>
        </div>
      ))}
    </div>
  );
};

const StreamChart = ({ data, keys }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <ResponsiveStream
      stackTooltip={renderStackTooltip}
      data={data}
      keys={keys}
      margin={{ top: 60, right: 0, bottom: 51, left: 0 }}
      axisTop={null}
      axisRight={null}
      axisBottom={null}
      axisLeft={null}
      enableGridX={false}
      enableGridY={false}
      offsetType="none"
      colors={[
        colors.greenAccent[400],
        colors.greenAccent[500],
        colors.greenAccent[600],
      ]}
      fillOpacity={0.8}
      borderColor={{ theme: "background" }}
      dotSize={8}
      dotColor={{ from: "color" }}
      dotBorderWidth={2}
      dotBorderColor={{
        from: "color",
        modifiers: [["darker", 0.7]],
      }}
      legends={[
        {
          anchor: "top",
          direction: "row",
          translateY: -40,
          itemWidth: 100,
          itemHeight: 20,
          itemTextColor: "#999999",
          symbolSize: 12,
          symbolShape: "circle",
          effects: [
            {
              on: "hover",
              style: {
                itemTextColor: "#000000",
              },
            },
          ],
        },
      ]}
    />
  );
};

export default StreamChart;
