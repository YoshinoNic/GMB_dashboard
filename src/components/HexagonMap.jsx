import React, { useState, useEffect, useContext } from "react";
import { Map } from "react-map-gl";
import maplibregl from "maplibre-gl";
import { AmbientLight, PointLight, LightingEffect } from "@deck.gl/core";
import { HexagonLayer } from "@deck.gl/aggregation-layers";
import DeckGL from "@deck.gl/react";

import { ColorModeContext } from "../theme";

const ambientLight = new AmbientLight({
  color: [255, 255, 255],
  intensity: 1.0,
});

const pointLight1 = new PointLight({
  color: [255, 255, 255],
  intensity: 0.8,
  position: [-0.144528, 49.739968, 80000],
});

const pointLight2 = new PointLight({
  color: [255, 255, 255],
  intensity: 0.8,
  position: [-3.807751, 54.104682, 8000],
});

const lightingEffect = new LightingEffect({
  ambientLight,
  pointLight1,
  pointLight2,
});

const material = {
  ambient: 0.64,
  diffuse: 0.6,
  shininess: 32,
  specularColor: [51, 51, 51],
};

const INITIAL_VIEW_STATE = {
  latitude: 60,
  longitude: 18,
  zoom: 4.8,
  minZoom: 4.8,
  maxZoom: 15,
  pitch: 45,
  bearing: -5,
};

const MAP_STYLE =
  "https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json";

export const colorRange = [
  [229, 134, 197, 127],
  [216, 110, 199, 170],
  [175, 101, 227, 212],
  [134, 93, 255, 255], // Dark Purple
];

const HexagonMap = ({
  data,
  waterColor,
  mapStyle = MAP_STYLE,
  upperPercentile = 100,
  coverage = 1,
}) => {
  const { mode } = useContext(ColorModeContext);

  const [modifiedMapStyle, setModifiedMapStyle] = useState(null);
  const [mapKey, setMapKey] = useState(0); // Add a state to keep track of the key
  const [elevationScale, setElevationScale] = useState(0);
  const [maxColorValue, setMaxColorValue] = useState(0);

  useEffect(() => {
    const initialAnimationTimeout = setTimeout(() => {
      setElevationScale(100);
    }, 1000);

    return () => clearTimeout(initialAnimationTimeout);
  }, []);

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

  useEffect(() => {
    // Calculate the maximum requests from the data
    const maxRequest = Math.max(...data.map((d) => d.requests));
    setMaxColorValue(maxRequest);
  }, [data]);

  function getTooltip({ object }) {
    if (!object || !object.points) {
      return null;
    }

    const segmentSize = maxColorValue / colorRange.length;
    const colorIndex = Math.min(
      Math.floor(object.colorValue / segmentSize),
      colorRange.length - 1
    );

    const selectedColor = colorRange[colorIndex];
    const textColor = `rgba(${selectedColor[0]}, ${selectedColor[1]}, ${
      selectedColor[2]
    }, ${selectedColor[3] / 255})`;

    // Construct HTML content
    let htmlContent = "";
    object.points.forEach((point) => {
      const source = point.source;
      htmlContent += `
      <div>
        <div><strong>Store:</strong> ${source.name}</div>
        <div><strong>Address:</strong> ${source.address[0]}</div>
        <div><strong>Requests:</strong> ${source.requests}</div>
        <hr style='margin: 5px 0' />
      </div>
    `;
    });

    // Define the tooltip style
    const style = {
      backgroundColor: "white",
      padding: "12px 16px",
      borderRadius: "4px",
      boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)",
      color: textColor,
    };

    return { html: htmlContent, style };
  }

  const layers = [
    new HexagonLayer({
      id: "heatmap",
      colorRange,
      coverage,
      data,
      elevationScale,
      extruded: true,
      getPosition: (d) => d.coordinates,
      getElevationValue: (points) =>
        points.reduce((acc, point) => acc + point.requests, 0),
      getColorValue: (points) =>
        points.reduce((acc, point) => acc + point.requests, 0),
      pickable: true,
      radius: 5000,
      upperPercentile,
      material,
      transitions: {
        elevationScale: 3000, // duration in milliseconds
      },
    }),
  ];

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
        effects={[lightingEffect]}
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        getTooltip={getTooltip}
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

export default HexagonMap;
