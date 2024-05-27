import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import AccountMenu from "./AccountMenu";

const Header = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Concept Viewer
        </Typography>
        <Box display="flex" alignItems="center">
          <AccountMenu />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
