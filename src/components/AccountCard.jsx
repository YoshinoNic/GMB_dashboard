import React from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";

const AccountLink = ({ account }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Card
      elevation={0}
      sx={{
        backgroundColor: colors.primary[400],
        width: 290,
        height: 340,
        position: "relative",
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
            src={account.logo}
            sx={{ width: "4rem", height: "4rem", mb: 2 }}
          />
          <Box sx={{ pb: 1 }}>
            <Typography variant="h4" fontWeight="600">
              {account.platform}
            </Typography>
          </Box>
          <Box sx={{ position: "absolute", bottom: 100 }}>
            <Box sx={{ pb: 1 }}>
              <Typography variant="h6">
                <strong>Name:</strong> {account.propertyName}
              </Typography>
            </Box>
            <Box sx={{ pb: 1 }}>
              <Typography variant="h6">
                <strong>ID:</strong> {account.propertyId}
              </Typography>
            </Box>
          </Box>
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
        <ButtonGroup>
          <Button
            disabled
            sx={{
              backgroundColor: "green !important",
              color: "white !important",
              borderColor: "green !important",
            }}
          >
            {account.status}
          </Button>
          <Button variant="outlined" color="error">
            Unlink
          </Button>
        </ButtonGroup>
      </CardActions>
    </Card>
  );
};

export default AccountLink;
