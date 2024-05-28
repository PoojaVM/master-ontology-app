import React from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Person from "@mui/icons-material/Person2TwoTone";
import HomeIcon from "@mui/icons-material/Home";
import Logout from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";
import { useSnackbar } from "../contexts/SnackbarContext";
import { canManageUsers } from "../utils";
import { ROLENAMES } from "../constants";
import { Chip } from "@mui/material";

export default function AccountMenu() {
  const { authUser, logOut, role } = useAuth();
  const canViewUsersPage = canManageUsers(role);
  const showSnackbar = useSnackbar();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setAnchorEl(null);
  };

  const username = React.useMemo(() => {
    return authUser?.tokens?.idToken?.payload?.["cognito:username"] || "Guest";
  }, [authUser]);

  const handleSignOut = async (e) => {
    try {
      handleClose(e);
      await logOut();
      showSnackbar("You have been signed out", "success");
      navigate("/");
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  return (
    <React.Fragment>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <Typography sx={{ minWidth: 100 }}>
          Welcome {ROLENAMES[role].toUpperCase()}
        </Typography>
        <Chip
          sx={{ ml: 2, color: "white", bgcolor: "primary.main" }}
          avatar={
            <Avatar sx={{ width: 32, height: 32 }}>
              {username?.[0]?.toUpperCase()}
            </Avatar>
          }
          label={username}
          clickable
          component={IconButton}
          variant="outlined"
          onClick={handleClick}
          aria-controls={open ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        />
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={() => navigate("/home")}>
          <ListItemIcon>
            <HomeIcon fontSize="small" />
          </ListItemIcon>
          Home
        </MenuItem>
        {canViewUsersPage ? (
          <MenuItem onClick={() => navigate("/users")}>
            <ListItemIcon>
              <Person fontSize="small" />
            </ListItemIcon>
            Users
          </MenuItem>
        ) : null}
        <MenuItem onClick={handleSignOut}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Sign out
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
