import React from 'react';

import { ConfirmDialog } from '@leao/admin/leao-admin';
import { Dialog } from '@leao/design-system';
import PropTypes from 'prop-types';

export const RemoveFolderDialog = ({ onClose, onConfirm, open }) => {
  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <ConfirmDialog onConfirm={onConfirm} />
    </Dialog.Root>
  );
};

RemoveFolderDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default RemoveFolderDialog;
