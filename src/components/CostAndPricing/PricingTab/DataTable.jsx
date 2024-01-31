// @ts-check
import { Paper, TableCell, Unstable_Grid2 as Grid } from '@mui/material';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

/**
 * @param {object} props
 * @param {Product[]} props.data
 * @param {ProductColumnDef[]} props.columns
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
    <Paper>
      <Grid container>
        {/*
        This is how you get the header groups in tanstack tables. It's needed
        to get the header groups in general, but it's pretty likely that the
        table won't actually support having multiple header groups.
        */}
        {table.getHeaderGroups().map((group) => (
          <Grid container direction="column" key={group.id}>
            {/*
            This is how you get the headers within a group for tanstack tables.
            We can just map them into table cells.
            */}
            {group.headers.map((header) => (
              <TableCell key={header.id}>
                {header.isPlaceholder ||
                  flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
              </TableCell>
            ))}
          </Grid>
        ))}
        {/*
        This is how we get each row in tanstack tables.
        */}
        {table.getRowModel().rows.map((row) => (
          <Grid container direction="column" key={row.id}>
            {/*
            This is how we get the cells via tanstack tables
            */}
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {/*
                flexRender is what renders the cell
                i don't know 100% how this works honestly
                */}
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}
