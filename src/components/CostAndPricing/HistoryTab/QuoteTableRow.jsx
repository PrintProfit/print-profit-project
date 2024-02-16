import { Close as CloseIcon, Delete as DeleteIcon } from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  TableCell,
  TableRow,
  Tooltip,
} from '@mui/material';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import QuoteDetailsModal from './QuoteDetailsModal';

/**
 * @param {Object} props
 * @param {import('../PricingTab/data-types').Quote} props.row
 */
function QuoteTableRow({ row, setTab, ...props }) {
  const dispatch = useDispatch();
  console.log(row);

  // modal state
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const currentUser = useSelector((store) => store.user.currentUser);
  const companyId = currentUser.company_id;
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Opens Delete Dialog
  const handleDeleteClickOpen = () => {
    setOpenDelete(true);
  };

  // Closes Delete Dialog
  const handleDeleteClose = () => {
    setOpenDelete(false);
  };

  // formats inserted_at timestamp as readable string
  const stringifyDate = (timestamp) => {
    const date = new Date(timestamp);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const stringifiedDate = date.toLocaleDateString('en-us', options);
    return stringifiedDate;
  };

  // 🔥🔥🔥🔥🔥🔥 need some asynchronous requests here
  const deleteQuote = (rowId) => {
    console.log('You clicked delete! rowId is: ', rowId);
    dispatch({
      type: 'SAGA/DELETE_QUOTE',
      payload: {
        remove_quote: true,
        quote_id: rowId,
        id: currentUser.id,
        quote: row,
      },
    });
    handleDeleteClose();
    dispatch({
      type: 'SAGA/FETCH_QUOTE_HISTORY',
    });
  };

  // formats number string as US currency
  const USDollar = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  return (
    <TableRow
      key={row.id}
      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
    >
      <TableCell>
        <QuoteDetailsModal
          open={open}
          handleOpen={handleOpen}
          handleClose={handleClose}
          handleDeleteClickOpen={handleDeleteClickOpen}
          handleDeleteClose={handleDeleteClose}
          id={row.id}
          row={row}
          setTab={setTab}
          companyId={companyId}
        />
        <Button onClick={handleOpen} variant="contained" color="button">
          See details
        </Button>
      </TableCell>
      <TableCell variant="head" scope="row">
        {row.id}
      </TableCell>
      <TableCell>{row.name}</TableCell>
      <TableCell>{row.created_by}</TableCell>
      <TableCell>{stringifyDate(row.inserted_at)}</TableCell>
      <TableCell>{row.products?.length}</TableCell>
      <TableCell>
        {row.manual_total_selling_price
          ? USDollar.format(row.manual_total_selling_price)
          : USDollar.format(
              (row.products ?? []).reduce(
                (acc, product) => acc + (product?.total_selling_price ?? 0),
                0,
              ),
            )}
      </TableCell>
      <TableCell>
        {row.user_id === currentUser.id && (
          <Tooltip title="Delete quote">
            <IconButton onClick={handleDeleteClickOpen}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        )}
      </TableCell>

      {/* Delete Dialog */}
      <Dialog
        open={openDelete}
        onClose={handleDeleteClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {`Are you sure you want to permanently delete the ${row.name} quote?`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="error"
            onClick={() => deleteQuote(row.id)}
            autoFocus
            startIcon={<DeleteIcon />}
          >
            Delete
          </Button>
          <Button
            sx={{ color: 'black' }}
            onClick={handleDeleteClose}
            startIcon={<CloseIcon />}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </TableRow>
  );
}

export default QuoteTableRow;
