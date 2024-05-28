import React from "react";
import UserGrid from "./common/UserGrid";
import Header from "./common/Header";
import { Box } from "@mui/material";

function Home() {
  return (
    <Box width="100vw">
      <Header />
      <Box pt={5} display="flex" justifyContent="center" minHeight="calc(100vh - 104px)">
        <UserGrid />
      </Box>
    </Box>
  );
}

export default Home;
