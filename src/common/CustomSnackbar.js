import * as React from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import PropTypes from "prop-types";

export default function CustomSnackbar({
  open,
  handleClose,
  severity,
  children,
}) {
  const onClose = (_event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    handleClose();
  };

  return (
    <Snackbar open={open} autoHideDuration={5000} onClose={onClose}>
      <Alert
        onClose={handleClose}
        severity={severity}
        variant="filled"
        sx={{ width: "100%" }}
      >
        {children}
      </Alert>
    </Snackbar>
  );
}

CustomSnackbar.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func.isRequired,
  severity: PropTypes.oneOf(["error", "info", "success", "warning"]).isRequired,
  children: PropTypes.any,
};

CustomSnackbar.defaultProps = {
  open: false,
  children: "",
};
