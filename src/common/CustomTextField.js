import { styled, TextField } from "@mui/material";

const CustomTextField = styled((props) => <TextField {...props} />)(
  ({ theme }) => ({
    "& .MuiInputBase-root": {
      color: theme.palette.text.primary,
    },
    "& .MuiInputLabel-root": {
      color: theme.palette.text.primary,
    },
    "& .MuiInput-underline:before": {
      borderBottomColor: theme.palette.text.primary,
    },
    "& .MuiInput-underline:hover:before": {
      borderBottomColor: theme.palette.text.primary,
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: theme.palette.primary.main,
    },
    "& .MuiSvgIcon-root": {
      color: theme.palette.text.primary,
    },
    "& .MuiAutocomplete-clearIndicator": {
      color: theme.palette.text.primary,
    },
    "& .MuiAutocomplete-popupIndicator": {
      color: theme.palette.text.primary,
    },
  })
);

export default CustomTextField;
