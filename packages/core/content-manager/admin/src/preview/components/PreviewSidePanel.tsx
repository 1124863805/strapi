import * as React from 'react';

import { useClipboard, useNotification } from '@leao1/admin/leao-admin';
import { Button, Flex, IconButton } from '@leao1/design-system';
import { Link as LinkIcon } from '@leao1/icons';
import { UID } from '@leao1/types';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

import { useGetPreviewUrlQuery } from '../services/preview';

import type { PanelComponent } from '@leao1/content-manager/leao-admin';

const PreviewSidePanel: PanelComponent = ({ model, documentId, document }) => {
  const { formatMessage } = useIntl();
  const { toggleNotification } = useNotification();
  const { copy } = useClipboard();
  const { data, error } = useGetPreviewUrlQuery({
    params: {
      contentType: model as UID.ContentType,
    },
    query: {
      documentId,
      locale: document?.locale,
      status: document?.status,
    },
  });

  if (!data?.data?.url || error) {
    return null;
  }

  const { url } = data.data;

  const handleCopyLink = () => {
    copy(url);
    toggleNotification({
      message: formatMessage({
        id: 'content-manager.preview.copy.success',
        defaultMessage: 'Copied preview link',
      }),
      type: 'success',
    });
  };

  return {
    title: formatMessage({ id: 'content-manager.preview.panel.title', defaultMessage: 'Preview' }),
    content: (
      <Flex gap={2} width="100%">
        <Button variant="tertiary" tag={Link} to={url} target="_blank" flex="auto">
          {formatMessage({
            id: 'content-manager.preview.panel.button',
            defaultMessage: 'Open preview',
          })}
        </Button>
        <IconButton
          type="button"
          label={formatMessage({
            id: 'preview.copy.label',
            defaultMessage: 'Copy preview link',
          })}
          onClick={handleCopyLink}
        >
          <LinkIcon />
        </IconButton>
      </Flex>
    ),
  };
};

export { PreviewSidePanel };
