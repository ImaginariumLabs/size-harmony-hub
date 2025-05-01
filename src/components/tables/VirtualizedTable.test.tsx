import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import VirtualizedTable from './VirtualizedTable';

// Mock react-window to avoid issues with measuring in tests
vi.mock('react-window', () => ({
  FixedSizeList: ({ children, itemCount }: { children: any; itemCount: number }) => {
    const items = [];
    for (let i = 0; i < Math.min(itemCount, 10); i++) {
      items.push(children({ index: i, style: {} }));
    }
    return <div data-testid="virtualized-list">{items}</div>;
  }
}));

// Mock the useRef and useState hooks
vi.mock('react', async () => {
  const actual = await vi.importActual('react');
  return {
    ...actual,
    useRef: () => ({
      current: {
        offsetWidth: 1000,
      },
    }),
    useState: (initialValue: any) => {
      // For tableWidth, return 1000
      if (initialValue === 0) {
        return [1000, vi.fn()];
      }
      return [initialValue, vi.fn()];
    },
  };
});

describe('VirtualizedTable', () => {
  // Sample data for testing
  const testData = [
    { id: 1, name: 'John Doe', age: 30, role: 'Developer' },
    { id: 2, name: 'Jane Smith', age: 25, role: 'Designer' },
    { id: 3, name: 'Bob Johnson', age: 40, role: 'Manager' },
  ];

  // Sample columns for testing
  const columns = [
    {
      id: 'name',
      label: 'Name',
      accessor: (row: typeof testData[0]) => row.name,
    },
    {
      id: 'age',
      label: 'Age',
      align: 'right' as const,
      accessor: (row: typeof testData[0]) => row.age,
    },
    {
      id: 'role',
      label: 'Role',
      accessor: (row: typeof testData[0]) => row.role,
    },
  ];

  it('renders column headers correctly', () => {
    render(
      <VirtualizedTable
        columns={columns}
        data={testData}
        getRowId={(row) => row.id}
      />
    );

    // Check that all column headers are rendered
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
    expect(screen.getByText('Role')).toBeInTheDocument();
  });

  it('renders data rows correctly', () => {
    render(
      <VirtualizedTable
        columns={columns}
        data={testData}
        getRowId={(row) => row.id}
      />
    );

    // Check that all data is rendered
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
    expect(screen.getByText('Developer')).toBeInTheDocument();

    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('Designer')).toBeInTheDocument();

    expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
    expect(screen.getByText('40')).toBeInTheDocument();
    expect(screen.getByText('Manager')).toBeInTheDocument();
  });

  it('renders empty message when no data is provided', () => {
    render(
      <VirtualizedTable
        columns={columns}
        data={[]}
        getRowId={(row) => row.id}
        emptyMessage="No data available"
      />
    );

    // Check that the empty message is rendered
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  it('uses custom format function when provided', () => {
    const columnsWithFormat = [
      ...columns,
      {
        id: 'formatted',
        label: 'Formatted',
        accessor: (row: typeof testData[0]) => row.age,
        format: (value: number) => `${value} years old`,
      },
    ];

    render(
      <VirtualizedTable
        columns={columnsWithFormat}
        data={testData}
        getRowId={(row) => row.id}
      />
    );

    // Check that the formatted values are rendered
    expect(screen.getByText('30 years old')).toBeInTheDocument();
    expect(screen.getByText('25 years old')).toBeInTheDocument();
    expect(screen.getByText('40 years old')).toBeInTheDocument();
  });

  it('uses row in format function when needed', () => {
    const columnsWithRowFormat = [
      ...columns,
      {
        id: 'complex',
        label: 'Complex',
        accessor: (row: typeof testData[0]) => row.age,
        format: (value: number, row: typeof testData[0]) =>
          `${row.name} is ${value} years old`,
      },
    ];

    render(
      <VirtualizedTable
        columns={columnsWithRowFormat}
        data={testData}
        getRowId={(row) => row.id}
      />
    );

    // Check that the complex formatted values are rendered
    expect(screen.getByText('John Doe is 30 years old')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith is 25 years old')).toBeInTheDocument();
    expect(screen.getByText('Bob Johnson is 40 years old')).toBeInTheDocument();
  });
});
