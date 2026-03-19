import * as React from 'react';

interface NestedOption {
  value: string;
  label: string;
}

interface NestedGroup {
  label: string;
  children: NestedOption[];
}

interface MultiSelectNestedProps {
  id?: string;
  options: (NestedOption | NestedGroup)[];
  value?: string[] | null;
  onChange?: (values: string[]) => void;
  customizeContent?: () => string;
}

export const MultiSelectNested = ({
  id,
  options,
  value = [],
  onChange,
  customizeContent,
}: MultiSelectNestedProps) => {
  const vals = value ?? [];
  const isChecked = (v: string) => vals.includes(v);

  const toggle = (v: string) => {
    const next = isChecked(v) ? vals.filter((x) => x !== v) : [...vals, v];
    onChange?.(next);
  };

  const toggleGroup = (group: NestedGroup) => {
    const groupVals = group.children.map((c) => c.value);
    const allChecked = groupVals.every((v) => vals.includes(v));
    const next = allChecked
      ? vals.filter((x) => !groupVals.includes(x))
      : [...new Set([...vals, ...groupVals])];
    onChange?.(next);
  };

  return (
    <div style={{ border: '1px solid var(--ctb-border)', borderRadius: 'var(--ctb-radius-sm)', padding: 'var(--ctb-space-2)' }}>
      {customizeContent ? (
        <div style={{ fontSize: 14, color: 'var(--ctb-text-secondary)' }}>{customizeContent()}</div>
      ) : (
        options.map((opt) => {
          if ('children' in opt) {
            const group = opt as NestedGroup;
            return (
              <div key={group.label} style={{ marginBottom: 'var(--ctb-space-2)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--ctb-space-2)', fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    checked={group.children.every((c) => vals.includes(c.value))}
                    onChange={() => toggleGroup(group)}
                  />
                  {group.label}
                </label>
                <div style={{ marginLeft: 'var(--ctb-space-5)', marginTop: 'var(--ctb-space-1)' }}>
                  {group.children.map((c) => (
                    <label
                      key={c.value}
                      style={{ display: 'flex', alignItems: 'center', gap: 'var(--ctb-space-2)', marginBottom: 'var(--ctb-space-1)' }}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked(c.value)}
                        onChange={() => toggle(c.value)}
                      />
                      {c.label}
                    </label>
                  ))}
                </div>
              </div>
            );
          }
          const o = opt as NestedOption;
          return (
            <label
              key={o.value}
              style={{ display: 'flex', alignItems: 'center', gap: 'var(--ctb-space-2)', marginBottom: 'var(--ctb-space-1)' }}
            >
              <input
                type="checkbox"
                checked={isChecked(o.value)}
                onChange={() => toggle(o.value)}
              />
              {o.label}
            </label>
          );
        })
      )}
    </div>
  );
};
