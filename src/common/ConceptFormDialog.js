import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Autocomplete from "@mui/material/Autocomplete";
import { Alert, AlertTitle, Box, Collapse } from "@mui/material";
import Loading from "./Loading";
import { useSnackbar } from "../contexts/SnackbarContext";
import LinearProgressWithLabel from "./LinearProgressWithLabel";

const filterConcepts = (concepts, conceptIds) => {
  return (
    conceptIds
      ?.map((conceptId) => concepts.find((concept) => concept.id === conceptId))
      ?.filter((concept) => concept) || []
  );
};

export default function ConceptFormDialog({
  open,
  handleClose,
  concept,
  concepts: conceptList = [],
}) {
  const showSnackbar = useSnackbar();
  const concepts = React.useMemo(() => {
    return conceptList.filter((c) => c.id !== concept?.id);
  }, [conceptList, concept]);

  const [displayName, setDisplayName] = React.useState(
    concept?.display_name || ""
  );
  const [description, setDescription] = React.useState(
    concept?.description || ""
  );
  const [alternateNames, setAlternateNames] = React.useState(
    concept?.alternate_names?.join(", ") || ""
  );
  const [parents, setParents] = React.useState(
    filterConcepts(concepts, concept?.parent_ids) || []
  );
  const [childs, setChilds] = React.useState(
    filterConcepts(concepts, concept?.child_ids) || []
  );

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

  const onSubmit = (event) => {
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
        // Update
        console.log("Update Concept", conceptPayload);
      } else {
        // Create
        console.log("Create Concept", conceptPayload);
      }

      showSnackbar("Concept saved successfully", "success");
      setLoading(false);
      handleClose(true);
    } catch (error) {
      console.error("Error submitting concept form", error);
      setLoading(false);
      setError(error.message);
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
        {concept?.id ? `Edit Concept - ${displayName}` : "Create Concept"}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ width: "100%" }}>
          <LinearProgressWithLabel value={progress} />
        </Box>
        <TextField
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
        <Autocomplete
          multiple
          id="parent-tags"
          options={concepts}
          getOptionLabel={(concept) =>
            concept.display_name + ` (${concept.id})`
          }
          getOptionDisabled={(option) =>
            concept?.id === option?.id ||
            childs?.some((child) => child?.id === option?.id)
          }
          value={parents}
          onChange={(_, newValue) => {
            setParents(newValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              label="Parents"
              placeholder="Add Parents"
            />
          )}
          style={{ marginTop: "8px", marginBottom: "8px" }}
        />
        <Autocomplete
          multiple
          id="childs-tags"
          options={concepts}
          getOptionLabel={(concept) =>
            concept.display_name + ` (${concept.id})`
          }
          getOptionDisabled={(option) =>
            concept?.id === option?.id ||
            parents?.some((parent) => parent?.id === option?.id)
          }
          value={childs}
          onChange={(_, newValue) => {
            setChilds(newValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              label="Children"
              placeholder="Add Children"
            />
          )}
          style={{ marginTop: "8px", marginBottom: "4px" }}
        />
        <TextField
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
        <Button type="submit">{concept?.id ? "Save" : "Create"}</Button>
      </DialogActions>
    </Dialog>
  );
}
