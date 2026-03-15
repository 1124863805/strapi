import * as React from 'react';

import { Button, Flex, Tooltip } from '@leao1/design-system';
import { Mail, WarningCircle } from '@leao1/icons';
import isNil from 'lodash/isNil';
import { useIntl } from 'react-intl';

import { useEEInfo } from '../../../../../hooks/useEEInfo';

import type { CreateActionCEProps } from '../../../../../../../../admin/src/pages/Settings/pages/Users/components/CreateActionCE';

export const CreateActionEE = React.forwardRef<HTMLButtonElement, CreateActionCEProps>(
  (props, ref) => {
    const { formatMessage } = useIntl();
    const { info, isError, isLoading } = useEEInfo();

    const { permittedSeats, shouldStopCreate } = info ?? {};

    if (isError || isLoading) {
      return null;
    }

    return (
      <Flex gap={2}>
        {!isNil(permittedSeats) && shouldStopCreate && (
          <Tooltip
            label={formatMessage({
              id: 'Settings.application.admin-seats.at-limit-tooltip',
              defaultMessage: 'At limit: add seats to invite more users',
            })}
            side="left"
          >
            <WarningCircle width="1.4rem" height="1.4rem" fill="danger500" />
          </Tooltip>
        )}
        <Button
          ref={ref}
          data-testid="create-user-button"
          startIcon={<Mail />}
          size="S"
          disabled={shouldStopCreate}
          {...props}
        >
          {formatMessage({
            id: 'Settings.permissions.users.create',
            defaultMessage: 'Invite new user',
          })}
        </Button>
      </Flex>
    );
  }
);
