// @ts-check

import { Save, Update } from '@mui/icons-material';
import {
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material';
import { produce } from 'immer';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

/**
 *
 * @param {import("./prop-types").QuoteActionsProps} props
 */
export function QuoteActions({ quote, setQuote }) {
  return (
    <ButtonGroup>
      <SaveQuote quote={quote} setQuote={setQuote} />
      <UpdateQuote quote={quote} setQuote={setQuote} />
    </ButtonGroup>
  );
}

/**
 * @param {import("./prop-types").QuoteActionsProps} props
 */
function SaveQuote({ quote, setQuote }) {
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [name, setName] = useState(quote.name ?? '');

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
    setOpen(false);
  };

  const closeDialog = () => {
    setOpen(false);
    setName(quote.name ?? '');
  };

  return (
    <>
      <Button
        type="button"
        variant="contained"
        startIcon={<Save />}
        onClick={() => setOpen(true)}
      >
        Save
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
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
            <Button onClick={closeDialog} color="secondary">
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </ButtonGroup>
        </DialogActions>
      </Dialog>
    </>
  );
}

/**
 * @param {import("./prop-types").QuoteActionsProps} props
 */
function UpdateQuote({ quote, setQuote }) {
  // TODO: Implement this.
  // It's hard to do right now since there's no way to get an existing quote
  // into the table right now.
  return (
    <Button type="button" variant="contained" startIcon={<Update />}>
      Update
    </Button>
  );
}
