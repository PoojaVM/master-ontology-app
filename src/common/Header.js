import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Avatar, Box } from "@mui/material";

const Header = () => {
  const { authUser, logOut } = useAuth();
  const navigate = useNavigate();

  const username = React.useMemo(() => {
    return authUser?.tokens?.idToken?.payload?.["cognito:username"] || "Guest";
  }, [authUser]);

  const handleSignOut = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Concept Viewer
        </Typography>
        <Box display="flex" alignItems="center">
          <Avatar sx={{ width: 32, height: 32 }}>
            {username?.[0]?.toUpperCase()}
          </Avatar>
          <Typography variant="h6" component="div" marginLeft={1} marginRight={1}>
            Welcome, {username}
          </Typography>

          <Button variant="text" color="inherit" onClick={handleSignOut}>
            Sign out
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
