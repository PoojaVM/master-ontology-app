import React from "react";
import Grid from "./common/Grid";
import Header from "./common/Header";
import { Box } from "@mui/material";

function Home() {
  return (
    <div>
      <Header />
      <Box
        mt={10}
        display="flex"
        justifyContent="center"
        minHeight="100vh"
      >
        <Grid />
      </Box>
    </div>
  );
}

export default Home;
