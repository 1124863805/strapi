/**
 * NotFoundPage
 *
 * This is the page we show when the user visits a url that doesn't have a route
 *
 */
import { LinkButton } from '@leao1/design-system';
import { EmptyStateLayout } from '@leao1/design-system';
import { ArrowRight } from '@leao1/design-system/icons';
import { EmptyPictures } from '@leao1/design-system/symbols';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

import { Layouts } from '../components/Layouts/Layout';
import { Page } from '../components/PageHelpers';

export const NotFoundPage = () => {
  const { formatMessage } = useIntl();

  return (
    <Page.Main labelledBy="title">
      <Layouts.Header
        id="title"
        title={formatMessage({
          id: 'content-manager.pageNotFound',
          defaultMessage: 'Page not found',
        })}
      />
      <Layouts.Content>
        <EmptyStateLayout
          action={
            <LinkButton tag={Link} variant="secondary" endIcon={<ArrowRight />} to="/">
              {formatMessage({
                id: 'app.components.NotFoundPage.back',
                defaultMessage: 'Back to homepage',
              })}
            </LinkButton>
          }
          content={formatMessage({
            id: 'app.page.not.found',
            defaultMessage: "Oops! We can't seem to find the page you're looging for...",
          })}
          hasRadius
          icon={<EmptyPictures width="16rem" />}
          shadow="tableShadow"
        />
      </Layouts.Content>
    </Page.Main>
  );
};
