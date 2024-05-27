import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function DeleteAlertDialog({ open, handleClose, handleDelete }) {
  const onClose = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleClose();
  };

  const onDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleDelete();
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Delete This Record?</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to delete this record? This action cannot be
          undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button onClick={onDelete} autoFocus>
          Yes, Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
