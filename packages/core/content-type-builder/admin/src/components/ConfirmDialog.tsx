/**
 * CTB 专用确认弹窗 - 渲染内容供 Dialog.Root (antd Modal) 使用，避免 DialogPortal 错误
 * API 与 @leao1/admin ConfirmDialog 兼容
 */
import * as React from 'react';
import { Button } from 'antd';
import { useIntl } from 'react-intl';

interface ConfirmDialogProps {
  onConfirm?: (e?: React.MouseEvent<HTMLButtonElement>) => Promise<void> | void;
  onCancel?: () => void;
  children?: React.ReactNode;
  title?: React.ReactNode;
  /** 自定义确认按钮区域，替代默认 Confirm 按钮 */
  endAction?: React.ReactNode;
}

export const ConfirmDialog = ({
  children,
  onConfirm,
  onCancel,
  title,
  endAction,
}: ConfirmDialogProps) => {
  const { formatMessage } = useIntl();
  const [isConfirming, setIsConfirming] = React.useState(false);

  const content =
    children ||
    formatMessage({
      id: 'app.confirm.body',
      defaultMessage: 'Are you sure?',
    });

  const handleConfirm = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!onConfirm) return;
    try {
      setIsConfirming(true);
      await onConfirm(e);
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <div className="ctb-confirm-dialog">
      <div className="ctb-confirm-dialog-header">
        {title ||
          formatMessage({
            id: 'app.components.ConfirmDialog.title',
            defaultMessage: 'Confirmation',
          })}
      </div>
      <div className="ctb-confirm-dialog-body">{content}</div>
      <div className="ctb-confirm-dialog-footer">
        <Button type="default" onClick={onCancel}>
          {formatMessage({
            id: 'app.components.Button.cancel',
            defaultMessage: 'Cancel',
          })}
        </Button>
        {endAction ?? (
          <Button type="primary" danger onClick={handleConfirm} loading={isConfirming}>
            {formatMessage({
              id: 'app.components.Button.confirm',
              defaultMessage: 'Confirm',
            })}
          </Button>
        )}
      </div>
    </div>
  );
};
