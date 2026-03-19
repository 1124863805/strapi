import * as React from 'react';

interface FieldContextValue {
  id?: string;
  error?: string | boolean;
  hint?: React.ReactNode;
  name?: string;
  required?: boolean;
}

export const FieldContext = React.createContext<FieldContextValue>({});

function useId(id?: string) {
  const [generatedId] = React.useState(() => `field-${Math.random().toString(36).slice(2, 9)}`);
  return id ?? generatedId;
}

interface RootProps {
  children: React.ReactNode;
  name?: string;
  error?: string | boolean;
  hint?: React.ReactNode;
  id?: string;
  required?: boolean;
}

const Root = ({ children, name, error = false, hint, id, required = false }: RootProps) => {
  const generatedId = useId(id);
  return (
    <FieldContext.Provider
      value={{ id: generatedId, name, error, hint, required }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ctb-space-1)' }}>
        {children}
      </div>
    </FieldContext.Provider>
  );
};

const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement> & { action?: React.ReactNode }
>(({ children, action, ...props }, ref) => {
  const { id, required } = React.useContext(FieldContext);
  if (!children) return null;
  return (
    <label
      ref={ref}
      htmlFor={id}
      id={`${id}-label`}
      style={{
        fontSize: 14,
        fontWeight: 500,
        color: 'var(--ctb-text)',
        marginBottom: 'var(--ctb-space-1)',
      }}
      {...props}
    >
      {children}
      {required && <span style={{ color: 'var(--ctb-danger)' }}> *</span>}
      {action}
    </label>
  );
});

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { hasError?: boolean; endAction?: React.ReactNode }
>(({ hasError: hasErrorProp, endAction, ...props }, ref) => {
  const { id, error, hint, name, required } = React.useContext(FieldContext);
  const hasError = Boolean(error) || Boolean(hasErrorProp);
  const ariaDesc = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <input
        ref={ref}
        id={id}
        name={name}
        aria-describedby={ariaDesc}
        aria-invalid={hasError}
        aria-required={required}
        style={{
          padding: 'var(--ctb-space-2) var(--ctb-space-3)',
          paddingRight: endAction ? 40 : 'var(--ctb-space-3)',
          border: `1px solid ${hasError ? 'var(--ctb-danger)' : 'var(--ctb-border)'}`,
          borderRadius: 'var(--ctb-radius-sm)',
          fontSize: 14,
          width: '100%',
          boxSizing: 'border-box',
          backgroundColor: 'var(--ctb-bg)',
        }}
        {...props}
      />
      {endAction && (
        <div style={{ position: 'absolute', right: 'var(--ctb-space-3)', top: '50%', transform: 'translateY(-50%)' }}>
          {endAction}
        </div>
      )}
    </div>
  );
});

const Hint = () => {
  const { id, hint, error } = React.useContext(FieldContext);
  if (!hint || error) return null;
  return (
    <p id={`${id}-hint`} style={{ fontSize: 12, color: 'var(--ctb-text-muted)', margin: 'var(--ctb-space-1) 0 0' }} className="ctb-form-hint">
      {hint}
    </p>
  );
};

const Error = () => {
  const { id, error } = React.useContext(FieldContext);
  if (!error || typeof error !== 'string') return null;
  return (
    <p id={`${id}-error`} style={{ fontSize: 12, color: 'var(--ctb-danger)', margin: 'var(--ctb-space-1) 0 0' }}>
      {error}
    </p>
  );
};

export const Field = { Root, Label, Input, Hint, Error };
