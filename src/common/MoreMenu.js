import * as React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, ListItemIcon, ListItemText } from "@mui/material";
import DeleteAlertDialog from "./DeleteAlertDialog";

export default function MoreMenu({ handleEdit, handleDelete }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openAlertDialog, setOpenAlertDialog] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    event.preventDefault();
    event.stopPropagation();

    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onEditClick = () => {
    handleEdit();
    handleClose();
  };

  const onDeleteClick = () => {
    setOpenAlertDialog(true);
    handleClose();
  };

  const handleDeleteAlertClose = () => {
    setOpenAlertDialog(false);
  };

  return (
    <div>
      <IconButton
        color="primary"
        aria-label="menu"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={onEditClick}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={onDeleteClick}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="red" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
      {openAlertDialog ? (
        <DeleteAlertDialog
          open={openAlertDialog}
          handleClose={handleDeleteAlertClose}
          handleDelete={handleDelete}
        />
      ) : null}
    </div>
  );
}
