import * as React from 'react';

interface MenuContextValue {
  onSelect?: (value: any) => void;
}

const MenuContext = React.createContext<MenuContextValue>({});

const Root = ({ children }: { children: React.ReactNode }) => (
  <MenuContext.Provider value={{}}>{children}</MenuContext.Provider>
);

const Trigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode }
>(({ children, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    style={{
      padding: 'var(--ctb-space-2) var(--ctb-space-3)',
      border: '1px solid var(--ctb-border)',
      borderRadius: 'var(--ctb-radius-sm)',
      background: 'var(--ctb-bg-elevated)',
      cursor: 'pointer',
    }}
    {...props}
  >
    {children}
  </button>
));

const Content = ({
  children,
  zIndex,
}: {
  children: React.ReactNode;
  zIndex?: string;
}) => <div style={{ zIndex: zIndex ? 1000 : undefined }}>{children}</div>;

const Item = ({
  children,
  onSelect,
}: {
  children: React.ReactNode;
  onSelect?: () => void;
}) => (
  <div
    role="menuitem"
    onClick={onSelect}
    style={{
      padding: 'var(--ctb-space-2) var(--ctb-space-3)',
      cursor: 'pointer',
      fontSize: 14,
    }}
    onKeyDown={(e) => e.key === 'Enter' && onSelect?.()}
  >
    {children}
  </div>
);

export const Menu = { Root, Trigger, Content, Item };
