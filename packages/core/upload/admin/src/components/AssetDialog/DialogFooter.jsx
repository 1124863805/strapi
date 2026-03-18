import * as React from 'react';

import { Button, Modal } from '@leao1/design-system';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

export const DialogFooter = ({ onClose, onValidate = undefined }) => {
  const { formatMessage } = useIntl();

  return (
    <Modal.Footer>
      <Button onClick={onClose} variant="tertiary">
        {formatMessage({ id: 'app.components.Button.cancel', defaultMessage: 'Cancel' })}
      </Button>
      {onValidate && (
        <Button onClick={onValidate}>
          {formatMessage({ id: 'global.finish', defaultMessage: 'Finish' })}
        </Button>
      )}
    </Modal.Footer>
  );
};

DialogFooter.propTypes = {
  onClose: PropTypes.func.isRequired,
  onValidate: PropTypes.func,
};
