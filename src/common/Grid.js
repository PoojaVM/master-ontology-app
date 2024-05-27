import React, { useCallback, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Button,
} from "@mui/material";
import MoreMenu from "./MoreMenu";
import ConceptFormDialog from "./ConceptFormDialog";
import apiService from "../api/concepts";
import Loading from "./Loading";
import { useSnackbar } from "../contexts/SnackbarContext";
import { useAuth } from "../contexts/AuthContext";
import  { ROLES } from "../constants";

const Grid = () => {
  const { role } = useAuth();
  const showSnackbar = useSnackbar();
  const [concepts, setConcepts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedConcept, setSelectedConcept] = useState();
  const canEdit = role === ROLES.ADMIN || role === ROLES.EDITOR;

  const fetchConcepts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiService.getConcepts();
      setConcepts(data);
    } catch (error) {
      showSnackbar("Error fetching concepts", "error");
    } finally {
      setLoading(false);
    }
  }
  , [showSnackbar]);

  // API call to fetch concepts from the database
  useEffect(() => {
    fetchConcepts();
  }, [fetchConcepts]);

  const onDeleteConcept = async (row) => {
    try {
      setLoading(true);
      await apiService.deleteConcept(row.id);
      await fetchConcepts();
      showSnackbar(`Concept "${row.display_name}" deleted successfully`, "success");
    } catch (error) {
      showSnackbar(`Error deleting concept "${row.display_name}"`, "error");
    } finally {
      setLoading(false);
    }
  };

  const onEditConceptClick = (concept) => {
    setSelectedConcept(concept);
  };

  const onFormClose = (saved = false) => {
    if (saved) {
      // Add logic to fetch concepts from the database again
      console.log("Fetching concepts from the database");
    }
    setSelectedConcept();
  };



  return (
    <div>
      {
        loading ? <Loading /> : null
      }
      {selectedConcept && (
        <ConceptFormDialog
          open={!!selectedConcept}
          handleClose={onFormClose}
          concept={selectedConcept}
          concepts={concepts}
        />
      )}
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h4">Concepts</Typography>{
          canEdit ? (
            <Button
              variant="contained"
              color="primary"
              onClick={() => setSelectedConcept({})}
            >
              + Add New Concept
            </Button>
          ) : null
        }
      </Box>
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
              {
                canEdit ? (
                  <TableCell align="center">Actions</TableCell>
                ) : null
              }
            </TableRow>
          </TableHead>
          <TableBody>
            {concepts.map((row) => (
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
                <TableCell align="right">
                  {row.parent_ids?.join(", ")}
                </TableCell>
                <TableCell align="right">{row.child_ids?.join(", ")}</TableCell>
                <TableCell align="right">
                  {row?.alternate_names?.join(", ")}
                </TableCell>
                {
                  canEdit ? (
                    <TableCell align="center">
                      <MoreMenu
                        handleEdit={() => onEditConceptClick(row)}
                        handleDelete={() => onDeleteConcept(row)}
                      />
                    </TableCell>
                  ) : null
                }
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Grid;
