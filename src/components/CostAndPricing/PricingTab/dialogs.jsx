import {
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
} from '@mui/material';
import { useState } from 'react';

/**
 * @param {import("./prop-types").ConfirmDlaogProps} props
 */
export function ConfirmDialog({
  open,
  title,
  text,
  cancelText = 'Cancel',
  confirmText = 'Confirm',
  CancelProps,
  ConfirmProps,
  onClose,
  onCancel,
  onConfirm,
  snackbarMessage,
}) {
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  /**
   * @param {import('react').FormEvent<HTMLFormElement>} e
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm();
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        PaperProps={{
          component: 'form',
          onSubmit: handleSubmit,
        }}
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{text}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <ButtonGroup variant="contained">
            <Button
              type="button"
              color="secondary"
              onClick={onCancel}
              {...CancelProps}
            >
              {cancelText}
            </Button>
            <Button type="submit" {...ConfirmProps}>
              {confirmText}
            </Button>
          </ButtonGroup>
        </DialogActions>
      </Dialog>
      {snackbarMessage && (
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          message={snackbarMessage}
        />
      )}
    </>
  );
}
