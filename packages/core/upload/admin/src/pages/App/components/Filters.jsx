import * as React from 'react';

import { useQueryParams } from '@leao1/admin/leao-admin';
import { Button, Popover } from '@leao1/design-system';
import { Filter } from '@leao1/design-system/icons';
import { useIntl } from 'react-intl';

import FilterList from '../../../components/FilterList';
import FilterPopover from '../../../components/FilterPopover';
import { displayedFilters } from '../../../utils';

export const Filters = () => {
  const [open, setOpen] = React.useState(false);
  const { formatMessage } = useIntl();
  const [{ query }, setQuery] = useQueryParams();
  const filters = query?.filters?.$and || [];

  const handleRemoveFilter = (nextFilters) => {
    setQuery({ filters: { $and: nextFilters }, page: 1 });
  };

  const handleSubmit = (filters) => {
    setQuery({ filters: { $and: filters }, page: 1 });
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger>
        <Button variant="tertiary" startIcon={<Filter />} size="S">
          {formatMessage({ id: 'app.utils.filters', defaultMessage: 'Filters' })}
        </Button>
      </Popover.Trigger>
      <FilterPopover
        displayedFilters={displayedFilters}
        filters={filters}
        onToggle={setOpen}
        onSubmit={handleSubmit}
      />
      <FilterList
        appliedFilters={filters}
        filtersSchema={displayedFilters}
        onRemoveFilter={handleRemoveFilter}
      />
    </Popover.Root>
  );
};
