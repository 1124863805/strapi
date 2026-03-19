import { useState, useEffect, useMemo, useRef } from 'react';

import { Input, Dropdown } from 'antd';

import { Field } from '../ui';
import { useIntl } from 'react-intl';

import { useDataManager } from '../hooks/useDataManager';
import { getTrad } from '../utils/getTrad';

interface SelectCategoryProps {
  error?: string | null;
  intlLabel: {
    id: string;
    defaultMessage: string;
    values?: Record<string, any>;
  };
  name: string;
  onChange: (value: { target: { name: string; value: any; type: string } }) => void;
  value?: string;
  isCreating?: boolean;
  dynamicZoneTarget?: string | null;
}

export const SelectCategory = ({
  error = null,
  intlLabel,
  name,
  onChange,
  value = undefined,
  isCreating,
  dynamicZoneTarget,
}: SelectCategoryProps) => {
  const { formatMessage } = useIntl();
  const { allComponentsCategories } = useDataManager();
  const [locallyCreated, setLocallyCreated] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [open, setOpen] = useState(false);
  const inputRef = useRef<any>(null);

  const categories = useMemo(
    () => [...new Set([...allComponentsCategories, ...locallyCreated])],
    [allComponentsCategories, locallyCreated]
  );

  useEffect(() => {
    setLocallyCreated((prev) => prev.filter((c) => !allComponentsCategories.includes(c)));
  }, [allComponentsCategories]);

  const errorMessage = error ? formatMessage({ id: error, defaultMessage: error }) : '';
  const label = formatMessage(intlLabel);
  const placeholder = formatMessage(intlLabel);

  const handleChange = (val: string) => {
    onChange({ target: { name, value: val, type: 'select-category' } });
    setOpen(false);
  };

  const handleCreateOption = (newCategory: string) => {
    const trimmed = newCategory.trim();
    if (!trimmed) return;
    setLocallyCreated((prev) => (prev.includes(trimmed) ? prev : [...prev, trimmed]));
    handleChange(trimmed);
    setSearchValue('');
  };

  const trimmedSearch = searchValue.trim();
  const canCreate = trimmedSearch && !categories.some((c) => c.toLowerCase() === trimmedSearch.toLowerCase());
  const filteredCategories = useMemo(
    () =>
      trimmedSearch
        ? categories.filter((c) => c.toLowerCase().includes(trimmedSearch.toLowerCase()))
        : categories,
    [categories, trimmedSearch]
  );

  const dropdownContent = (
    <div
      className="ctb-select-category-dropdown"
      style={{
        background: 'var(--ctb-bg-elevated)',
        border: '1px solid var(--ctb-border)',
        borderRadius: 'var(--ctb-radius-sm)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        minWidth: 200,
        maxHeight: 240,
        overflowY: 'auto',
      }}
    >
      {filteredCategories.length > 0 && (
        <div style={{ padding: 'var(--ctb-space-1) 0' }}>
          {filteredCategories.map((c) => (
            <div
              key={c}
              role="option"
              tabIndex={0}
              onClick={() => handleChange(c)}
              onKeyDown={(e) => e.key === 'Enter' && handleChange(c)}
              style={{
                padding: 'var(--ctb-space-2) var(--ctb-space-3)',
                cursor: 'pointer',
                fontSize: 14,
                color: 'var(--ctb-text)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--ctb-bg-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              {c}
            </div>
          ))}
        </div>
      )}
      {canCreate && (
        <div
          role="button"
          tabIndex={0}
          onClick={() => handleCreateOption(trimmedSearch)}
          onKeyDown={(e) => e.key === 'Enter' && handleCreateOption(trimmedSearch)}
          style={{
            padding: 'var(--ctb-space-2) var(--ctb-space-3)',
            cursor: 'pointer',
            borderTop: '1px solid var(--ctb-border-subtle)',
            color: 'var(--ctb-primary)',
            fontSize: 14,
          }}
        >
          {formatMessage(
            { id: getTrad('modalForm.components.create-component.category.create'), defaultMessage: '创建 "{name}"' },
            { name: trimmedSearch }
          )}
        </div>
      )}
      {filteredCategories.length === 0 && !canCreate && (
        <div style={{ padding: 'var(--ctb-space-4)', color: 'var(--ctb-text-muted)', fontSize: 14 }}>
          {formatMessage({ id: getTrad('form.input.noResults'), defaultMessage: '无匹配结果' })}
        </div>
      )}
    </div>
  );

  const displayValue = open ? searchValue : (value ?? '');

  return (
    <Field.Root error={errorMessage} name={name}>
      <Field.Label>{label}</Field.Label>
      <Dropdown
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) setSearchValue('');
        }}
        dropdownRender={() => dropdownContent}
        trigger={['click']}
        disabled={!isCreating && !dynamicZoneTarget}
      >
        <Input
          ref={inputRef}
          value={displayValue}
          placeholder={placeholder}
          disabled={!isCreating && !dynamicZoneTarget}
          onChange={(e) => setSearchValue(e.target.value)}
          onFocus={() => {
            setOpen(true);
            setSearchValue(value ?? '');
          }}
          style={{
            width: '100%',
          }}
        />
      </Dropdown>
      <Field.Error />
    </Field.Root>
  );
};
