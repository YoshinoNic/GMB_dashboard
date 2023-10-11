import React, { Fragment } from "react";
import { ResponsiveBar } from "@nivo/bar";
import { Axes } from "@nivo/axes";
import { line, curveCatmullRom } from "d3-shape";
import { timeParse } from "d3-time-format";
import { computeXYScalesForSeries } from "@nivo/scales";
import { useTooltip } from "@nivo/tooltip";

import { useTheme } from "@mui/material";
import { tokens } from "../theme";

import { METRIC_DISPLAY_COLORS } from "../constants";

const parseDate = timeParse("%Y-%m-%d");

const getColorForId = (id) => {
  return METRIC_DISPLAY_COLORS[id] || null;
};

const Line = ({
  data,
  bars,
  xScale,
  innerWidth,
  innerHeight,
  lineColor,
  barColor,
}) => {
  const scale = computeXYScalesForSeries(
    [
      {
        id: "only",
        data: data
          .map((it) => {
            const parsedDate = parseDate(it.x);
            if (!parsedDate) {
              return null;
            }
            return { x: parsedDate, y: it.v1 };
          })
          .filter(Boolean),
      },
    ],
    { type: "time" },
    { type: "linear" },
    innerWidth,
    innerHeight
  );

  const lineGenerator = line()
    .x((bar) => bar.x + bar.width / 2)
    .y((bar) => scale.yScale(bar.data.data.v1))
    .curve(curveCatmullRom.alpha(0.5));

  const tip = useTooltip();

  function renderTip(e, idx, lineColor, barColor) {
    return tip.showTooltipFromEvent(
      <CustomTooltip
        barValue={data[idx].v}
        lineValue={data[idx].v1}
        lineColor={lineColor}
        barColor={barColor}
      />,
      e
    );
  }

  return (
    <Fragment>
      <Axes
        yScale={scale.yScale}
        xScale={xScale}
        width={innerWidth}
        height={innerHeight}
        right={{
          ticksPosition: "after",
        }}
      />
      <path
        d={lineGenerator(bars)}
        fill="none"
        stroke={lineColor}
        style={{ pointerEvents: "none", strokeWidth: "3" }}
      />

      {bars.map((bar) => (
        <circle
          key={bar.key}
          cx={xScale(bar.data.data.x) + bar.width / 2}
          cy={scale.yScale(bar.data.data.v1)}
          r={4}
          fill={lineColor}
          stroke={lineColor}
          style={{ pointerEvents: "none" }}
        />
      ))}
      {bars.map((bar, idx) => (
        <rect
          key={bar.key}
          x={bar.x}
          y={0}
          height={innerHeight}
          width={bar.width}
          fill="transparent"
          onMouseEnter={(e) => renderTip(e, idx, lineColor, barColor)}
          onMouseMove={(e) => renderTip(e, idx, lineColor, barColor)}
          onMouseLeave={tip.hideTooltip}
        />
      ))}
    </Fragment>
  );
};

function CustomTooltip(obj) {
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
          background: obj.lineColor,
          marginRight: "5px",
        }}
      ></span>
      <span style={{ marginRight: "5px" }}>
        <strong>Requests</strong>: {Math.round(obj.lineValue).toLocaleString()}
      </span>
      <span
        style={{
          display: "inline-block",
          width: "12px",
          height: "12px",
          background: obj.barColor,
          marginRight: "5px",
        }}
      ></span>
      <span>
        <strong>Cost</strong>: {Math.round(obj.barValue).toLocaleString()} SEK
      </span>
    </div>
  );
}

const ComboChart = ({
  lineMetrics,
  channelBarChartData,
  impactLineGraphData,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  let data = [];
  const lineColor = getColorForId(lineMetrics);
  const barColor = colors.greenAccent[300];

  channelBarChartData.forEach((barData, index) => {
    if (!barData.x) {
      console.warn("Skipped data point due to missing x value:", barData);
      return;
    }

    const lineDataPoint = impactLineGraphData[0].data.find(
      (lineData) => lineData.x === barData.x
    );

    data.push({
      x: barData.x,
      v: barData.y,
      v1: lineDataPoint ? lineDataPoint.y : null,
    });
  });

  return (
    <ResponsiveBar
      data={data}
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
      keys={["v"]}
      indexBy="x"
      padding={0.3}
      margin={{ top: 50, right: 60, bottom: 80, left: 60 }}
      enableLabel={false}
      colors={[colors.greenAccent[300]]}
      borderRadius={2}
      borderColor={{
        from: "color",
        modifiers: [["darker", "1.6"]],
      }}
      axisBottom={{
        tickRotation: -45,
        format: (value) => {
          const date = new Date(value);
          const month = date.toLocaleString("default", { month: "short" });
          return `${month} ${date.getDate()}`;
        },
      }}
      axisLeft={{
        tickValues: 7,
      }}
      enableGridY={false}
      layers={[
        "grid",
        "axes",
        "bars",
        (barProps) => (
          <React.Fragment>
            <Line
              {...barProps}
              data={data}
              lineColor={lineColor}
              barColor={barColor}
            />
          </React.Fragment>
        ),
        "markers",
        "legends",
      ]}
    />
  );
};
export default ComboChart;
