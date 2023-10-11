import { ResponsivePie } from "@nivo/pie";
import { tokens } from "../theme";
import { useTheme } from "@mui/material";

function renderTooltip(datum) {
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
          background: datum.color,
          marginRight: "5px",
        }}
      ></span>
      <span style={{ color: datum.color }}>
        <strong>{datum.id}</strong>: {Math.round(datum.value).toLocaleString()}
      </span>
    </div>
  );
}

const PieChart = ({ data }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const customArcLinkLabel = (datum) => {
    const words = datum.id.split(" ");
    if (words.length <= 2) {
      return datum.id;
    }

    // Abbreviate the label if it contains more than three words
    return words.slice(0, 2).join(" ") + "...";
  };

  return (
    <ResponsivePie
      data={data}
      colors={data.map((d) => d.color)}
      margin={{ top: 40, right: 80, bottom: 40, left: 80 }}
      innerRadius={0.5}
      padAngle={0.7}
      cornerRadius={3}
      activeOuterRadiusOffset={8}
      borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
      arcLinkLabel={customArcLinkLabel}
      arcLinkLabelsSkipAngle={15}
      arcLinkLabelsTextColor={colors.grey[100]}
      arcLinkLabelsDiagonalLength={7}
      arcLinkLabelsStraightLength={10}
      arcLinkLabelsThickness={2}
      enableArcLabels={false}
      legends={[]}
      tooltip={({ datum }) => renderTooltip(datum)}
    />
  );
};

export default PieChart;
