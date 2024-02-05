// @ts-check

import { Button, Stack } from '@mui/material';
import { useDispatch } from 'react-redux';

/**
 *
 * @param {import("./prop-types").QuoteActionsProps} props
 */
export function QuoteActions({ quote }) {
  return (
    <Stack direction="row" spacing={2}>
      <SaveQuote quote={quote} />
      <Button type="button">Update</Button>
    </Stack>
  );
}

/**
 * @param {import("./prop-types").QuoteActionsProps} props
 */
function SaveQuote({ quote }) {
  const dispatch = useDispatch();

  const handleSave = () => {
    dispatch({ type: 'SAGA/SAVE_QUOTE', payload: quote });
  };

  return (
    <Button type="button" onClick={handleSave}>
      Save
    </Button>
  );
}
