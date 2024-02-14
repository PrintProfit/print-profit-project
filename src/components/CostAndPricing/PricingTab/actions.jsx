// @ts-check

import { Cancel, Clear, Save, Update } from '@mui/icons-material';
import {
  Button,
  ButtonGroup,
  DialogContentText,
  Stack,
  TextField,
} from '@mui/material';
import { produce } from 'immer';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BaseDialog } from './dialogs';
import { ConfirmButtonDialog } from './dialogs-wrapped';
import { initialQuote } from './sample-data';

/**
 * The actions to display under a quote.
 * @param {import("./prop-types").QuoteActionGroupProps} props
 * @returns {JSX.Element}
 */
export function QuoteActions({ quote, setQuote }) {
  // Tells VSCode to shut up about types.
  // In a TS redux project, there's a typed version of useSelector that makes
  // this irrelevant.
  /** @type {boolean} */
  const updateMode = useSelector(
    (/** @type {any} */ state) => state.quote.updateMode,
  );

  return (
    <Stack direction="row" spacing={2}>
      <ClearQuote setQuote={setQuote} />
      <SaveQuote quote={quote} setQuote={setQuote} />
      {updateMode && <UpdateQuote quote={quote} />}
    </Stack>
  );
}

/**
 * The save quote button & dialog.
 * @param {import("./prop-types").SaveQuoteProps} props
 * @returns {JSX.Element}
 */
function SaveQuote({ quote, setQuote }) {
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);

  const saveQuote = () => {
    dispatch({ type: 'SAGA/SAVE_QUOTE', payload: quote });
  };

  const onClose = () => {
    setOpen(false);
  };

  const onSubmit = () => {
    saveQuote();
    onClose();
  };

  /**
   * We need to hook directly into the quote to ensure changes get to the
   * server.
   * @type {React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>}
   */
  const setQuoteName = (e) => {
    setQuote(
      produce((/** @type {import('./data-types').Quote} */ draft) => {
        draft.name = e.target.value;
      }),
    );
  };

  return (
    <>
      <Button
        type="button"
        variant="contained"
        startIcon={<Save />}
        onClick={() => setOpen(true)}
      >
        Save as new quote
      </Button>

      <BaseDialog
        open={open}
        title="Save Quote"
        actions={
          <ButtonGroup variant="contained">
            <Button
              type="button"
              onClick={onClose}
              color="secondary"
              startIcon={<Cancel />}
            >
              Cancel
            </Button>

            <Button type="submit" startIcon={<Save />}>
              Save
            </Button>
          </ButtonGroup>
        }
        onClose={onClose}
        onSubmit={onSubmit}
        snackbarMessage="Saved quote"
      >
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
          value={quote.name}
          onChange={setQuoteName}
        />
      </BaseDialog>
    </>
  );
}

/**
 * The update quote button & dialog. Only should show up in update mode.
 * @param {import("./prop-types").UpdateQuoteProps} props
 * @returns {JSX.Element}
 */
function UpdateQuote({ quote }) {
  const dispatch = useDispatch();

  const updateQuote = () => {
    dispatch({ type: 'SAGA/UPDATE_QUOTE', payload: quote });
  };

  // ConfirmButtonDialog abstracts away all the dialog state management.
  return (
    <ConfirmButtonDialog
      buttonType="button"
      buttonText="Update"
      ButtonProps={{
        type: 'button',
        variant: 'contained',
        startIcon: <Update />,
      }}
      title="Update Quote"
      text="Are you sure you want to update this quote?"
      cancelText="Cancel"
      confirmText="Update"
      CancelProps={{
        color: 'secondary',
        startIcon: <Cancel />,
      }}
      ConfirmProps={{
        startIcon: <Update />,
      }}
      onConfirm={updateQuote}
      snackbarMessage="Updated quote"
    />
  );
}

/**
 * The clear quote button & dialog. It resets the quote to its initial state.
 * @param {import('./prop-types').ClearQuoteProps} props
 * @returns {JSX.Element}
 */
function ClearQuote({ setQuote }) {
  const dispatch = useDispatch();

  const createQuote = () => {
    // We're no longer updating a quote.
    dispatch({ type: 'SET_QUOTE_UPDATE_MODE', payload: false });
    dispatch({ type: 'CLEAR_CURRENT_QUOTE' });
    setQuote(initialQuote);
  };

  return (
    <ConfirmButtonDialog
      buttonType="button"
      buttonText="Clear Quote"
      ButtonProps={{
        type: 'button',
        variant: 'contained',
        color: 'warning',
        startIcon: <Clear />,
      }}
      title="Are you sure?"
      text="Are you sure you want to clear the current quote? This will discard any unsaved changes."
      cancelText="Cancel"
      confirmText="Clear"
      CancelProps={{
        color: 'secondary',
        startIcon: <Cancel />,
      }}
      ConfirmProps={{
        color: 'warning',
        startIcon: <Clear />,
      }}
      onConfirm={createQuote}
      snackbarMessage="Created new quote"
    />
  );
}
