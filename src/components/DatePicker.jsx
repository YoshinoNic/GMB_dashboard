import React, { useState } from "react";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import {
  DateRangePicker,
  defaultStaticRanges,
  createStaticRanges,
} from "react-date-range";
import { Modal, Button, useTheme } from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import { tokens } from "../theme";

function DatePicker({ startDate, setStartDate, endDate, setEndDate }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [dateRange, setDateRange] = useState({
    startDate,
    endDate,
    key: "rollup",
  });

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const staticRanges = createStaticRanges([...defaultStaticRanges]);

  const handleDateChange = (ranges) => {
    setDateRange(ranges.rollup);
    setStartDate(ranges.rollup.startDate);
    setEndDate(ranges.rollup.endDate);
  };

  const styles = (theme) => ({
    button: {
      backgroundColor: theme.blueAccent[700],
      color: theme.grey[100],
      fontSize: "14px",
      fontWeight: "bold",
      padding: "12px 20px",
    },
  });

  return (
    <div>
      <Button
        sx={styles(colors).button}
        endIcon={<EventIcon />}
        onClick={handleOpen}
      >
        {dateRange.startDate?.toLocaleDateString()} -{" "}
        {dateRange.endDate?.toLocaleDateString()}
      </Button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="date-range-model"
        aria-describedby="filter-data-by-date-modal"
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            boxShadow: theme.shadows[5],
          }}
        >
          <DateRangePicker
            startDatePlaceholder="Start Date"
            endDatePlaceholder="End Date"
            rangeColors={[colors.greenAccent[500]]}
            ranges={[dateRange]}
            onChange={handleDateChange}
            staticRanges={staticRanges}
            inputRanges={[]}
          />
        </div>
      </Modal>
    </div>
  );
}

export default DatePicker;
