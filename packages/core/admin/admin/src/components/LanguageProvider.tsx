import * as React from 'react';

import defaultsDeep from 'lodash/defaultsDeep';
import { IntlProvider } from 'react-intl';

import { useTypedSelector } from '../core/store/hooks';

/* -------------------------------------------------------------------------------------------------
 * LanguageProvider
 * -----------------------------------------------------------------------------------------------*/

interface LanguageProviderProps {
  children: React.ReactNode;
  messages: Record<string, Record<string, string>>;
}

const LanguageProvider = ({ children, messages }: LanguageProviderProps) => {
  const locale = useTypedSelector((state) => state.admin_app.language.locale);
  const appMessages = defaultsDeep(messages[locale], messages['zh-Hans'], messages.en);

  return (
    <IntlProvider locale={locale} defaultLocale="zh-Hans" messages={appMessages} textComponent="span">
      {children}
    </IntlProvider>
  );
};

export { LanguageProvider };
export type { LanguageProviderProps };
