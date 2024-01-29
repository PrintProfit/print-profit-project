// @ts-check
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

/**
 * @param {object} props
 * @param {Product[]} props.data
 * @param {import('@tanstack/react-table').ColumnDef<Product>[]} props.columns
 */
export function DataTable({ data, columns }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // This will be arranged the way it's supposed to later, but for now,
  // I can make this faster with normal tables.
  return (
    <Table>
      <TableHead>
        {table.getHeaderGroups().map((group) => (
          <TableRow key={group.id}>
            {group.headers.map((header) => (
              <TableCell key={header.id}>
                {header.isPlaceholder ||
                  flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableHead>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
