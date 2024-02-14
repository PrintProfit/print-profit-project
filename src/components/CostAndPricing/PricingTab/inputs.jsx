// @ts-check
import { forwardRef } from 'react';
import { NumericFormat } from 'react-number-format';

/**
 * An input component for mui's `TextField` that only accepts numeric input.
 * @see {@link https://mui.com/material-ui/react-text-field/#integration-with-3rd-party-input-libraries | MUI Integration with 3rd-party input libraries}
 * @type {import('./ref-types').NumericInputRef}
 */
export const NumericInput = forwardRef(({ onChange, ...props }, ref) => (
  <NumericFormat
    {...props}
    getInputRef={ref}
    onValueChange={(values) => {
      onChange({
        target: {
          name: props.name,
          value: values.value,
        },
      });
    }}
    thousandSeparator
    valueIsNumericString
  />
));

// Display names are mostly relevant for forward refs. Otherwise, React can
// infer the name of the component from the variable name.
NumericInput.displayName = 'NumericInput';
