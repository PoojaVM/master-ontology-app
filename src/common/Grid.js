import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import MoreMenu from "./MoreMenu";
import ConceptFormDialog from "./ConceptFormDialog";

// Sample data - to be replaced by data from API call to DynamoDB
const data = [
  {
    id: 1,
    display_name: "Diagnosis",
    description: "Entity domain",
    parent_ids: null,
    child_ids: [2, 3],
    alternate_names: null,
  },
  {
    id: 2,
    display_name: "Disease of Nervous System",
    description: "Diseases targeting the nervous system",
    parent_ids: [1],
    child_ids: [4],
    alternate_names: null,
  },
  {
    id: 3,
    display_name: "Disease of Eye",
    description: "Diseases targeting the eye",
    parent_ids: [1],
    child_ids: [8, 9],
    alternate_names: null,
  },
  {
    id: 4,
    display_name: "Physical Disorders",
    description: "Physical Disorders",
    parent_ids: [1],
    child_ids: [8, 9],
    alternate_names: null,
  },
  {
    id: 5,
    display_name: "Multiple Sclerosis (MS)",
    description: "Multiple Sclerosis",
    parent_ids: [2, 4],
    child_ids: [5, 6, 7],
    alternate_names: ["MS", "name1", "name2"],
  },
];

const Grid = () => {
  const [conceptToBeEdited, setConceptToBeEdited] = React.useState();
  const onDeleteConcept = (id) => {
    // Add logic to delete concept from the database
    console.log(`Deleting concept with ID: ${id}`);
  };

  // const onEditConcept = (concept) => {
  //   // Add logic to edit concept
  //   console.log(`Editing concept with ID: ${concept.id}`);
  // };

  const onEditConceptClick = (concept) => {
    setConceptToBeEdited(concept);
  };

  return (
    <div>
      {conceptToBeEdited && (
        <ConceptFormDialog
          open={!!conceptToBeEdited}
          handleClose={() => setConceptToBeEdited()}
          concept={conceptToBeEdited}
          concepts={data}
        />
      )}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Concept ID</TableCell>
              <TableCell align="right">Display Name</TableCell>
              <TableCell align="right">Description</TableCell>
              <TableCell align="right">Parent Concept IDs</TableCell>
              <TableCell align="right">Child Concept IDs</TableCell>
              <TableCell align="right">Alternate Names</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow
                key={row.id}
                onClick={() => onEditConceptClick(row)}
                sx={{ cursor: "pointer" }}
              >
                <TableCell component="th" scope="row">
                  {row.id}
                </TableCell>
                <TableCell align="right">{row.display_name}</TableCell>
                <TableCell align="right">{row.description}</TableCell>
                <TableCell align="right">{row.parent_ids?.join(", ")}</TableCell>
                <TableCell align="right">{row.child_ids?.join(", ")}</TableCell>
                <TableCell align="right">
                  {row?.alternate_names?.join(", ")}
                </TableCell>
                <TableCell align="center">
                  <MoreMenu
                    handleEdit={() => onEditConceptClick(row)}
                    handleDelete={() => onDeleteConcept(row.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Grid;
