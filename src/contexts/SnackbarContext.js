import React from "react";
import CustomSnackbar from "../common/CustomSnackbar";

const SnackbarContext = React.createContext();

export const SnackbarProvider = ({ children }) => {
  const [open, setOpen] = React.useState(false);
  const [severity, setSeverity] = React.useState("success");
  const [message, setMessage] = React.useState("");

  const handleClose = () => {
    setOpen(false);
  };

  const showSnackbar = React.useCallback((message, severity = "success") => {
    setMessage(message);
    setSeverity(severity);
    setOpen(true);
  }, []);

  React.useEffect(() => {
    if (!open) {
      setMessage("");
    }
  }, [open]);

  return (
    <SnackbarContext.Provider value={showSnackbar}>
      {children}
      <CustomSnackbar open={open} handleClose={handleClose} severity={severity}>
        {message}
      </CustomSnackbar>
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => {
  return React.useContext(SnackbarContext);
};
