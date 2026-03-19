import * as React from 'react';
import { FieldContext } from './Field';

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>((props, ref) => {
  const { id, error, hint, name, required } = React.useContext(FieldContext);
  const hasError = Boolean(error);
  const ariaDesc = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  return (
    <textarea
      ref={ref}
      id={id}
      name={name}
      aria-describedby={ariaDesc}
      aria-invalid={hasError}
      aria-required={required}
      style={{
        padding: 'var(--ctb-space-2) var(--ctb-space-3)',
        border: `1px solid ${hasError ? 'var(--ctb-danger)' : 'var(--ctb-border)'}`,
        borderRadius: 'var(--ctb-radius-sm)',
        fontSize: 14,
        width: '100%',
        minHeight: 80,
        resize: 'vertical',
        boxSizing: 'border-box',
        backgroundColor: 'var(--ctb-bg)',
      }}
      {...props}
    />
  );
});
