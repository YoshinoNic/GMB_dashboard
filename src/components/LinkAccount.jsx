import React from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import ShareIcon from "@mui/icons-material/Share";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import PinterestIcon from "@mui/icons-material/Pinterest";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";

const LinkAccount = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [platform, setPlatform] = React.useState("");
  const [email, setEmail] = React.useState("");

  const handlePlatform = (event) => {
    setPlatform(event.target.value);
  };

  const handleEmail = (event) => {
    setEmail(event.target.value);
  };

  return (
    <Card
      elevation={0}
      sx={{
        backgroundColor: colors.primary[400],
        width: 290,
        height: 340,
        position: "relative",
        border: "2px dashed",
        borderColor: colors.grey[500],
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            p: 5,
          }}
        >
          <Avatar
            sx={{
              width: "4rem",
              height: "4rem",
              mb: 2,
              backgroundColor: colors.grey[300],
            }}
          >
            <ShareIcon fontSize="large" />
          </Avatar>
          <FormControl
            sx={{ minWidth: 150, width: "100%", mb: 2 }}
            size="small"
          >
            <InputLabel id="select-platform">Platform</InputLabel>
            <Select
              labelId="select-platform"
              id="demo-select-small"
              value={platform}
              label="Platform"
              onChange={handlePlatform}
              fullWidth
              InputProps={{
                style: {
                  display: "flex",
                  alignItems: "center",
                },
              }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="Pinterest">
                <div style={{ display: "flex", alignItems: "center" }}>
                  <PinterestIcon />
                  <span style={{ paddingLeft: "8px" }}>Pinterest</span>
                </div>
              </MenuItem>
              <MenuItem value="Instagram">
                <div style={{ display: "flex", alignItems: "center" }}>
                  <InstagramIcon />
                  <span style={{ paddingLeft: "8px" }}>Instagram</span>
                </div>
              </MenuItem>
              <MenuItem value="Linkedin">
                <div style={{ display: "flex", alignItems: "center" }}>
                  <LinkedInIcon />
                  <span style={{ paddingLeft: "8px" }}>Linkedin</span>
                </div>
              </MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Email"
            size="small"
            variant="outlined"
            value={email}
            onChange={handleEmail}
            fullWidth
          />
        </Box>
      </CardContent>
      <CardActions
        sx={{
          justifyContent: "center",
          position: "absolute",
          bottom: 15,
          width: "100%",
        }}
      >
        <Button color="secondary" variant="outlined">
          Link account
        </Button>
      </CardActions>
    </Card>
  );
};

export default LinkAccount;
