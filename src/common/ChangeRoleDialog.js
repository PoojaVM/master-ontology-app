import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { ROLENAMES, ROLES } from "../constants";
import { useSnackbar } from "../contexts/SnackbarContext";
import Loading from "./Loading";
import userAPIService from "../api/users";
import { useAuth } from "../contexts/AuthContext";
import { canManageUsers } from "../utils";

export default function ChangeRoleDialog({
  user,
  open,
  handleClose,
  afterChange,
}) {
  const showSnackbar = useSnackbar();
  const { role: currentUserRole } = useAuth();
  const [role, setRole] = React.useState(user.role);
  const [loading, setLoading] = React.useState(false);

  const rolesMap = React.useMemo(() => {
    if (!canManageUsers(currentUserRole)) {
      return [];
    }

    const roles = { ...ROLENAMES };
    delete roles[ROLES.SUPER_ADMIN];

    // // If current user role is super admin, then keep it in the list
    // // so we can disable it in the dropdown.
    // if (user.role !== ROLES.SUPER_ADMIN) {
    // }

    return roles;
  }, [currentUserRole]);

  const cannotChangeRole = React.useMemo(() => {
    if (!canManageUsers(currentUserRole)) {
      return false;
    }

    if (user.role === ROLES.SUPER_ADMIN) {
      return true;
    }

    return currentUserRole === ROLES.SUPER_ADMIN
      ? false
      : user.role === ROLES.ADMIN;
  }, [currentUserRole, user.role]);

  const handleChange = (event) => {
    setRole(event.target.value);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      await userAPIService.updateUserRole({
        id: user.userName,
        newGroup: role,
      });
      await afterChange();
      showSnackbar(
        `User "${user.userName}" role updated to "${role}" successfully.`,
        "success"
      );
    } catch (error) {
      console.error("Error updating user:", error);
      showSnackbar(`Error updating user "${user.userName}"`, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        component: "form",
        onSubmit,
      }}
    >
      {loading && <Loading />}
      <DialogTitle>Change Role for {user.userName}</DialogTitle>
      <DialogContent>
        <DialogContentText mb={2}>
          Please select the role that you want to assign to this user.
        </DialogContentText>
        <FormControl fullWidth>
          <InputLabel id="role-select-label">Select Role</InputLabel>
          <Select
            labelId="role-select-label"
            id="role-select"
            value={role}
            label="Select Role"
            onChange={handleChange}
            fullWidth
            disabled={cannotChangeRole}
          >
            {Object.keys(rolesMap).map((value) => (
              <MenuItem key={value} value={value} disabled={value === ROLES.SUPER_ADMIN}>
                {rolesMap[value]}
              </MenuItem>
            ))}
            {user.role === ROLES.SUPER_ADMIN ? (
              <MenuItem key={user.role} value={ROLES.SUPER_ADMIN} disabled>
                {ROLENAMES.SuperAdmin}
              </MenuItem>
            ) : null}
          </Select>
        </FormControl>
        <DialogContentText mt={2}>
          {role === ROLES.SUPER_ADMIN
            ? "Super Admins can manage all users and concepts. You cannot change super admin role."
            : role === ROLES.ADMIN
            ? "Admins can manage all users and concepts." +
              (currentUserRole === ROLES.ADMIN
                ? " You cannot change admin role."
                : "")
            : role === ROLES.EDITOR
            ? "Editors can manage concepts."
            : role === ROLES.VIEWER
            ? "Viewers can view concepts."
            : ""}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>
          {cannotChangeRole ? "Close" : "Cancel"}
        </Button>
        {cannotChangeRole ? null : <Button type="submit">Update</Button>}
      </DialogActions>
    </Dialog>
  );
}
