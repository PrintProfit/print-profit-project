import type { HTMLAttributes } from 'react';

export interface TabPanelProps
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    'role' | 'hidden' | 'id' | 'aria-labelledby'
  > {
  value: number;
  index: number;
}
