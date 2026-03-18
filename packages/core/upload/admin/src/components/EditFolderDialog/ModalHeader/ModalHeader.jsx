import React from 'react';

import { Modal } from '@leao1/design-system';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { getTrad } from '../../../utils';

export const EditFolderModalHeader = ({ isEditing = false }) => {
  const { formatMessage } = useIntl();

  return (
    <Modal.Header>
      <Modal.Title>
        {formatMessage(
          isEditing
            ? {
                id: getTrad('modal.folder.edit.title'),
                defaultMessage: 'Edit folder',
              }
            : {
                id: getTrad('modal.folder.create.title'),
                defaultMessage: 'Add new folder',
              }
        )}
      </Modal.Title>
    </Modal.Header>
  );
};

EditFolderModalHeader.propTypes = {
  isEditing: PropTypes.bool,
};
