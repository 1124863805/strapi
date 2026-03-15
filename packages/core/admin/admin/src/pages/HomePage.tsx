import * as React from 'react';

import { Main } from '@leao/design-system';
import { useIntl } from 'react-intl';

import { Layouts } from '../components/Layouts/Layout';
import { Page } from '../components/PageHelpers';
import { useEnterprise } from '../hooks/useEnterprise';

/* -------------------------------------------------------------------------------------------------
 * HomePageCE
 * -----------------------------------------------------------------------------------------------*/

const HomePageCE = () => {
  const { formatMessage } = useIntl();

  return (
    <Layouts.Root>
      <Page.Title>
        {formatMessage({
          id: 'HomePage.head.title',
          defaultMessage: 'Homepage',
        })}
      </Page.Title>
      <Main />
    </Layouts.Root>
  );
};

/* -------------------------------------------------------------------------------------------------
 * HomePage
 * -----------------------------------------------------------------------------------------------*/

const HomePage = () => {
  const Page = useEnterprise(
    HomePageCE,
    // eslint-disable-next-line import/no-cycle
    async () => (await import('../../../ee/admin/src/pages/HomePage')).HomePageEE
  );

  if (!Page) {
    return null;
  }

  return <Page />;
};

export { HomePage, HomePageCE };
