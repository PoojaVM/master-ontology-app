import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { MenuItem, Select } from "@mui/material";
import { ROLENAMES, ROLES } from "../constants";
import { useSnackbar } from "../contexts/SnackbarContext";
import Loading from "./Loading";
import userAPIService from "../api/users";

export default function ChangeRoleDialog({
  user,
  open,
  handleClose,
  afterChange,
}) {
  const showSnackbar = useSnackbar();
  const [role, setRole] = React.useState(user.role);
  const [loading, setLoading] = React.useState(false);

  const handleChange = (event) => {
    setRole(event.target.value);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      await userAPIService.updateUserRole({ id: user.userName, newGroup: role });
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
        <Select
          labelId="role-select-label"
          id="role-select"
          value={role}
          label="Role"
          onChange={handleChange}
        >
          {Object.keys(ROLENAMES).map((role) => (
            <MenuItem value={role}>{ROLENAMES[role]}</MenuItem>
          ))}
        </Select>
        <DialogContentText mt={2}>
          {
            role === ROLES.ADMIN ? "Admins can manage all users and concepts."
              : role === ROLES.EDITOR ? "Editors can manage concepts."
              : role === ROLES.VIEWER ? "Viewers can view concepts." : ""
          }
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button type="submit">Update</Button>
      </DialogActions>
    </Dialog>
  );
}
