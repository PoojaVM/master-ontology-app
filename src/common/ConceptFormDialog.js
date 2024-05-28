import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Autocomplete from "@mui/material/Autocomplete";
import {
  Alert,
  AlertTitle,
  Box,
  CircularProgress,
  Collapse,
} from "@mui/material";
import Loading from "./Loading";
import { useSnackbar } from "../contexts/SnackbarContext";
import LinearProgressWithLabel from "./LinearProgressWithLabel";
import apiService from "../api/concepts";

import { debounce } from "lodash";

function ConceptsAutoComplete({
  value,
  onChange,
  label,
  placeholder,
  ...props
}) {
  const [concepts, setConcepts] = React.useState(value ?? []);
  const [search, setSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  // Debounce the search input
  React.useEffect(() => {
    const handler = debounce((nextValue) => {
      setDebouncedSearch(nextValue);
    }, 300);

    handler(search);

    // Cleanup function to clear the timeout
    return () => {
      handler.cancel();
    };
  }, [search]);

  // Fetch concepts based on the debounced search
  React.useEffect(() => {
    const fetchConcepts = async () => {
      try {
        setLoading(true);
        const data = await apiService.getConcepts({ search: debouncedSearch });
        setConcepts(data.rows);
      } catch (error) {
        console.error("Error fetching concepts:", error);
      } finally {
        setLoading(false);
      }
    };

    if (debouncedSearch?.length > 2) {
      fetchConcepts();
    }
  }, [debouncedSearch]);

  return (
    <Autocomplete
      inputValue={search}
      onInputChange={(_, newInputValue) => {
        setSearch(newInputValue);
      }}
      multiple
      options={concepts}
      getOptionLabel={(concept) => concept.display_name + ` (${concept.id})`}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      value={value}
      onChange={onChange}
      style={{ marginTop: "8px", marginBottom: "4px" }}
      noOptionsText={
        loading
          ? "Loading..."
          : search.length < 2
          ? "Need min of 3 chars to search"
          : "No concepts found"
      }
      renderInput={(params) => (
        <TextField
          {...params}
          variant="standard"
          label={label}
          placeholder={placeholder}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      filterOptions={(x) => x}
      {...props}
    />
  );
}

export default function ConceptFormDialog({
  open,
  canEdit,
  afterSuccess,
  handleClose,
  concept,
}) {
  const showSnackbar = useSnackbar();

  const [displayName, setDisplayName] = React.useState(
    concept?.display_name || ""
  );
  const [description, setDescription] = React.useState(
    concept?.description || ""
  );
  const [alternateNames, setAlternateNames] = React.useState(
    concept?.alternate_names?.join(", ") || ""
  );
  const [parents, setParents] = React.useState(concept.parents || []);
  const [childs, setChilds] = React.useState(concept.children || []);

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const progress = React.useMemo(() => {
    const added = [
      !!displayName,
      !!description,
      !!parents?.length,
      !!childs?.length,
      !!alternateNames,
    ].filter((value) => value).length;

    return Math.round((added / 5) * 100);
  }, [displayName, description, parents, childs, alternateNames]);

  const onSubmit = async (event) => {
    try {
      event.preventDefault();
      const parent_ids = parents.map((parent) => parent.id);
      const child_ids = childs.map((child) => child.id);
      const alternate_names = alternateNames
        .split(",")
        .map((name) => name.trim())
        .filter((name) => name);

      const conceptPayload = {
        ...concept,
        display_name: displayName,
        description,
        parent_ids,
        child_ids,
        alternate_names,
      };

      if (!conceptPayload.display_name) {
        throw new Error("Display Name is required");
      }

      if (!conceptPayload.description) {
        throw new Error("Description is required");
      }

      if (conceptPayload.parent_ids?.length) {
        if (conceptPayload.parent_ids.some((id) => conceptPayload.id === id)) {
          throw new Error("Concept cannot be parent of itself");
        }

        if (
          conceptPayload.child_ids?.length &&
          conceptPayload.parent_ids.some((id) =>
            conceptPayload.child_ids.includes(id)
          )
        ) {
          throw new Error("Concept cannot be parent and child of each other");
        }
      }

      if (conceptPayload.child_ids?.length) {
        if (conceptPayload.child_ids.some((id) => conceptPayload.id === id)) {
          throw new Error("Concept cannot be child of itself");
        }

        if (
          conceptPayload.parent_ids?.length &&
          conceptPayload.child_ids.some((id) =>
            conceptPayload.parent_ids.includes(id)
          )
        ) {
          throw new Error("Concept cannot be parent and child of each other");
        }
      }

      setLoading(true);
      if (concept?.id) {
        await apiService.updateConcept(conceptPayload);
      } else {
        await apiService.addConcept(conceptPayload);
      }

      await afterSuccess();
      showSnackbar(
        `Concept "${conceptPayload.display_name}" ${
          concept.id ? "updated" : "added"
        }  successfully`,
        "success"
      );
      setLoading(false);
    } catch (error) {
      console.error("Error submitting concept form", error);
      setLoading(false);
      setError(error?.response?.data?.message || error?.message);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      PaperProps={{
        component: "form",
        noValidate: true,
        onSubmit,
      }}
    >
      {loading ? <Loading /> : null}
      <DialogTitle>
        {concept?.id
          ? `${canEdit ? "Edit" : "View"} Concept - ${displayName}`
          : "Create Concept"}
      </DialogTitle>
      <DialogContent>
        {canEdit ? (
          <Box sx={{ width: "100%" }}>
            <LinearProgressWithLabel value={progress} />
          </Box>
        ) : null}
        <TextField
          InputProps={{ readOnly: !canEdit }}
          required
          margin="dense"
          id="displayName"
          name="displayName"
          label="Display Name"
          fullWidth
          variant="standard"
          value={displayName}
          onChange={(event) => setDisplayName(event.target.value)}
          onBlur={(event) => {
            const value = event.target.value.trim();
            if (value) {
              setDisplayName(value);
            }
          }}
        />
        <TextField
          InputProps={{ readOnly: !canEdit }}
          required
          margin="dense"
          id="description"
          name="description"
          label="Description"
          fullWidth
          variant="standard"
          multiline
          rows={3}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          onBlur={(event) => {
            const value = event.target.value.trim();
            if (value) {
              setDescription(value);
            }
          }}
        />
        <ConceptsAutoComplete
          id="parent-tags"
          readOnly={!canEdit}
          value={parents}
          onChange={(_, newValue) => {
            setParents(newValue);
          }}
          label="Parents"
          placeholder="Add Parents"
          style={{ marginTop: "8px", marginBottom: "8px" }}
          getOptionDisabled={(option) =>
            concept?.id === option?.id ||
            childs?.some((child) => child?.id === option?.id)
          }
        />
        <ConceptsAutoComplete
          id="childs-tags"
          readOnly={!canEdit}
          getOptionDisabled={(option) =>
            concept?.id === option?.id ||
            parents?.some((parent) => parent?.id === option?.id)
          }
          value={childs}
          onChange={(_, newValue) => {
            setChilds(newValue);
          }}
          label="Children"
          placeholder="Add Children"
        />
        <TextField
          InputProps={{ readOnly: !canEdit }}
          margin="dense"
          id="alternateNames"
          name="alternateNames"
          label="Alternate Names"
          fullWidth
          variant="standard"
          value={alternateNames}
          onChange={(event) => setAlternateNames(event.target.value)}
          onBlur={(event) => {
            const value = event.target.value.trim();
            const names = value.split(",");

            if (names.length > 0) {
              setAlternateNames(
                names
                  .map((name) => name?.trim())
                  .filter((name) => name)
                  .join(", ")
              );
            }
          }}
        />
        <Collapse in={!!error}>
          <Alert severity="error" onClose={() => setError()}>
            <AlertTitle>Error</AlertTitle>
            {error}
          </Alert>
        </Collapse>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        {canEdit ? (
          <Button type="submit" variant="contained" color="primary">
            {concept?.id ? "Update" : "Add"}
          </Button>
        ) : null}
      </DialogActions>
    </Dialog>
  );
}
