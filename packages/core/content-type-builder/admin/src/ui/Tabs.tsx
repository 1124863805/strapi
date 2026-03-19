import * as React from 'react';
import * as RadixTabs from '@radix-ui/react-tabs';
import { styled } from 'styled-components';

const TabsCtx = React.createContext<{ hasError?: string }>({});

const TabsRoot = ({
  hasError,
  ...props
}: RadixTabs.TabsProps & { variant?: string; hasError?: string }) => (
  <TabsCtx.Provider value={{ hasError }}>
    <RadixTabs.Root {...props} />
  </TabsCtx.Provider>
);

const TabsList = styled(RadixTabs.List)`
  display: flex;
  gap: 0;
`;

const TabsTriggerStyled = styled(RadixTabs.Trigger)<{ $hasError?: boolean }>`
  padding: var(--ctb-space-3) var(--ctb-space-4);
  font-size: 14px;
  font-weight: 600;
  color: ${(p) => (p.$hasError ? 'var(--ctb-danger)' : 'var(--ctb-text-muted)')};
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  font-family: var(--ctb-font, "PingFang SC", "Microsoft YaHei", "Hiragino Sans GB", sans-serif);
  &[data-state='active'] {
    color: ${(p) => (p.$hasError ? 'var(--ctb-danger)' : 'var(--ctb-primary)')};
    border-bottom-color: currentColor;
  }
`;

const TabsTrigger = React.forwardRef<
  HTMLButtonElement,
  RadixTabs.TabsTriggerProps & { $hasError?: boolean }
>(({ value, ...props }, ref) => {
  const { hasError } = React.useContext(TabsCtx);
  const $hasError = Boolean(props.$hasError ?? (value && hasError === value));
  return <TabsTriggerStyled ref={ref} value={value} $hasError={$hasError} {...props} />;
});

const TabsContent = styled(RadixTabs.Content)`
  outline: none;
`;

export const Tabs = {
  Root: TabsRoot,
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
};
