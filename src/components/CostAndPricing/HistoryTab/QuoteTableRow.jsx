import DeleteIcon from '@mui/icons-material/Delete';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import {
  Backdrop,
  Box,
  Button,
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
import { useDispatch } from 'react-redux';
import { totalSellingPrice } from '../PricingTab/calculations';
import { unique } from '../PricingTab/utils';

function QuoteDetailsModal({ open, row, handleClose, setTab, ...props }) {
  const dispatch = useDispatch();
  console.log('row:', row);
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'auto',
    height: '90%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    // makes table scrollable if it exceeds the height of the modal
    overflow: 'auto',
  };

  const sendToPricingTool = () => {
    dispatch({ type: 'SET_CURRENT_QUOTE', payload: row });
    dispatch({ type: 'SET_QUOTE_UPDATE_MODE', payload: true });
    handleClose();
    setTab(0);
  };

  const costNames = row.products
    .flatMap((p) => p.costs.map((c) => c.name))
    .filter(unique);

  const costNameArray = [];

  let productQuantity = 0;
  let totalSellingPriceDetail = 0;
  let totalEstimatedHours = 0;
  const totalVariableCosts = 0;
  const contributionAmount = 0;

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
            <Typography align="center" fontWeight="bold" sx={{ mb: 2 }}>
              {row.name}
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography fontWeight="bold">Products:</Typography>
                    </TableCell>
                    {/* TO-DO: loop through quote object and insert TableCell for each cost input name */}
                    {row.products?.map((product) => (
                      <TableCell>{product.name}</TableCell>
                    ))}
                    <TableCell>
                      <Typography fontWeight={'bold'}>Total:</Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  <TableRow>
                    <TableCell>Quantity</TableCell>
                    {row.products?.map((product) => {
                      productQuantity += product.quantity;
                      return <TableCell>{product.quantity}</TableCell>;
                    })}
                    <TableCell>{productQuantity}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Selling Price</TableCell>
                    {row.products?.map((product) => (
                      <TableCell>{product.selling_price_per_unit}</TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Typography>Total Selling Price</Typography>
                    </TableCell>
                    {row.products?.map((product) => {
                      totalSellingPriceDetail += product.total_selling_price;
                      return (
                        <TableCell>{product.total_selling_price}</TableCell>
                      );
                    })}
                    <TableCell>{totalSellingPriceDetail}</TableCell>
                  </TableRow>
                  {/* TO-DO: loop through quote object and insert new TableRow for each cost input; nested loop and add values from each product as TableCells? */}
                  {costNames.map((name) => {
                    return (
                      <TableRow key="name">
                        <TableCell>{name}</TableCell>
                        {row.products.map((p) => (
                          <TableCell key={p.id}>
                            {p.costs.find((c) => c.name === name)?.value}
                          </TableCell>
                        ))}
                        <TableCell>
                          {row.products
                            .flatMap(
                              (p) =>
                                p.costs.find((c) => c.name === name)?.value,
                            )
                            .reduce((a, b) => a + b, 0)}
                        </TableCell>
                      </TableRow>
                    );
                  })}

                  <TableRow>
                    <TableCell>Estimated Hours</TableCell>
                    {row.products?.map((product) => {
                      totalEstimatedHours += product.estimated_hours;
                      return <TableCell>{product.estimated_hours}</TableCell>;
                    })}
                    <TableCell>{totalEstimatedHours}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Typography>Total Variable Costs</Typography>
                    </TableCell>
                    <TableCell>600</TableCell>
                    <TableCell>850</TableCell>
                    <TableCell>1450</TableCell>
                  </TableRow>
                  {/* <TableRow>
                    <TableCell>Contribution $</TableCell>
                  </TableRow> */}
                </TableBody>
              </Table>
            </TableContainer>
            <Button
              onClick={sendToPricingTool}
              variant="contained"
              color="button"
              sx={{ ml: '50%', mt: 3 }}
            >
              <Typography sx={{ mr: 1 }}>Open in Pricing Tool</Typography>
              <OpenInNewIcon />
            </Button>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}

/**
 * @param {Object} props
 * @param {import('../PricingTab/data-types').Quote} props.row
 */
function QuoteTableRow({ row, setTab, ...props }) {
  console.log(row);

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
          setTab={setTab}
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
        <Tooltip title="Delete quote">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}

export default QuoteTableRow;
