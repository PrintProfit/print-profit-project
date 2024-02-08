import type { forwardRef } from 'react';
import type { NumericFormatProps } from 'react-number-format';
import type { InputExtraProps } from './prop-types';

// forwardrefs are (imo) really hard to write without types

type ForwardRef<T, P> = ReturnType<typeof forwardRef<T, P>>;

export type NumericInputRef = ForwardRef<NumericFormatProps, InputExtraProps>;
