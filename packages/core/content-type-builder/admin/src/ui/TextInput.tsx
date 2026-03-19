import * as React from 'react';
import { Field } from './Field';

export const TextInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { endAction?: React.ReactNode }
>((props, ref) => <Field.Input ref={ref} {...props} />);
