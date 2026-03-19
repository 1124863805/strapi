/**
 * antd 包装层 - 从 antd 导出并提供兼容旧 API 的包装
 */
import * as React from 'react';
import {
  Button as AntdButton,
  Modal as AntdModal,
  Input,
  Empty as AntdEmpty,
  Divider as AntdDivider,
  ConfigProvider,
} from 'antd';
import zhCN from 'antd/locale/zh_CN';
import {
  PlusOutlined,
  CheckOutlined,
  EditOutlined,
  DeleteOutlined,
  LockOutlined,
  CloseOutlined,
} from '@ant-design/icons';

// Re-export antd
export { Input, ConfigProvider };
export { zhCN as antdZhCN };

// Button - 兼容 variant, startIcon, type(htmlType), width, justifyContent
type OurButtonOverrides = {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'danger' | 'default';
  startIcon?: React.ReactNode;
  size?: 'S' | 'M' | 'L';
  type?: 'button' | 'submit' | 'reset';
  width?: string;
  justifyContent?: string;
};
type ButtonProps = OurButtonOverrides &
  Omit<React.ComponentProps<typeof AntdButton>, keyof OurButtonOverrides | 'htmlType'>;
export const Button = ({
  variant = 'primary',
  startIcon,
  children,
  size,
  type: htmlType,
  width,
  justifyContent,
  style,
  ...rest
}: ButtonProps): React.ReactElement => {
  const buttonType: 'primary' | 'default' =
    variant === 'danger' ? 'primary' : variant === 'primary' || variant === 'default' ? 'primary' : 'default';
  const danger = variant === 'danger';
  const antdSize = size === 'L' ? 'large' : size === 'S' ? 'small' : 'middle';
  return (
    <AntdButton
      type={buttonType}
      danger={danger}
      icon={startIcon}
      size={antdSize}
      htmlType={htmlType}
      style={{ width, justifyContent, ...style }}
      {...rest}
    >
      {children}
    </AntdButton>
  );
};

// Modal - 兼容 Modal.Root, Modal.Content, Modal.Body, Modal.Footer, Modal.Header, Modal.Title
interface ModalRootProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  width?: number;
  className?: string;
  bodyMaxHeight?: string;
  children: React.ReactNode;
}
const ModalRoot = ({
  open,
  onOpenChange,
  width = 640,
  className,
  bodyMaxHeight = '70vh',
  children,
}: ModalRootProps): React.ReactElement => (
  <AntdModal
    open={open}
    onCancel={() => onOpenChange?.(false)}
    footer={null}
    width={width}
    closable={false}
    className={['ctb-modal', className].filter(Boolean).join(' ')}
    styles={{
      body: { maxHeight: bodyMaxHeight, overflowY: 'auto', padding: 0 },
      content: { padding: 0 },
    }}
    destroyOnClose
  >
    {children}
  </AntdModal>
);

interface ModalContentProps {
  children: React.ReactNode;
  className?: string;
}
const ModalContent = ({ children }: ModalContentProps): React.ReactElement => <>{children}</>;

const ModalBody = ({ children }: { children: React.ReactNode }): React.ReactElement => (
  <div className="ctb-modal-body">{children}</div>
);
const ModalFooter = ({ children }: { children: React.ReactNode }): React.ReactElement => (
  <div className="ctb-modal-footer">{children}</div>
);
const ModalHeader = ({ children }: { children: React.ReactNode }): React.ReactElement => (
  <div className="ctb-modal-header">{children}</div>
);
const ModalTitle = ({ children }: { children: React.ReactNode }): React.ReactElement => (
  <h2 className="ctb-modal-title">{children}</h2>
);

// Close: asChild 时渲染子元素并注入 onClick；否则渲染 AntdButton。需传入 onClose（来自 Modal.Root 的 onOpenChange）
const ModalClose = ({
  asChild,
  children,
  onClick,
  onClose,
  ...rest
}: { asChild?: boolean; children?: React.ReactNode; onClose?: () => void } & React.ComponentProps<typeof AntdButton>) => {
  const handleClick = (e: React.MouseEvent) => {
    onClose?.();
    (onClick as React.MouseEventHandler)?.(e);
  };
  if (asChild && children && React.isValidElement(children)) {
    return React.cloneElement(
      children as React.ReactElement<{ onClick?: React.MouseEventHandler }>,
      { onClick: handleClick }
    );
  }
  if (asChild && children) return <>{children}</>;
  return <AntdButton type="text" icon={<CloseOutlined />} onClick={handleClick} {...rest} />;
};

const ModalCloseButton = ({
  onClick,
  children,
  'aria-label': ariaLabel,
  ...rest
}: { onClick?: () => void; children?: React.ReactNode; 'aria-label'?: string }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={ariaLabel}
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 32,
      height: 32,
      padding: 0,
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      borderRadius: 'var(--ctb-radius-sm)',
    }}
    {...rest}
  >
    {children ?? <CloseOutlined />}
  </button>
);

export const Modal = {
  Root: ModalRoot,
  Content: ModalContent,
  Body: ModalBody,
  Footer: ModalFooter,
  Header: ModalHeader,
  Title: ModalTitle,
  Trigger: AntdButton,
  Close: ModalClose,
  CloseButton: ModalCloseButton,
};

// Tabs - 保留原有实现（Radix），后续可迁移至 antd
export { Tabs } from './Tabs';

// Typography - 保留原有实现以兼容 variant, textColor, tag 等 API
export { Typography } from './Typography';

// Divider - 兼容 marginBottom, marginTop
interface DividerProps {
  marginBottom?: number;
  marginTop?: number;
  background?: string;
}
export const Divider = ({ marginBottom, marginTop, background, ...rest }: DividerProps): React.ReactElement => (
  <AntdDivider
    style={{
      marginBottom: marginBottom != null ? marginBottom * 4 : undefined,
      marginTop: marginTop != null ? marginTop * 4 : undefined,
      background: background === 'neutral200' ? 'var(--ctb-border)' : background,
    }}
    {...rest}
  />
);

// Flex - 保留原有实现以兼容 direction, gap 等 API
export { Flex } from './Flex';

// Box - 保留原有实现
export { Box } from './Box';

// Empty - 兼容 icon, content, action
interface EmptyStateProps {
  icon?: React.ReactNode;
  content: string;
  action?: React.ReactNode;
}
export const EmptyState = ({ icon, content, action }: EmptyStateProps): React.ReactElement => (
  <AntdEmpty image={icon} description={content}>
    {action}
  </AntdEmpty>
);

// Dialog - 用于 FormModalEndActions 的确认弹窗，用 antd Modal 实现
interface DialogRootProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}
export const Dialog = {
  Root: ({ open, onOpenChange, children }: DialogRootProps): React.ReactElement => (
    <AntdModal open={open} onCancel={() => onOpenChange?.(false)} footer={null} closable={false}>
      {children}
    </AntdModal>
  ),
};

// Icons - 从 @ant-design/icons 导出，兼容旧 API
export const Plus = (p: React.SVGProps<SVGSVGElement> & { width?: number; height?: number }): React.ReactElement => (
  <PlusOutlined style={{ fontSize: (p.width ?? p.height ?? 16) }} />
);
export const Check = (p: React.SVGProps<SVGSVGElement>): React.ReactElement => (
  <CheckOutlined style={{ fontSize: 16 }} />
);
export const Pencil = (p: React.SVGProps<SVGSVGElement>): React.ReactElement => (
  <EditOutlined style={{ fontSize: 16 }} />
);
export const Trash = (p: React.SVGProps<SVGSVGElement>): React.ReactElement => (
  <DeleteOutlined style={{ fontSize: 16 }} />
);
export const Lock = (p: React.SVGProps<SVGSVGElement>): React.ReactElement => (
  <LockOutlined style={{ fontSize: 16 }} />
);
export const Layout = (p: React.SVGProps<SVGSVGElement>): React.ReactElement => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={16} height={16}>
    <path d="M4 5v14h16V5H4zm4 2v4H6V7h2zm10 0h2v4h-2V7zm-10 6v4H6v-4h2zm2 0h8v4h-8v-4zm10 0h2v4h-2v-4z" />
  </svg>
);
export const ListPlus = (p: React.SVGProps<SVGSVGElement>): React.ReactElement => (
  <PlusOutlined style={{ fontSize: 16 }} />
);

export { Clock, ArrowClockwise, Eye, EyeStriked, Search, ArrowLeft, Cross, Sparkle } from './icons-ext';

// 业务图标 - 保留 symbols
export { EmptyDocuments } from './symbols';
export * from './symbols';

// Field - 映射到 Form.Item 兼容层
export { Field, FieldContext } from './Field';

// 其他保留组件
export { TextInput } from './TextInput';
export { Textarea } from './Textarea';
export { SingleSelect, SingleSelectOption } from './SingleSelect';
export { MultiSelectNested } from './MultiSelectNested';
export { Checkbox } from './Checkbox';
export { Toggle } from './Toggle';
export { Link } from './Link';
export { Grid } from './Grid';
export { KeyboardNavigable } from './KeyboardNavigable';
export { Breadcrumbs, Crumb } from './Breadcrumbs';
export { LinkButton } from './LinkButton';
export { inputFocusStyle } from './inputFocusStyle';
export { Menu } from './Menu';
export { IconButton } from './IconButton';
export { ModalActionView } from './ModalActionView';
export { Searchbar } from './Searchbar';
export { Tooltip } from './Tooltip';
export { VisuallyHidden } from './VisuallyHidden';
export { NumberInput } from './NumberInput';
export { DatePicker } from './DatePicker';
export { DateTimePicker } from './DateTimePicker';
export { TimePicker } from './TimePicker';
export { JSONInput } from './JSONInput';
export { Combobox, ComboboxOption } from './Combobox';
