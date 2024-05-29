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
  Skeleton,
  Tooltip,
} from "@mui/material";
import MoreMenu from "./MoreMenu";
import ConceptFormDialog from "./ConceptFormDialog";
import apiService from "../api/concepts";
import { useSnackbar } from "../contexts/SnackbarContext";
import { useAuth } from "../contexts/AuthContext";
import { visuallyHidden } from "@mui/utils";
import SearchInput from "./SearchInput";
import StyledTableRow from "./StyledTableRow";
import { canManageConcepts } from "../utils";

const sortableHeaderCells = [
  {
    id: "id",
    label: "Concept ID",
    disablePadding: true,
    numeric: true,
    width: 100,
  },
  {
    id: "display_name",
    label: "Display Name",
    disablePadding: false,
    numeric: false,
    width: 200,
  },
];

const unsortableHeaderCells = [
  { id: "description", label: "Description", numeric: false, width: 300 },
  { id: "parent_ids", label: "Parent IDs", numeric: true, width: 200 },
  { id: "child_ids", label: "Child IDs", numeric: true, width: 200 },
  {
    id: "alternate_names",
    label: "Alternate Names",
    numeric: false,
    width: 200,
  },
];

const ConceptIdsWithTooltip = ({ concepts }) => {
  return (
    <Tooltip
      title={
        <div style={{ whiteSpace: "pre-line" }}>
          {concepts
            ?.map(({ id, display_name }) => `${display_name} (${id})`)
            ?.join("\n")}
        </div>
      }
    >
      <span>
        {concepts?.map(({ id }) => id)?.join(", ")}
      </span>
    </Tooltip>
  );
};

const ConceptGrid = () => {
  const { role } = useAuth();
  const showSnackbar = useSnackbar();
  const [concepts, setConcepts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [selectedConcept, setSelectedConcept] = useState();
  const canEdit = canManageConcepts(role);

  const fetchConcepts = useCallback(async () => {
    try {
      if (search.length && search.length < 3) {
        return;
      }

      setLoading(true);
      const data = await apiService.getConcepts({
        page: page + 1,
        perPage,
        sortBy,
        sortOrder,
        search,
      });
      setConcepts(data.rows);
      setTotalCount(Number(data.totalCount));
    } catch (error) {
      showSnackbar("Error fetching concepts", "error");
    } finally {
      setLoading(false);
    }
  }, [showSnackbar, page, perPage, sortBy, sortOrder, search]);

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

  const handleRequestSort = (_event, property) => {
    const isAsc = sortBy === property && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortBy(property);
  };

  return (
    <div>
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
        <Box display="flex" alignItems="center">
          <SearchInput
            placeholder="Search Concepts"
            onSearch={setSearch}
            sx={{ width: 300, marginRight: canEdit ? 2 : 0 }}
          />
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
                    width={headCell.width}
                  >
                    <TableSortLabel
                      active={sortBy === headCell.id}
                      direction={sortBy === headCell.id ? sortOrder : "asc"}
                      onClick={createSortHandler(headCell.id)}
                      sx={{ textDecoration: "underline" }}
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
                    width={headCell.width}
                  >
                    {headCell.label}
                  </TableCell>
                ))}
                {canEdit ? <TableCell align="center">Actions</TableCell> : null}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                Array.from(new Array(10)).map((_, index) => (
                  <TableRow key={index} sx={{ padding: "16px" }}>
                    <TableCell colSpan={8}>
                      <Skeleton animation="wave" height={24} />
                    </TableCell>
                  </TableRow>
                ))
              ) : concepts?.length ? (
                concepts.map((row) => (
                  <StyledTableRow
                    key={row.id}
                    onClick={() => onEditConceptClick(row)}
                  >
                    <TableCell component="th" scope="row" align="right">
                      {row.id}
                    </TableCell>
                    {/* Use ellipsis */}
                    <TableCell align="left">{row.display_name}</TableCell>
                    <TableCell
                      align="left"
                      sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: 300,
                      }}
                    >
                      {row.description}
                    </TableCell>
                    <TableCell align="right">
                      <ConceptIdsWithTooltip concepts={row.parents} />
                    </TableCell>
                    <TableCell align="right">
                      <ConceptIdsWithTooltip concepts={row.children} />
                    </TableCell>
                    <TableCell align="left">
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
                  </StyledTableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No concepts found
                  </TableCell>
                </TableRow>
              )}
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
