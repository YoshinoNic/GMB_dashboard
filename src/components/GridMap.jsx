import React, { useState, useEffect, useContext } from "react";
import { Map } from "react-map-gl";
import maplibregl from "maplibre-gl";
import DeckGL from "@deck.gl/react";
import { ScreenGridLayer } from "@deck.gl/aggregation-layers";
import { isWebGL2 } from "@luma.gl/core";

import { ColorModeContext } from "../theme";

const INITIAL_VIEW_STATE = {
  latitude: 62,
  longitude: 18,
  zoom: 4,
  minZoom: 4,
  maxZoom: 15,
  pitch: 0,
  bearing: 0,
};

const MAP_STYLE =
  "https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json";

const colorRange = [
  [255, 182, 193, 25], // Light Pink
  [242, 158, 195, 85],
  [229, 134, 197, 127],
  [216, 110, 199, 170],
  [175, 101, 227, 212],
  [134, 93, 255, 255], // Dark Purple
];

const transformData = (data) => {
  const aggregation = {};

  data.forEach((item) => {
    const [longitude, latitude] = item.coordinates;
    const key = `${latitude},${longitude}`;

    aggregation[key] = (aggregation[key] || 0) + item.requests;
  });

  return Object.entries(aggregation).map(([key, value]) => {
    const [lat, lon] = key.split(",").map(Number);
    return [lon, lat, value];
  });
};

const GridMap = ({
  rawData,
  waterColor,
  cellSize = 15,
  gpuAggregation = true,
  aggregation = "SUM",
  disableGPUAggregation,
  mapStyle = MAP_STYLE,
}) => {
  const { mode } = useContext(ColorModeContext);

  const [modifiedMapStyle, setModifiedMapStyle] = useState(null);
  const [mapKey, setMapKey] = useState(0); // Add a state to keep track of the key

  const data = transformData(rawData);

  useEffect(() => {
    fetch(mapStyle)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
      })
      .then((style) => {
        style.layers.forEach((layer) => {
          if (layer.type === "fill") {
            if (layer.id.includes("water")) {
              layer.paint["fill-color"] = waterColor;
            }
          }
        });

        setModifiedMapStyle(style);
        setMapKey((prevKey) => prevKey + 1);
      });
  }, [mapStyle, mode, waterColor]);

  const layers = data.length
    ? [
        // Check if data is not empty
        new ScreenGridLayer({
          id: "grid",
          data,
          opacity: 0.8,
          getPosition: (d) => [d[0], d[1]],
          getWeight: (d) => d[2],
          cellSizePixels: cellSize,
          colorRange,
          gpuAggregation,
          aggregation,
        }),
      ]
    : [];

  const onInitialized = (gl) => {
    if (!isWebGL2(gl)) {
      console.warn("GPU aggregation is not supported"); // eslint-disable-line
      if (disableGPUAggregation) {
        disableGPUAggregation();
      }
    }
  };

  return (
    <div
      style={{
        position: "relative",
        height: "100%",
        width: "100%",
        overflow: "hidden",
      }}
    >
      <DeckGL
        key={mapKey}
        layers={layers}
        initialViewState={INITIAL_VIEW_STATE}
        onWebGLInitialized={onInitialized}
        controller={true}
      >
        {modifiedMapStyle ? (
          <Map
            reuseMaps
            mapLib={maplibregl}
            mapStyle={modifiedMapStyle}
            preventStyleDiffing={true}
          />
        ) : null}
      </DeckGL>
    </div>
  );
};

export default GridMap;
