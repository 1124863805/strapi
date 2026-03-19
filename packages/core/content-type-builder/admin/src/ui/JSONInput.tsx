import * as React from 'react';

interface JSONInputProps {
  value?: string;
  onChange?: (json: string) => void;
  disabled?: boolean;
  minHeight?: string;
  maxHeight?: string;
}

export const JSONInput = ({
  value = '',
  onChange,
  disabled,
  minHeight = '25.2rem',
  maxHeight = '50.4rem',
}: JSONInputProps) => {
  const [local, setLocal] = React.useState(value);
  React.useEffect(() => setLocal(value), [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const v = e.target.value;
    setLocal(v);
    onChange?.(v);
  };

  return (
    <textarea
      value={local}
      onChange={handleChange}
      disabled={disabled}
      spellCheck={false}
      style={{
        padding: 'var(--ctb-space-2) var(--ctb-space-3)',
        border: '1px solid var(--ctb-border)',
        borderRadius: 'var(--ctb-radius-sm)',
        fontSize: 14,
        fontFamily: 'monospace',
        width: '100%',
        minHeight,
        maxHeight,
        resize: 'vertical',
        boxSizing: 'border-box',
        backgroundColor: 'var(--ctb-bg)',
      }}
    />
  );
};
