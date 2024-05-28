import * as React from "react";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import useDebouncedInput from "../hooks/useDebouncedInput";
import { Tooltip } from "@mui/material";

export default function SearchInput({ placeholder, onSearch, sx }) {
  const {
    inputValue: search,
    setInputValue: setSearch,
    debouncedValue: debouncedSearch,
  } = useDebouncedInput();

  const onClear = () => {
    setSearch("");
  };

  React.useEffect(() => {
    onSearch(debouncedSearch);
  }, [onSearch, debouncedSearch]);

  return (
    <Paper
      component="form"
      sx={{
        display: "flex",
        alignItems: "center",
        width: 400,
        ...sx,
      }}
    >
      <Tooltip title={placeholder || "Search"}>
        <SearchIcon sx={{ ml: 1 }} />
      </Tooltip>
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder={placeholder || "Search"}
        inputProps={{ "aria-label": placeholder || "Search" }}
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
        onBlur={(e) => {
          setSearch(e?.target?.value?.trim());
        }}
      />
      <IconButton
        color="primary"
        sx={{ p: "10px" }}
        aria-label="Clear"
        onClick={onClear}
      >
        <ClearIcon />
      </IconButton>
    </Paper>
  );
}
