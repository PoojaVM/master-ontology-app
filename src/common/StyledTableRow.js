import { TableRow, styled } from "@mui/material";

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
    boxShadow: "0px 0px 5px 0px rgba(0,0,0,0.1)",
    cursor: "pointer",
  },
}));

export default StyledTableRow;
