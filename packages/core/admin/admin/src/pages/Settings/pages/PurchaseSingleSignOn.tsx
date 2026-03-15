import { Box, Main, EmptyStateLayout, LinkButton } from '@leao/design-system';
import { ExternalLink } from '@leao/icons';
import { EmptyPermissions } from '@leao/icons/symbols';
import { useIntl } from 'react-intl';

import { Layouts } from '../../../components/Layouts/Layout';

const PurchaseSingleSignOn = () => {
  const { formatMessage } = useIntl();

  return (
    <Layouts.Root>
      <Main>
        <Layouts.Header
          title={formatMessage({
            id: 'Settings.sso.title',
            defaultMessage: 'Single Sign-On',
          })}
          subtitle={formatMessage({
            id: 'Settings.sso.subTitle',
            defaultMessage: 'Configure the settings for the Single Sign-On feature.',
          })}
        />
        <Box paddingLeft={10} paddingRight={10}>
          <EmptyStateLayout
            icon={<EmptyPermissions width="16rem" />}
            content={formatMessage({
              id: 'Settings.sso.not-available',
              defaultMessage:
                'SSO is only available as part of a paid plan. Upgrade to configure additional sign-in & sign-up methods for your administration panel.',
            })}
            action={
              <LinkButton
                variant="default"
                endIcon={<ExternalLink />}
                href="#"
                isExternal
                target="_blank"
              >
                {formatMessage({
                  id: 'global.learn-more',
                  defaultMessage: 'Learn more',
                })}
              </LinkButton>
            }
          />
        </Box>
      </Main>
    </Layouts.Root>
  );
};

export { PurchaseSingleSignOn };
