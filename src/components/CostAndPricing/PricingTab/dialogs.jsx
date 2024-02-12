import { Close } from '@mui/icons-material';
import {
  Alert,
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
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
    setSnackbarOpen(true);
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
        <DialogSnackbar
          open={snackbarOpen}
          onClose={() => setSnackbarOpen(false)}
        >
          {snackbarMessage}
        </DialogSnackbar>
      )}
    </>
  );
}

/**
 * @param {import('./prop-types').DialogSnackbarProps} props
 */
function DialogSnackbar({
  open,
  severity,
  onClose,
  autoHideDuration = 6000,
  children,
}) {
  /**
   * @param {(React.SyntheticEvent | Event)} event
   * @param {string} [reason]
   */
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    onClose();
  };

  const action = (
    <IconButton
      size="small"
      aria-label="close"
      color="inherit"
      onClick={handleClose}
    >
      <Close fontSize="small" />
    </IconButton>
  );

  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
    >
      <Alert
        onClose={handleClose}
        severity={severity}
        variant="filled"
        sx={{ width: '100%' }}
        action={action}
      >
        {children}
      </Alert>
    </Snackbar>
  );
}
