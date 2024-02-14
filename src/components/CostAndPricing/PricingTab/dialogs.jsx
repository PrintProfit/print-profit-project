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
import { useCallback, useState } from 'react';

/**
 * Abstraction of a confirm dialog.
 * @param {import("./prop-types").ConfirmDlaogProps} props
 * @returns {JSX.Element}
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
  SnackbarProps,
}) {
  return (
    <BaseDialog
      open={open}
      title={title}
      actions={
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
      }
      onClose={onClose}
      onSubmit={onConfirm}
      snackbarMessage={snackbarMessage}
      SnackbarProps={SnackbarProps}
    >
      <DialogContentText>{text}</DialogContentText>
    </BaseDialog>
  );
}

/**
 * Abstraction of a dialog.
 * @param {import('./prop-types').BaseDialogProps} props
 * @returns {JSX.Element}
 */
export function BaseDialog({
  open,
  title,
  actions,
  snackbarMessage,
  SnackbarProps,
  onClose,
  onSubmit,
  children,
}) {
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  /** Handles form submission */
  const handleSubmit = useCallback(
    /**
     * @param {React.FormEvent<HTMLFormElement>} e
     * @returns {void}
     */
    (e) => {
      e.preventDefault();
      onSubmit();
      setSnackbarOpen(true);
    },
    [onSubmit],
  );

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
        <DialogContent>{children}</DialogContent>
        <DialogActions>{actions}</DialogActions>
      </Dialog>
      {snackbarMessage && (
        <DialogSnackbar
          open={snackbarOpen}
          onClose={() => setSnackbarOpen(false)}
          {...SnackbarProps}
        >
          {snackbarMessage}
        </DialogSnackbar>
      )}
    </>
  );
}

/**
 * Abstraction of a snackbar.
 * @param {import('./prop-types').DialogSnackbarProps} props
 * @returns {JSX.Element}
 */
function DialogSnackbar({
  open,
  severity,
  onClose,
  autoHideDuration = 6000,
  children,
}) {
  /** Handles closing the snackbar */
  const handleClose = useCallback(
    /**
     * @param {(React.SyntheticEvent | Event)} _event
     * @param {string} [reason]
     * @returns {void}
     */
    (_event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
      onClose();
    },
    [onClose],
  );

  /** Actions for the snackbar */
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
  // We're unable to add some features that would be nice to have to the
  // snackbar - namely, an undo button. This is because the specific actions
  // where an undo button would be wanted, are also the specific actions likely
  // to cause a rerender of the table, destroying the snackbar early.

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
