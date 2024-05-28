import React, { useCallback, useEffect, useRef, useState } from 'react';
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
  TablePagination,
  Button,
  Skeleton,
} from '@mui/material';
import userApiService from '../api/users';
import { useSnackbar } from '../contexts/SnackbarContext';
import ChangeRoleDialog from './ChangeRoleDialog';
import { ROLENAMES } from '../constants';
import StyledTableRow from './StyledTableRow';

const UserGrid = () => {
  const showSnackbar = useSnackbar();
  const [users, setUsers] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(true);
  const paginationToken = useRef(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await userApiService.getUsers({ page: page + 1, limit, paginationToken });
      setUsers(data.users);
      paginationToken.current = data?.paginationToken;
      setTotalCount(Number(data.totalCount));
    } catch (error) {
      showSnackbar('Error fetching users', 'error');
    } finally {
      setLoading(false);
    }
  }, [showSnackbar, page, limit]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const onRoleChange = async () => {
    await fetchUsers();
    setSelectedUser(null);
  };

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setLimit(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div>
      {selectedUser ? (
        <ChangeRoleDialog
          user={selectedUser}
          open={!!selectedUser}
          handleClose={() => setSelectedUser(null)}
          afterChange={onRoleChange}
        />
      ) : null}
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h4">Users</Typography>
      </Box>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer sx={{ maxHeight: '70vh', width: '70vw' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>User Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Actions</TableCell>
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
              ) : users?.length ? (
                users.map((user) => (
                  <StyledTableRow
                    key={user.userName}
                    onClick={() => setSelectedUser(user)}
                  >
                    <TableCell>{user.userName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{ROLENAMES[user.role] || "None"}</TableCell>
                    <TableCell>
                      <Button
                        variant="text"
                        color="primary"
                        onClick={() => setSelectedUser(user)}
                      >
                        Change Role
                      </Button>
                    </TableCell>
                  </StyledTableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No users found
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
          rowsPerPage={limit}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
};

export default UserGrid;
