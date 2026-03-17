import { IconButton } from '@leao1/design-system';
import { Duplicate, Key } from '@leao1/design-system/icons';
import { useIntl } from 'react-intl';

import { ContentBox } from '../../../../components/ContentBox';
import { useNotification } from '../../../../features/Notifications';
import { useClipboard } from '../../../../hooks/useClipboard';

interface TokenBoxProps {
  token?: string;
  tokenType: 'transfer-token' | 'api-token';
}

export const TokenBox = ({ token }: TokenBoxProps) => {
  const { formatMessage } = useIntl();
  const { toggleNotification } = useNotification();

  const { copy } = useClipboard();

  const handleClick = (token: TokenBoxProps['token']) => async () => {
    if (token) {
      const didCopy = await copy(token);

      if (didCopy) {
        toggleNotification({
          type: 'success',
          message: formatMessage({ id: 'Settings.tokens.notification.copied' }),
        });
      }
    }
  };

  return (
    <ContentBox
      endAction={
        token && (
          <span style={{ alignSelf: 'start' }}>
            <IconButton
              label={formatMessage({
                id: 'app.component.CopyToClipboard.label',
                defaultMessage: 'Copy to clipboard',
              })}
              onClick={handleClick(token)}
              variant="ghost"
              style={{ padding: 0, height: '1.6rem' }}
            >
              <Duplicate />
            </IconButton>
          </span>
        )
      }
      title={
        token ||
        formatMessage({
          id: 'Settings.tokens.copy.editTitle',
          defaultMessage: 'This token isn’t accessible anymore.',
        })
      }
      subtitle={
        token
          ? formatMessage({
              id: 'Settings.tokens.copy.lastWarning',
              defaultMessage: 'Make sure to copy this token, you won’t be able to see it again!',
            })
          : formatMessage({
              id: 'Settings.tokens.copy.editMessage',
              defaultMessage: 'For security reasons, you can only see your token once.',
            })
      }
      icon={<Key />}
      iconBackground="neutral100"
    />
  );
};
