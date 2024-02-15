import {
  Close as CloseIcon,
  Delete as DeleteIcon,
  OpenInNew as OpenInNewIcon,
} from '@mui/icons-material';
import {
  Backdrop,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fade,
  IconButton,
  Modal,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  contribution,
  contributionMargin,
  contributionPerHour,
  creditCardFee,
  totalSellingPrice,
  totalVariableCosts,
} from '../PricingTab/calculations';
import { repairQuote } from '../PricingTab/data-repair';
import { currency, percent } from '../PricingTab/formats';
import { toCostNames, unique } from '../PricingTab/utils';

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

  // console.log('row:', row);
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

  // repairQuote gets a version of the quote without null values
  const quote = repairQuote(row);

  // Gets a unique list of user-editable cost names
  const costNames = quote.products.flatMap(toCostNames).filter(unique);

  const sendToPricingTool = () => {
    dispatch({ type: 'SET_CURRENT_QUOTE', payload: row });
    dispatch({ type: 'SET_QUOTE_UPDATE_MODE', payload: true });
    handleClose();
    setTab(0);
  };

  // 🔥🔥🔥🔥🔥🔥 need some asynchronous requests here
  const deleteQuote = (rowId) => {
    console.log('You clicked delete! rowId is: ', rowId);
    dispatch({
      type: 'SAGA/DELETE_QUOTE',
      payload: {
        remove_quote: true,
        quote_id: rowId,
        id: row.user_id,
        quote: row,
        payload: 0,
      },
    });
    handleDeleteClose();
    handleClose();
    // dispatch({
    //   type: 'SAGA/FETCH_QUOTE_HISTORY',
    //   payload: currentUser.company_id,
    // });
  };

  /**
   * Callback for reducing two numbers into their sum.
   *
   * Use this with an array's `.reduce` method to add up all the numbers in the array.
   * @param {number} acc
   * @param {number} next
   * @returns {number}
   */
  const sum = (acc, next) => acc + next;

  /**
   * @callback CostNameFinder
   * @param {import('../PricingTab/data-types').Product} products
   * @returns {number}
   */

  /**
   * Finds costs by their name
   * @param {string} name
   * @returns {CostNameFinder}
   */
  const findCostsByName = (name) => {
    return (products) => {
      return products.costs.find((c) => c.name === name)?.value ?? 0;
    };
  };

  const aggContribution = quote.products.map(contribution).reduce(sum, 0);
  const aggSellingPrice = quote.products.map(totalSellingPrice).reduce(sum, 0);
  const aggHours = quote.products.map((p) => p.estimated_hours).reduce(sum, 0);

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
            {quote.name}
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
                  {quote.products.map((product) => (
                    <TableCell key={product.id}>
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
                  {/*
                    loops through product array and adds a table cell for each product's quantity.

                    Because the function doesn't modify anything, it's considered a pure function.
                    React works best with any functions run during the render being pure functions.
                   */}
                  {quote.products.map((product) => (
                    <TableCell key={product.id} align="center">
                      {product.quantity}
                    </TableCell>
                  ))}
                  {/* displays total product quantity */}
                  <TableCell>
                    <Typography fontSize="" fontWeight="bold" align="center">
                      {/* 
                        the .map converts the product list into just their quantities
                        then the .reduce adds them all together.
                       */}
                      {quote.products.map((p) => p.quantity).reduce(sum, 0)}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Selling Price Per Unit</TableCell>
                  {/* loops through product array and adds a table cell with the selling price per unit for each product */}
                  {quote.products.map((product) => (
                    <TableCell key={product.id} align="center">
                      {currency(product.selling_price_per_unit || 0)}
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
                  {quote.products.map((product) => (
                    <TableCell key={product.id} align="center">
                      {currency(totalSellingPrice(product))}
                    </TableCell>
                  ))}
                  {/* displays total selling price for the entire quote */}
                  <TableCell>
                    <Typography fontWeight="bold">
                      {currency(aggSellingPrice)}
                    </Typography>
                  </TableCell>
                </TableRow>
                {/* maps through costNames array:
                         for each cost input name in the array, returns a new table row with that name */}
                {costNames.map((name) => (
                  <TableRow key={name}>
                    <TableCell>{name}</TableCell>
                    {/* map through the products, find the cost by name, and display the value. */}
                    {quote.products.map((product) => (
                      <TableCell key={product.id} align="center">
                        {currency(
                          product.costs.find((c) => c.name === name)?.value ??
                            0,
                        )}
                      </TableCell>
                    ))}
                    {/* sums all the costs with a given name */}
                    <TableCell align="center">
                      <Typography fontSize="" fontWeight="bold">
                        {currency(
                          quote.products
                            .flatMap(findCostsByName(name))
                            .reduce(sum, 0),
                        )}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}

                <TableRow>
                  <TableCell>Credit Card Fee</TableCell>
                  {quote.products.map((product) => (
                    <TableCell key={product.id} align="center">
                      {currency(creditCardFee(product))}
                    </TableCell>
                  ))}
                  <TableCell align="center">
                    <Typography fontWeight="bold">
                      {currency(
                        quote.products.map(creditCardFee).reduce(sum, 0),
                      )}
                    </Typography>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>
                    <Typography fontSize="" fontWeight="bold">
                      Total Variable Costs
                    </Typography>
                  </TableCell>
                  {quote.products.map((product) => (
                    <TableCell key={product.name} align="center">
                      {currency(totalVariableCosts(product))}
                    </TableCell>
                  ))}

                  <TableCell align="center">
                    <Typography fontWeight="bold">
                      {/* Creates an array of just the cost values for every product, and sums them up */}
                      {currency(
                        quote.products.map(totalVariableCosts).reduce(sum, 0),
                      )}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  {/* loops through product array and adds a table cell with the estimated hours spent on each product */}
                  <TableCell>Estimated Hours</TableCell>
                  {quote.products.map((product) => (
                    <TableCell key={product.id} align="center">
                      {product.estimated_hours}
                    </TableCell>
                  ))}
                  {/* display total estimated hours for all products in the quote */}
                  <TableCell align="center">{aggHours}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Contribution $</TableCell>
                  {quote.products.map((product) => (
                    <TableCell key={product.id} align="center">
                      {currency(contribution(product))}
                    </TableCell>
                  ))}
                  <TableCell align="center">
                    {currency(aggContribution)}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>Contribution %</TableCell>
                  {quote.products.map((product) => (
                    <TableCell key={product.id} align="center">
                      {percent(contributionMargin(product))}
                    </TableCell>
                  ))}
                  <TableCell align="center">
                    {percent(aggContribution / aggSellingPrice)}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>Contribution / Hour</TableCell>
                  {quote.products.map((product) => (
                    <TableCell key={product.id} align="center">
                      {currency(contributionPerHour(product))}
                    </TableCell>
                  ))}
                  <TableCell align="center">
                    {currency(aggContribution / aggHours)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <Stack mt={3} justifyContent="center" spacing={10} direction="row">
            <Button
              onClick={handleDeleteClickOpen}
              variant="contained"
              color="warning"
              endIcon={<DeleteIcon />}
            >
              Delete quote
            </Button>
            <Button
              onClick={sendToPricingTool}
              variant="contained"
              color="secondary"
              endIcon={<OpenInNewIcon />}
            >
              Open in Pricing Tool
            </Button>
          </Stack>

          {/* Delete quote dialog */}
          <Dialog
            open={openDelete}
            onClose={handleDeleteClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {`Are you sure you want to permanently delete the ${quote.name} quote?`}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                This action cannot be undone.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                color="error"
                onClick={() => deleteQuote(quote.id)}
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
        </Box>
      </Fade>
    </Modal>
  );
}

export default QuoteDetailsModal;
