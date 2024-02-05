// @ts-check

import { Button, Stack } from '@mui/material';
import { useDispatch } from 'react-redux';

/**
 *
 * @param {import("./prop-types").QuoteActionsProps} props
 */
export function QuoteActions({ quote }) {
  const dispatch = useDispatch();

  const handleSave = () => {
    dispatch({ type: 'SAGA/SAVE_QUOTE', payload: quote });
  };

  return (
    <Stack direction="row" spacing={2}>
      <Button type="button" onClick={handleSave}>
        Save
      </Button>
      <Button type="button">Update</Button>
    </Stack>
  );
}
