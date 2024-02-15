import { Button, IconButton, Tooltip } from '@mui/material';
import { useCallback, useState } from 'react';
import { ConfirmDialog } from './dialogs';
import { PricingTableFab as Fab } from './stylized';

/**
 * An abstraction of a confirm dialog that is triggered by a button.
 * @param {import('./prop-types').ConfirmButtonDialogProps} props
 * @returns {JSX.Element}
 */
export function ConfirmButtonDialog({
  buttonType,
  buttonText,
  ButtonProps,
  IconProps,
  FabProps,
  TooltipProps,
  onClose,
  onCancel,
  onConfirm,
  ...props
}) {
  const [open, setOpen] = useState(false);

  /** Closes the dialog */
  const handleClose = useCallback(() => {
    setOpen(false);
    onClose?.();
  }, [onClose]);

  /** Cancels the action */
  const handleCancel = useCallback(() => {
    setOpen(false);
    onCancel?.();
  }, [onCancel]);

  /** Confirms the action */
  const handleConfirm = useCallback(() => {
    setOpen(false);
    onConfirm();
  }, [onConfirm]);

  /** Opens the dialog */
  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);

  // This code is messy, but it lets us support multiple types of buttons
  return (
    <>
      {buttonType === 'button' ? (
        <Button onClick={handleOpen} {...ButtonProps}>
          {buttonText}
        </Button>
      ) : (
        <Tooltip title={buttonText} {...TooltipProps}>
          {buttonType === 'icon' ? (
            <IconButton onClick={handleOpen} {...IconProps} />
          ) : (
            <Fab onClick={handleOpen} {...FabProps} />
          )}
        </Tooltip>
      )}
      <ConfirmDialog
        open={open}
        onClose={handleClose}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
        {...props}
      />
    </>
  );
}
