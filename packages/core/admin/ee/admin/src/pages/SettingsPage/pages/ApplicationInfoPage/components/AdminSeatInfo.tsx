import { Flex, Typography, Grid } from '@leao1/design-system';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';

import { useRBAC } from '../../../../../../../../admin/src/hooks/useRBAC';
import { selectAdminPermissions } from '../../../../../../../../admin/src/selectors';
import { useEEInfo } from '../../../../../hooks/useEEInfo';

export const AdminSeatInfoEE = () => {
  const { formatMessage } = useIntl();
  const { settings } = useSelector(selectAdminPermissions);
  const {
    isLoading: isRBACLoading,
    allowedActions: { canRead, canCreate, canUpdate, canDelete },
  } = useRBAC(settings?.users ?? {});
  const {
    info,
    isError,
    isLoading: isInfoLoading,
  } = useEEInfo({
    // TODO: this creates a waterfall which we should avoid to render earlier, but for that
    // we will have to move away from data-fetching hooks to query functions.
    // Short-term we could at least implement a loader, for the user to have visual feedback
    // in case the requests take a while
    enabled: !isRBACLoading && canRead && canCreate && canUpdate && canDelete,
  });

  const isLoading = isRBACLoading || isInfoLoading;

  if (isError || isLoading || !info?.permittedSeats) {
    return null;
  }

  const { enforcementUserCount, permittedSeats } = info;

  return (
    <Grid.Item col={6} s={12} direction="column" alignItems="stretch">
      <Typography variant="sigma" textColor="neutral600">
        {formatMessage({
          id: 'Settings.application.admin-seats',
          defaultMessage: 'Admin seats',
        })}
      </Typography>
      <Flex gap={2}>
        <Typography tag="p">
          {formatMessage(
            {
              id: 'Settings.application.ee.admin-seats.count',
              defaultMessage: '<text>{enforcementUserCount}</text>/{permittedSeats}',
            },
            {
              permittedSeats,
              enforcementUserCount,
              text: (chunks) => (
                <Typography fontWeight="semiBold" as="span">
                  {chunks}
                </Typography>
              ) as any,
            }
          )}
        </Typography>
      </Flex>
    </Grid.Item>
  );
};
