// @ts-check
import { forwardRef } from 'react';
import { NumericFormat } from 'react-number-format';

/** @type {import('./ref-types').NumericInputRef} */
export const NumericInput = forwardRef(({ onChange, ...props }, ref) => {
  return (
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
  );
});

NumericInput.displayName = 'NumericInput';
