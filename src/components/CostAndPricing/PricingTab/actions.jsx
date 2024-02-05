// @ts-check

import { Button, Stack } from '@mui/material';

/**
 *
 * @param {import("./prop-types").QuoteActionsProps} props
 */
export function QuoteActions({ quote }) {
  return (
    <Stack direction="row" spacing={2}>
      <Button>Save</Button>
      <Button>Update</Button>
    </Stack>
  );
}
