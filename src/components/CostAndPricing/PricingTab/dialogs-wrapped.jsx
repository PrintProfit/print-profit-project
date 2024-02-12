import { Button, IconButton, Tooltip } from '@mui/material';
import { useState } from 'react';
import { ConfirmDialog } from './dialogs';
import { PricingTableFab as Fab } from './stylized';

/**
 * @param {import('./prop-types').ConfirmButtonDialogProps} props
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

  const handleClose = () => {
    setOpen(false);
    onClose?.();
  };
  const handleCancel = () => {
    setOpen(false);
    onCancel?.();
  };
  const handleConfirm = () => {
    setOpen(false);
    onConfirm();
  };

  return (
    <>
      {buttonType === 'button' ? (
        <Button onClick={() => setOpen(true)} {...ButtonProps}>
          {buttonText}
        </Button>
      ) : (
        <Tooltip title={buttonText} {...TooltipProps}>
          {buttonType === 'icon' ? (
            <IconButton onClick={() => setOpen(true)} {...IconProps} />
          ) : (
            <Fab onClick={() => setOpen(true)} {...FabProps} />
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
