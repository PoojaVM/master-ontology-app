import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Autocomplete from "@mui/material/Autocomplete";
import Loading from "./Loading";
import { Alert, AlertTitle, Collapse } from "@mui/material";

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

  const onSubmit = (event) => {
    try {
      event.preventDefault();
      const parent_ids = parents.map((parent) => parent.id).join(", ");
      const child_ids = childs.map((child) => child.id).join(", ");
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

      setError("Nothing configured yet");

      // setLoading(true);

      if (concept?.id) {
        // Update
        console.log("Update Concept", conceptPayload);
      } else {
        // Create
        console.log("Create Concept", conceptPayload);
      }
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
        onSubmit,
      }}
    >
      {loading ? <Loading /> : null}
      <DialogTitle>
        {concept?.id ? `Edit Concept - ${displayName}` : "Create Concept"}
      </DialogTitle>
      <DialogContent>
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
        <Collapse in={error}>
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
