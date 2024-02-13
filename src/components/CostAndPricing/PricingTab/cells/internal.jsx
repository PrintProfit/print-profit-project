import { styled } from '@mui/material';
import { red } from '@radix-ui/colors';
import * as fmt from '../formats';

/**
 * @param {import("../prop-types").NumberFormatterProps} props
 */
export function NumberFormatter({ value, variant = 'number' }) {
  const formatted = formatters[variant]?.(value);
  return (
    <Text
      sx={{
        color: value < 0 ? red.red9 : undefined,
      }}
    >
      {formatted}
    </Text>
  );
}

const Text = styled('span')({});

/**
 * Identity function
 * @template T
 * @param {T} n
 * @returns {T}
 */
const identity = (n) => n;

const formatters = {
  number: identity,
  currency: fmt.currency,
  accounting: fmt.accounting,
  percent: fmt.percent,
};
