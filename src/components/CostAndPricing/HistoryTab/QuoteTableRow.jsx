import {
  Backdrop,
  Box,
  Button,
  Fade,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

function QuoteDetailsModal({ open, row, handleClose, ...props }) {
  const dispatch = useDispatch();

  // const [open, setOpen] = React.useState(false)
  // const handleOpen = () => setOpen(true)
  // const handleClose = () => setOpen(false)
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
  console.log('props:', props);

  const sendToPricingTool = () => {
    dispatch({ type: 'SET_CURRENT_QUOTE', payload: row });
    dispatch({ type: 'SET_QUOTE_UPDATE_MODE', payload: true });
    handleClose();
  };

  return (
    <div>
      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableCell>{row.name}</TableCell>
                </TableBody>
              </Table>
            </TableContainer>
            <Button onClick={sendToPricingTool}>Open in Pricing Tool</Button>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}

function QuoteTableRow(props) {
  const row = props.row;

  // modal state
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // formats inserted_at timestamp as readable string
  const stringifyDate = (timestamp) => {
    const date = new Date(timestamp);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const stringifiedDate = date.toLocaleDateString('en-us', options);
    return stringifiedDate;
  };

  // sums the individual products' selling prices for a quote
  const sumQuoteSellingPrice = (row) => {
    let totalSellingPrice = 0;
    for (const product of row) {
      totalSellingPrice += product.total_selling_price;
    }
    return totalSellingPrice;
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
          id={row.id}
          row={row}
        />
        <Button onClick={handleOpen} variant="contained">
          See details
        </Button>
      </TableCell>
      <TableCell variant="head" scope="row">
        {row.id}
      </TableCell>
      <TableCell>{row.name}</TableCell>
      <TableCell>{row.created_by}</TableCell>
      <TableCell>{stringifyDate(row.inserted_at)}</TableCell>
      <TableCell>{row.products.length}</TableCell>
      <TableCell>
        {row.manual_total_selling_price
          ? USDollar.format(row.manual_total_selling_price)
          : USDollar.format(sumQuoteSellingPrice(row.products))}
      </TableCell>
    </TableRow>
  );
}

export default QuoteTableRow;
