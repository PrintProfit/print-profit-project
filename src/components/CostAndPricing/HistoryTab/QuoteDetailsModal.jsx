import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import {
  Backdrop,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Fade,
  IconButton,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { contribution, totalSellingPrice } from '../PricingTab/calculations';
import { unique } from '../PricingTab/utils';

function QuoteDetailsModal({
  open,
  row,
  handleOpen,
  handleClose,
  handleDeleteClickOpen,
  handleDeleteClose,
  setTab,
  companyId,
  ...props
}) {
  const dispatch = useDispatch();
  const [openDelete, setOpenDelete] = useState(false);
  const currentUser = useSelector((store) => store.user.currentUser);

  console.log('row:', row);
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'auto',
    height: 'auto',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    // makes table scrollable if it exceeds the height of the modal
    overflow: 'auto',
  };

  let productQuantity = 0;
  let totalSellingPriceDetail = 0;
  let totalEstimatedHours = 0;
  let totalVariableCosts = 0;
  const contributionAmount = totalSellingPriceDetail - totalVariableCosts;

  const costNames = row.products
    .flatMap((p) => p.costs.map((c) => c.name))
    .filter(unique);

  const sendToPricingTool = () => {
    dispatch({ type: 'SET_CURRENT_QUOTE', payload: row });
    dispatch({ type: 'SET_QUOTE_UPDATE_MODE', payload: true });
    handleClose();
    setTab(0);
  };

  const deleteQuote = (rowId) => {
    console.log('You clicked delete! rowId is: ', rowId);
    dispatch({
      type: 'SAGA_SOFT_DELETE_QUOTE',
      payload: {
        remove_quote: true,
        quote_id: rowId,
        id: row.user_id,
        quote: row,
      },
    });
    handleDeleteClose();
    handleClose();
    dispatch({
      type: 'SAGA/FETCH_QUOTE_HISTORY',
      payload: currentUser.company_id,
    });
  };

  // formats number string as US currency
  const USDollar = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  return (
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
          <Typography align="center" fontWeight="bold" fontSize="x-large">
            {row.name}
          </Typography>
          <IconButton
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
          <TableContainer>
            <Table
              sx={{
                mt: 3,
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography fontWeight="bold">Products:</Typography>
                  </TableCell>
                  {/* loops through product array in the given quote and adds a column for each quote */}
                  {row.products?.map((product) => (
                    <TableCell>
                      <Typography align="center">{product.name}</Typography>
                    </TableCell>
                  ))}
                  <TableCell>
                    <Typography fontWeight={'bold'} align="center">
                      Total:
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                <TableRow>
                  <TableCell>Quantity</TableCell>
                  {/* loops through product array and adds a table cell for each product's quantity */}
                  {row.products?.map((product) => {
                    // adds up quantity of each product order to get total product quantity
                    productQuantity += product.quantity;
                    return (
                      <TableCell align="center">{product.quantity}</TableCell>
                    );
                  })}
                  {/* displays total product quantity */}
                  <TableCell>
                    <Typography fontSize="" fontWeight="bold" align="center">
                      {productQuantity}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Selling Price Per Unit</TableCell>
                  {/* loops through product array and adds a table cell with the selling price per unit for each product */}
                  {row.products?.map((product) => (
                    <TableCell align="center">
                      {USDollar.format(product.selling_price_per_unit || 0)}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography fontSize="" fontWeight="bold">
                      Total Selling Price
                    </Typography>
                  </TableCell>
                  {/* loops through product array and adds a table cell with the total selling price for each product */}
                  {row.products?.map((product) => {
                    // adds up the total selling price for each product to get the total selling price for the entire quote
                    totalSellingPriceDetail += product.total_selling_price;
                    return (
                      <TableCell align="center">
                        {USDollar.format(product.total_selling_price)}
                      </TableCell>
                    );
                  })}
                  {/* displays total selling price for the entire quote */}
                  <TableCell>
                    <Typography fontWeight="bold">
                      {USDollar.format(totalSellingPriceDetail)}
                    </Typography>
                  </TableCell>
                </TableRow>
                {/* maps through costNames array:
                         for each cost input name in the array, returns a new table row with that name */}
                {costNames.map((name) => {
                  row.products.map((p) => {
                    totalVariableCosts += row.products
                      .flatMap(
                        (p) => p.costs.find((c) => c.name === name)?.value || 0,
                      )
                      .reduce((a, b) => a + b, 0);
                  });
                  return (
                    <TableRow key={name}>
                      <TableCell>{name}</TableCell>
                      {/* maps through the products array; finds cost name; and then the value for that cost name. If there is no value saved, it will display zero */}
                      {row.products.map((p) => (
                        <TableCell key={p.id} align="center">
                          {USDollar.format(
                            p.costs.find((c) => c.name === name)?.value || 0,
                          )}
                        </TableCell>
                      ))}
                      {/* calculates total variable costs for all products in the order */}
                      <TableCell align="center" fontWeight="bold">
                        <Typography fontSize="" fontWeight="bold">
                          {USDollar.format(
                            row.products
                              .map(
                                (p) =>
                                  p.costs.find((c) => c.name === name)?.value ||
                                  0,
                              )
                              // sums all of the values for a given cost input for the given quote.
                              // a is the accumulator, b is the new value being added, a + b is the
                              // operation to carry out, 0 is the initial value of the accumulator
                              .reduce((a, b) => a + b, 0),
                          )}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })}

                <TableRow>
                  <TableCell>
                    <Typography fontSize="" fontWeight="bold">
                      Total Variable Costs
                    </Typography>
                  </TableCell>
                  {row.products.map((product) => (
                    <TableCell key={product.name} align="center">
                      {USDollar.format(
                        product.costs
                          .map((c) => c.value ?? 0)
                          .reduce((a, b) => a + b, 0),
                      )}
                    </TableCell>
                  ))}

                  <TableCell align="center">
                    <Typography fontWeight="bold">
                      {USDollar.format(totalVariableCosts / 2)}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  {/* loops through product array and adds a table cell with the estimated hours spent on each product */}
                  <TableCell>Estimated Hours</TableCell>
                  {row.products?.map((product) => {
                    // adds up estimated hours for all the products in the quote
                    totalEstimatedHours += product.estimated_hours;
                    return (
                      <TableCell align="center">
                        {product.estimated_hours || 0}
                      </TableCell>
                    );
                  })}
                  {/* display total estimated hours for all products in the quote */}
                  <TableCell align="center">{totalEstimatedHours}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Contribution $</TableCell>
                  <TableCell> </TableCell>
                  <TableCell> </TableCell>
                  <TableCell align="center">
                    {USDollar.format(
                      totalSellingPriceDetail - totalVariableCosts / 2,
                    )}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>Contribution %</TableCell>
                  <TableCell> </TableCell>
                  <TableCell> </TableCell>
                  <TableCell align="center">
                    {(
                      ((totalSellingPriceDetail - totalVariableCosts / 2) *
                        100) /
                      totalSellingPriceDetail
                    ).toFixed(2)}
                    %
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>Contribution / hr</TableCell>
                  <TableCell> </TableCell>
                  <TableCell> </TableCell>
                  <TableCell align="center">
                    {USDollar.format(
                      (totalSellingPriceDetail - totalVariableCosts / 2) /
                        totalEstimatedHours,
                    )}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <Button
            onClick={handleDeleteClickOpen}
            variant="contained"
            color="warning"
            sx={{ mt: 3, ml: 3 }}
          >
            <Typography sx={{ mr: 1 }}>Delete quote</Typography>
            <DeleteIcon />
          </Button>

          <Button
            onClick={sendToPricingTool}
            variant="contained"
            color="button"
            sx={{ mt: 3, ml: 10 }}
          >
            <Typography sx={{ mr: 1 }}>Open in Pricing Tool</Typography>
            <OpenInNewIcon />
          </Button>

          {/* Delete quote dialog */}
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
              >
                <DeleteIcon /> Delete
              </Button>
              <Button sx={{ color: 'black' }} onClick={handleDeleteClose}>
                <CloseIcon /> Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Fade>
    </Modal>
  );
}

export default QuoteDetailsModal;
