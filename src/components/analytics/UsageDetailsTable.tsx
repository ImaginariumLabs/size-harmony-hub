import React, { useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Typography,
  Chip,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';

interface UsageDetail {
  id: string;
  timestamp: string;
  user: string;
  provider: string;
  endpoint: string;
  model: string;
  requestTokens: number;
  responseTokens: number;
  cost: number;
  responseTime: number;
  status: 'success' | 'error' | 'timeout';
  errorMessage?: string;
}

interface UsageDetailsTableProps {
  data: UsageDetail[];
  title?: string;
}

type Order = 'asc' | 'desc';

interface HeadCell {
  id: keyof UsageDetail;
  label: string;
  numeric: boolean;
  sortable: boolean;
  format?: (value: any) => React.ReactNode;
}

const headCells: HeadCell[] = [
  { id: 'timestamp', label: 'Timestamp', numeric: false, sortable: true, 
    format: (value) => new Date(value).toLocaleString() },
  { id: 'user', label: 'User', numeric: false, sortable: true },
  { id: 'provider', label: 'Provider', numeric: false, sortable: true },
  { id: 'endpoint', label: 'Endpoint', numeric: false, sortable: true },
  { id: 'model', label: 'Model', numeric: false, sortable: true },
  { id: 'requestTokens', label: 'Request Tokens', numeric: true, sortable: true },
  { id: 'responseTokens', label: 'Response Tokens', numeric: true, sortable: true },
  { id: 'cost', label: 'Cost', numeric: true, sortable: true, 
    format: (value) => `$${value.toFixed(4)}` },
  { id: 'responseTime', label: 'Response Time', numeric: true, sortable: true, 
    format: (value) => `${value} ms` },
  { id: 'status', label: 'Status', numeric: false, sortable: true, 
    format: (value) => {
      let color = 'default';
      if (value === 'success') color = 'success';
      if (value === 'error') color = 'error';
      if (value === 'timeout') color = 'warning';
      
      return <Chip label={value} color={color as any} size="small" />;
    }
  },
];

function getComparator<Key extends keyof UsageDetail>(
  order: Order,
  orderBy: Key,
): (a: UsageDetail, b: UsageDetail) => number {
  return order === 'desc'
    ? (a, b) => {
        if (b[orderBy] < a[orderBy]) return -1;
        if (b[orderBy] > a[orderBy]) return 1;
        return 0;
      }
    : (a, b) => {
        if (a[orderBy] < b[orderBy]) return -1;
        if (a[orderBy] > b[orderBy]) return 1;
        return 0;
      };
}

const UsageDetailsTable: React.FC<UsageDetailsTableProps> = ({
  data,
  title = 'Usage Details',
}) => {
  const [order, setOrder] = useState<Order>('desc');
  const [orderBy, setOrderBy] = useState<keyof UsageDetail>('timestamp');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleRequestSort = (property: keyof UsageDetail) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Avoid a layout jump when reaching the last page with empty rows
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      data
        .slice()
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [data, order, orderBy, page, rowsPerPage],
  );

  return (
    <Box sx={{ width: '100%' }}>
      {title && (
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
      )}
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="medium">
            <TableHead>
              <TableRow>
                {headCells.map((headCell) => (
                  <TableCell
                    key={headCell.id}
                    align={headCell.numeric ? 'right' : 'left'}
                    sortDirection={orderBy === headCell.id ? order : false}
                  >
                    {headCell.sortable ? (
                      <TableSortLabel
                        active={orderBy === headCell.id}
                        direction={orderBy === headCell.id ? order : 'asc'}
                        onClick={() => handleRequestSort(headCell.id)}
                      >
                        {headCell.label}
                        {orderBy === headCell.id ? (
                          <Box component="span" sx={visuallyHidden}>
                            {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                          </Box>
                        ) : null}
                      </TableSortLabel>
                    ) : (
                      headCell.label
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleRows.map((row) => (
                <TableRow
                  hover
                  key={row.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  {headCells.map((headCell) => (
                    <TableCell
                      key={headCell.id}
                      align={headCell.numeric ? 'right' : 'left'}
                    >
                      {headCell.format ? headCell.format(row[headCell.id]) : row[headCell.id]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={headCells.length} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default UsageDetailsTable;
