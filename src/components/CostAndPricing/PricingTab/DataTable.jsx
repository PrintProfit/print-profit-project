// @ts-check
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  Unstable_Grid2 as Grid,
  styled,
} from '@mui/material';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

/**
 * @param {import('./prop-types').DataTableProps} props
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
    <TableContainer component={Paper}>
      <Grid container component={Table}>
        <Grid container component={TableHead}>
          {/*
            This is how you get the header groups in tanstack tables. It's needed
            to get the header groups in general, but it's pretty likely that the
            table won't actually support having multiple header groups.
            */}
          {table.getHeaderGroups().map((group) => (
            <Grid
              container
              direction="column"
              component={TableRow}
              key={group.id}
            >
              {/*
                This is how you get the headers within a group for tanstack tables.
                We can just map them into table cells.
                */}
              {group.headers.map((header) => (
                <TableCell sx={{ flexGrow: 1 }} size="small" key={header.id}>
                  {header.isPlaceholder ||
                    flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                </TableCell>
              ))}
            </Grid>
          ))}
        </Grid>
        <Grid container component={TableBody}>
          {/*
            This is how we get each row in tanstack tables.
            */}
          {table.getRowModel().rows.map((row) => (
            <Grid
              container
              direction="column"
              component={TableRow}
              key={row.id}
            >
              {/*
                This is how we get the cells via tanstack tables
                */}
              {row.getVisibleCells().map((cell) => (
                <TableCell size="small" key={cell.id}>
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
        <Grid container component={TableFooter}>
          {table.getFooterGroups().map((group) => (
            <Grid
              container
              direction="column"
              component={TableRow}
              key={group.id}
            >
              {group.headers.map((footer) => (
                <TableCell size="small" key={footer.id}>
                  {flexRender(
                    footer.column.columnDef.footer,
                    footer.getContext(),
                  )}
                </TableCell>
              ))}
            </Grid>
          ))}
        </Grid>
      </Grid>
    </TableContainer>
  );
}

const GridHeaderCell = styled(TableCell)(({ theme }) => ({
  // padding: theme.spacing(1),
  // textAlign: 'center',
  flexGrow: 1,
}));
