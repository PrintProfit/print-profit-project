import { styled } from '@mui/material';
import { red } from '@radix-ui/colors';
import { useMemo } from 'react';
import * as fmt from '../formats';

/**
 * Formats a number number, and makes it red if it's negative.
 * @param {import("../prop-types").NumberFormatterProps} props
 * @returns {React.ReactNode}
 */
export function NumberFormatter({ value, variant = 'number' }) {
  const formatter = useMemo(
    () => formatters[variant] ?? identity,
    [formatters[variant]],
  );

  const formatted = formatter(value);

  return (
    value && (
      <Text
        sx={{
          // Show negative numbers in red.
          color: value < 0 ? red.red9 : undefined,
        }}
      >
        {formatted}
      </Text>
    )
  );
}

// The typography component looks too big here, so a styled span is used to
// get the sx prop.
const Text = styled('span')(() => ({}));

/**
 * Identity function
 * @template T
 * @param {T} n
 * @returns {T}
 */
const identity = (n) => n;

const formatters = {
  number: fmt.number,
  currency: fmt.currency,
  accounting: fmt.accounting,
  percent: fmt.percent,
};
