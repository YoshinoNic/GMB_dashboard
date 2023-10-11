import React from "react";
import {
  Box,
  Select,
  OutlinedInput,
  FormControl,
  InputLabel,
  MenuItem,
} from "@mui/material";

import Header from "./Header";
import DatePicker from "./DatePicker";

import { usePlatformContext } from "../context/PlatformContext";

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

const FiltersTab = ({ title, subtitle, theme, colors }) => {
  const {
    locationNames,
    stores,
    setStores,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
  } = usePlatformContext();

  const handleStores = (event) => {
    const { value } = event.target;
    setStores(value);
  };

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Header title={title} subtitle={subtitle} />

      <Box display="flex" alignItems="center">
        <FormControl sx={{ m: 1, width: 300 }}>
          <InputLabel id="demo-multiple-name-label">Store Locations</InputLabel>
          <Select
            labelId="demo-multiple-name-label"
            id="demo-multiple-name"
            multiple
            value={stores}
            onChange={handleStores}
            input={<OutlinedInput label="Locations" />}
            MenuProps={MENU_PROPS}
          >
            {locationNames.map((name) => (
              <MenuItem
                key={name}
                value={name}
                style={getMenuStyles(name, stores, theme)}
              >
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <DatePicker
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
        />
      </Box>
    </Box>
  );
};

export default FiltersTab;
