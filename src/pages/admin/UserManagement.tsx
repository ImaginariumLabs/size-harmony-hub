import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
  Alert,
  Snackbar,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Block as BlockIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/MockAuthContext';

// Mock data for demonstration
const mockUsers = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@example.com',
    role: 'admin',
    status: 'active',
    lastLogin: '2025-05-10 14:23:45',
    createdAt: '2025-01-01 10:00:00',
  },
  {
    id: '2',
    username: 'john.doe',
    email: 'john.doe@example.com',
    role: 'user',
    status: 'active',
    lastLogin: '2025-05-09 09:15:30',
    createdAt: '2025-01-15 11:30:00',
  },
  {
    id: '3',
    username: 'jane.smith',
    email: 'jane.smith@example.com',
    role: 'manager',
    status: 'active',
    lastLogin: '2025-05-10 11:45:22',
    createdAt: '2025-02-01 14:20:00',
  },
  {
    id: '4',
    username: 'bob.johnson',
    email: 'bob.johnson@example.com',
    role: 'user',
    status: 'inactive',
    lastLogin: '2025-04-15 16:30:45',
    createdAt: '2025-02-10 09:45:00',
  },
  {
    id: '5',
    username: 'alice.williams',
    email: 'alice.williams@example.com',
    role: 'user',
    status: 'active',
    lastLogin: '2025-05-08 13:20:10',
    createdAt: '2025-02-15 10:15:00',
  },
  {
    id: '6',
    username: 'charlie.brown',
    email: 'charlie.brown@example.com',
    role: 'viewer',
    status: 'active',
    lastLogin: '2025-05-07 10:10:10',
    createdAt: '2025-03-01 15:30:00',
  },
  {
    id: '7',
    username: 'david.miller',
    email: 'david.miller@example.com',
    role: 'user',
    status: 'suspended',
    lastLogin: '2025-04-01 09:05:30',
    createdAt: '2025-03-10 11:00:00',
  },
  {
    id: '8',
    username: 'emma.davis',
    email: 'emma.davis@example.com',
    role: 'manager',
    status: 'active',
    lastLogin: '2025-05-09 14:30:00',
    createdAt: '2025-03-15 13:45:00',
  },
  {
    id: '9',
    username: 'frank.jones',
    email: 'frank.jones@example.com',
    role: 'user',
    status: 'active',
    lastLogin: '2025-05-06 11:25:15',
    createdAt: '2025-04-01 09:30:00',
  },
  {
    id: '10',
    username: 'grace.taylor',
    email: 'grace.taylor@example.com',
    role: 'viewer',
    status: 'active',
    lastLogin: '2025-05-05 15:40:20',
    createdAt: '2025-04-10 14:15:00',
  },
];

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
  createdAt: string;
}

interface UserFormData {
  username: string;
  email: string;
  password: string;
  role: string;
  status: string;
}

const UserManagement: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    username: '',
    email: '',
    password: '',
    role: 'user',
    status: 'active',
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning',
  });

  useEffect(() => {
    // In a real implementation, this would fetch data from the server
    // For now, we're using mock data
    setUsers(mockUsers);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setUsers(mockUsers);
      setLoading(false);
    }, 1000);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  const handleOpenAddDialog = () => {
    setDialogMode('add');
    setFormData({
      username: '',
      email: '',
      password: '',
      role: 'user',
      status: 'active',
    });
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (user: User) => {
    setDialogMode('edit');
    setSelectedUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      password: '',
      role: user.role,
      status: user.status,
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
  };

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const name = event.target.name as keyof UserFormData;
    const value = event.target.value as string;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitForm = () => {
    // In a real implementation, this would send data to the server
    if (dialogMode === 'add') {
      // Add new user
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        username: formData.username,
        email: formData.email,
        role: formData.role,
        status: formData.status,
        lastLogin: 'Never',
        createdAt: new Date().toLocaleString(),
      };
      setUsers((prev) => [...prev, newUser]);
      setSnackbar({
        open: true,
        message: 'User added successfully',
        severity: 'success',
      });
    } else {
      // Edit existing user
      if (selectedUser) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === selectedUser.id
              ? {
                  ...u,
                  username: formData.username,
                  email: formData.email,
                  role: formData.role,
                  status: formData.status,
                }
              : u
          )
        );
        setSnackbar({
          open: true,
          message: 'User updated successfully',
          severity: 'success',
        });
      }
    }
    handleCloseDialog();
  };

  const handleOpenDeleteDialog = (user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const handleDeleteUser = () => {
    if (userToDelete) {
      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
      setSnackbar({
        open: true,
        message: 'User deleted successfully',
        severity: 'success',
      });
    }
    handleCloseDeleteDialog();
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return theme.palette.success.main;
      case 'inactive':
        return theme.palette.warning.main;
      case 'suspended':
        return theme.palette.error.main;
      default:
        return theme.palette.info.main;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircleIcon fontSize="small" />;
      case 'inactive':
        return <CancelIcon fontSize="small" />;
      case 'suspended':
        return <BlockIcon fontSize="small" />;
      default:
        return null;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    if (timestamp === 'Never') return 'Never';
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          User Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            size="small"
            placeholder="Search users..."
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
            sx={{ width: 250 }}
          />
          <Tooltip title="Refresh">
            <IconButton onClick={handleRefresh} disabled={loading}>
              {loading ? <CircularProgress size={24} /> : <RefreshIcon />}
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpenAddDialog}
          >
            Add User
          </Button>
        </Box>
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 'calc(100vh - 250px)' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Username</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Last Login</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.role.toUpperCase()}
                      size="small"
                      sx={{
                        backgroundColor:
                          user.role === 'admin'
                            ? theme.palette.primary.main
                            : user.role === 'manager'
                            ? theme.palette.secondary.main
                            : theme.palette.grey[500],
                        color: 'white',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={getStatusIcon(user.status)}
                      label={user.status.toUpperCase()}
                      size="small"
                      sx={{
                        backgroundColor: getStatusColor(user.status),
                        color: 'white',
                      }}
                    />
                  </TableCell>
                  <TableCell>{formatTimestamp(user.lastLogin)}</TableCell>
                  <TableCell>{formatTimestamp(user.createdAt)}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit">
                      <IconButton size="small" onClick={() => handleOpenEditDialog(user)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDeleteDialog(user)}
                        disabled={user.email === 'admin@example.com'} // Prevent deleting the admin user
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {filteredUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Add/Edit User Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{dialogMode === 'add' ? 'Add New User' : 'Edit User'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleFormChange}
              fullWidth
              required
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleFormChange}
              fullWidth
              required
            />
            {dialogMode === 'add' && (
              <TextField
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleFormChange}
                fullWidth
                required
              />
            )}
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                name="role"
                value={formData.role}
                onChange={handleFormChange}
                label="Role"
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="manager">Manager</MenuItem>
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="viewer">Viewer</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleFormChange}
                label="Status"
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="suspended">Suspended</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmitForm}
            variant="contained"
            color="primary"
            disabled={!formData.username || !formData.email || (dialogMode === 'add' && !formData.password)}
          >
            {dialogMode === 'add' ? 'Add User' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the user <strong>{userToDelete?.username}</strong>?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDeleteUser} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserManagement;
