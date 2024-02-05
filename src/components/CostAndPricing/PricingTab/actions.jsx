// @ts-check

import { Cancel, Close, Save, Update } from '@mui/icons-material';
import {
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Snackbar,
  TextField,
} from '@mui/material';
import { produce } from 'immer';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

/**
 * @param {import("./prop-types").QuoteActionGroupProps} props
 */
export function QuoteActions({ quote, setQuote }) {
  /** @type {boolean} */
  const updateMode = useSelector((state) => state.quote.updateMode);
  return (
    <ButtonGroup>
      <SaveQuote quote={quote} setQuote={setQuote} />
      {updateMode && <UpdateQuote quote={quote} />}
    </ButtonGroup>
  );
}

/**
 * @param {import("./prop-types").SaveQuoteProps} props
 */
function SaveQuote({ quote, setQuote }) {
  const dispatch = useDispatch();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState(quote.name ?? '');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const saveQuote = () => {
    dispatch({ type: 'SAGA/SAVE_QUOTE', payload: quote });
  };

  /**
   * @param {import('react').FormEvent<HTMLFormElement>} e
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    setQuote(
      produce((/** @type {import('./data-types').Quote} */ draft) => {
        draft.name = name;
      }),
    );
    saveQuote();
    setDialogOpen(false);
    setSnackbarOpen(true);
  };
  const closeDialog = () => {
    setDialogOpen(false);
    setName(quote.name ?? '');
  };

  /**
   * @param {(React.SyntheticEvent | Event)} event
   * @param {string} [reason]
   */
  const closeSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const snackbarAction = (
    <IconButton
      size="small"
      aria-label="close"
      color="inherit"
      onClick={closeSnackbar}
    >
      <Close fontSize="small" />
    </IconButton>
  );

  return (
    <>
      <Button
        type="button"
        variant="contained"
        startIcon={<Save />}
        onClick={() => setDialogOpen(true)}
      >
        Save
      </Button>
      <Dialog
        open={dialogOpen}
        onClose={closeDialog}
        PaperProps={{
          component: 'form',
          onSubmit: handleSubmit,
        }}
      >
        <DialogTitle>Save Quote</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please specify a name for the quote.
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            fullWidth
            id="quoteName"
            name="quoteName"
            label="Quote Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <ButtonGroup variant="contained">
            <Button
              type="button"
              onClick={closeDialog}
              color="secondary"
              startIcon={<Cancel />}
            >
              Cancel
            </Button>
            <Button type="submit" startIcon={<Save />}>
              Save
            </Button>
          </ButtonGroup>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        message="Saved quote"
        onClose={closeSnackbar}
        action={snackbarAction}
      />
    </>
  );
}

/**
 * @param {import("./prop-types").UpdateQuoteProps} props
 */
function UpdateQuote({ quote }) {
  const dispatch = useDispatch();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const updateQuote = () => {
    dispatch({ type: 'SAGA/UPDATE_QUOTE', payload: quote });
  };

  /**
   * @param {import('react').FormEvent<HTMLFormElement>} e
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    updateQuote();
    setDialogOpen(false);
    setSnackbarOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
  };

  /**
   * @param {(React.SyntheticEvent | Event)} event
   * @param {string} [reason]
   */
  const closeSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const snackbarAction = (
    <IconButton
      size="small"
      aria-label="close"
      color="inherit"
      onClick={closeSnackbar}
    >
      <Close fontSize="small" />
    </IconButton>
  );

  return (
    <>
      <Button
        type="button"
        variant="contained"
        startIcon={<Update />}
        onClick={() => setDialogOpen(true)}
      >
        Update
      </Button>
      <Dialog
        open={dialogOpen}
        onClose={closeDialog}
        PaperProps={{
          component: 'form',
          onSubmit: handleSubmit,
        }}
      >
        <DialogTitle>Update Quote</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to update this quote?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <ButtonGroup variant="contained">
            <Button
              type="button"
              onClick={closeDialog}
              color="secondary"
              startIcon={<Cancel />}
            >
              Cancel
            </Button>
            <Button type="submit" startIcon={<Update />}>
              Update
            </Button>
          </ButtonGroup>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        message="Updated quote"
        onClose={closeSnackbar}
        action={snackbarAction}
      />
    </>
  );
}
