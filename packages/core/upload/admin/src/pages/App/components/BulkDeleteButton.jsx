import * as React from 'react';

import { ConfirmDialog } from '@leao1/admin/leao-admin';
import { Button, Dialog } from '@leao1/design-system';
import { Trash } from '@leao1/icons';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { AssetDefinition, FolderDefinition } from '../../../constants';
import { useBulkRemove } from '../../../hooks/useBulkRemove';

export const BulkDeleteButton = ({ selected, onSuccess }) => {
  const { formatMessage } = useIntl();
  const { remove } = useBulkRemove();

  const handleConfirmRemove = async () => {
    await remove(selected);
    onSuccess();
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button variant="danger-light" size="S" startIcon={<Trash />}>
          {formatMessage({ id: 'global.delete', defaultMessage: 'Delete' })}
        </Button>
      </Dialog.Trigger>
      <ConfirmDialog onConfirm={handleConfirmRemove} />
    </Dialog.Root>
  );
};

BulkDeleteButton.propTypes = {
  selected: PropTypes.arrayOf(AssetDefinition, FolderDefinition).isRequired,
  onSuccess: PropTypes.func.isRequired,
};
