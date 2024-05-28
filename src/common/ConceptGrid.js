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
  TablePagination,
  TableSortLabel,
} from "@mui/material";
import MoreMenu from "./MoreMenu";
import ConceptFormDialog from "./ConceptFormDialog";
import apiService from "../api/concepts";
import Loading from "./Loading";
import { useSnackbar } from "../contexts/SnackbarContext";
import { useAuth } from "../contexts/AuthContext";
import { ROLES } from "../constants";
import { visuallyHidden } from "@mui/utils";

const sortableHeaderCells = [
  { id: "id", label: "Concept ID", disablePadding: true, numeric: true },
  { id: "display_name", label: "Display Name", disablePadding: false },
];

const unsortableHeaderCells = [
  { id: "description", label: "Description" },
  { id: "parent_ids", label: "Parent IDs", numeric: true },
  { id: "child_ids", label: "Child IDs", numeric: true },
  { id: "alternate_names", label: "Alternate Names" },
];

const ConceptGrid = () => {
  const { role } = useAuth();
  const showSnackbar = useSnackbar();
  const [concepts, setConcepts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");

  const [loading, setLoading] = useState(true);
  const [selectedConcept, setSelectedConcept] = useState();
  const canEdit = role === ROLES.ADMIN || role === ROLES.EDITOR;

  const fetchConcepts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiService.getConcepts({
        page: page + 1,
        perPage,
        sortBy,
        sortOrder,
      });
      setConcepts(data.rows);
      setTotalCount(Number(data.totalCount));
    } catch (error) {
      showSnackbar("Error fetching concepts", "error");
    } finally {
      setLoading(false);
    }
  }, [showSnackbar, page, perPage, sortBy, sortOrder]);

  // API call to fetch concepts from the database
  useEffect(() => {
    fetchConcepts();
  }, [fetchConcepts]);

  const onDeleteConcept = async (row) => {
    try {
      setLoading(true);
      await apiService.deleteConcept(row.id);
      await fetchConcepts();
      showSnackbar(
        `Concept "${row.display_name}" deleted successfully`,
        "success"
      );
    } catch (error) {
      showSnackbar(`Error deleting concept "${row.display_name}"`, "error");
    } finally {
      setLoading(false);
    }
  };

  const onEditConceptClick = (concept) => {
    setSelectedConcept(concept);
  };

  const onFormClose = async () => {
    await fetchConcepts();
    setSelectedConcept();
  };

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const createSortHandler = (property) => (event) => {
    handleRequestSort(event, property);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = sortBy === property && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortBy(property);
  };

  return (
    <div>
      {loading ? <Loading /> : null}
      {selectedConcept && (
        <ConceptFormDialog
          open={!!selectedConcept}
          afterSuccess={onFormClose}
          handleClose={() => setSelectedConcept()}
          concept={selectedConcept}
          canEdit={canEdit}
        />
      )}
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h4">Concepts</Typography>
        <Box>
          {canEdit ? (
            <Button
              variant="contained"
              color="primary"
              onClick={() => setSelectedConcept({})}
            >
              + Add New Concept
            </Button>
          ) : null}
        </Box>
      </Box>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <TableContainer sx={{ maxHeight: "70vh", width: "90vw" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {sortableHeaderCells.map((headCell) => (
                  <TableCell
                    key={headCell.id}
                    align={headCell.numeric ? "right" : "left"}
                    padding={headCell.disablePadding ? "none" : "normal"}
                    sortDirection={sortBy === headCell.id ? sortOrder : false}
                  >
                    <TableSortLabel
                      active={sortBy === headCell.id}
                      direction={sortBy === headCell.id ? sortOrder : "asc"}
                      onClick={createSortHandler(headCell.id)}
                    >
                      {headCell.label}
                      {sortBy === headCell.id ? (
                        <Box component="span" sx={visuallyHidden}>
                          {sortOrder === "desc"
                            ? "sorted descending"
                            : "sorted ascending"}
                        </Box>
                      ) : null}
                    </TableSortLabel>
                  </TableCell>
                ))}
                {unsortableHeaderCells.map((headCell) => (
                  <TableCell
                    key={headCell.id}
                    align={headCell.numeric ? "right" : "left"}
                  >
                    {headCell.label}
                  </TableCell>
                ))}
                {canEdit ? <TableCell align="center">Actions</TableCell> : null}
              </TableRow>
            </TableHead>
            <TableBody>
              {concepts.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={() => onEditConceptClick(row)}
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell component="th" scope="row" align="right">
                    {row.id}
                  </TableCell>
                  <TableCell align="left">{row.display_name}</TableCell>
                  <TableCell align="left">{row.description}</TableCell>
                  <TableCell align="right">
                    {row.parents?.map(({ id }) => id)?.join(", ")}
                  </TableCell>
                  <TableCell align="right">
                    {row.children?.map(({ id }) => id)?.join(", ")}
                  </TableCell>
                  <TableCell align="right">
                    {row?.alternate_names?.join(", ")}
                  </TableCell>
                  {canEdit ? (
                    <TableCell align="center">
                      <MoreMenu
                        handleEdit={() => onEditConceptClick(row)}
                        handleDelete={() => onDeleteConcept(row)}
                      />
                    </TableCell>
                  ) : null}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 20, 30]}
          component="div"
          count={totalCount}
          rowsPerPage={perPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
};

export default ConceptGrid;
