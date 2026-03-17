import { Button, ButtonProps } from '@leao1/design-system';
import { Plus } from '@leao1/design-system/icons';
import { useQueryParams } from '@leao1/admin/leao-admin';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { stringify } from 'qs';

import { getTranslation } from '../../../utils/translations';

interface CreateButtonProps extends Partial<Pick<ButtonProps, 'variant'>> {}

const CreateButton = ({ variant = 'default' }: CreateButtonProps) => {
  const { formatMessage } = useIntl();
  const [{ query }] = useQueryParams<{ plugins: object }>();

  return (
    <Button
      variant={variant}
      tag={Link}
      startIcon={<Plus />}
      style={{ textDecoration: 'none' }}
      to={{
        pathname: 'create',
        search: stringify({ plugins: query.plugins }),
      }}
      minWidth="max-content"
      marginLeft={2}
    >
      {formatMessage({
        id: getTranslation('HeaderLayout.button.label-add-entry'),
        defaultMessage: 'Create new entry',
      })}
    </Button>
  );
};

export { CreateButton };
