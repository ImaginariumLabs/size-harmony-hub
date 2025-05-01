import React, { useCallback, useRef, useState, useEffect } from 'react';
import { FixedSizeList as List } from 'react-window';
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
  useTheme,
  useMediaQuery
} from '@mui/material';

interface Column<T> {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: any, row?: T) => React.ReactNode;
  accessor: (row: T) => any;
}

interface VirtualizedTableProps<T> {
  columns: Column<T>[];
  data: T[];
  rowHeight?: number;
  maxHeight?: number;
  headerHeight?: number;
  emptyMessage?: string;
  getRowId: (row: T) => string | number;
}

/**
 * VirtualizedTable Component
 *
 * A table component that uses virtualization to efficiently render large datasets
 */
function VirtualizedTable<T>({
  columns,
  data,
  rowHeight = 53,
  maxHeight = 600,
  headerHeight = 56,
  emptyMessage = 'No data available',
  getRowId
}: VirtualizedTableProps<T>) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const tableRef = useRef<HTMLDivElement>(null);
  const [tableWidth, setTableWidth] = useState(0);

  // Update table width on resize
  useEffect(() => {
    const updateWidth = () => {
      if (tableRef.current) {
        setTableWidth(tableRef.current.offsetWidth);
      }
    };

    // Initial width
    updateWidth();

    // Add resize listener
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Calculate the actual height to use (limited by data length)
  const calculatedHeight = Math.min(
    maxHeight,
    data.length * rowHeight + headerHeight
  );

  // Render an individual row
  const Row = useCallback(
    ({ index, style }: { index: number; style: React.CSSProperties }) => {
      const row = data[index];
      return (
        <TableRow
          component="div"
          style={{
            ...style,
            display: 'flex',
            alignItems: 'center',
            boxSizing: 'border-box',
          }}
          hover
          key={getRowId(row)}
        >
          {columns.map((column) => {
            const value = column.accessor(row);
            const cellWidth = column.minWidth || tableWidth / columns.length;

            return (
              <TableCell
                component="div"
                key={column.id}
                align={column.align || 'left'}
                style={{
                  width: cellWidth,
                  minWidth: cellWidth,
                  maxWidth: cellWidth,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: column.align === 'right' ? 'flex-end' :
                                 column.align === 'center' ? 'center' : 'flex-start',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  boxSizing: 'border-box',
                }}
              >
                {column.format ? column.format(value, row) : value}
              </TableCell>
            );
          })}
        </TableRow>
      );
    },
    [columns, data, getRowId, tableWidth]
  );

  // Empty state
  if (data.length === 0) {
    return (
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            {emptyMessage}
          </Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer ref={tableRef} component={Paper} sx={{ maxHeight }}>
        <Table component="div" stickyHeader aria-label="virtualized table">
          <TableHead component="div" style={{ display: 'block' }}>
            <TableRow
              component="div"
              style={{
                display: 'flex',
                width: '100%',
                height: headerHeight,
              }}
            >
              {columns.map((column) => {
                const cellWidth = column.minWidth || tableWidth / columns.length;

                return (
                  <TableCell
                    component="div"
                    key={column.id}
                    align={column.align || 'left'}
                    style={{
                      width: cellWidth,
                      minWidth: cellWidth,
                      maxWidth: cellWidth,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: column.align === 'right' ? 'flex-end' :
                                     column.align === 'center' ? 'center' : 'flex-start',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      boxSizing: 'border-box',
                      fontWeight: 'bold',
                    }}
                  >
                    {column.label}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>

          <TableBody
            component="div"
            style={{
              display: 'block',
              height: calculatedHeight - headerHeight,
            }}
          >
            {tableWidth > 0 && (
              <List
                height={calculatedHeight - headerHeight}
                width="100%"
                itemCount={data.length}
                itemSize={rowHeight}
                overscanCount={5}
              >
                {Row}
              </List>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default VirtualizedTable;
