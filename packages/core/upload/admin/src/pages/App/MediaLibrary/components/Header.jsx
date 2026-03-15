import React from 'react';

import { useQueryParams, Layouts } from '@leao1/admin/leao-admin';
import { Button, Flex, Link } from '@leao1/design-system';
import { ArrowLeft, Plus } from '@leao1/icons';
import PropTypes from 'prop-types';
import { stringify } from 'qs';
import { useIntl } from 'react-intl';
import { useLocation, NavLink } from 'react-router-dom';

import { Breadcrumbs } from '../../../../components/Breadcrumbs';
import { BreadcrumbsDefinition, FolderDefinition } from '../../../../constants';
import { getTrad } from '../../../../utils';

export const Header = ({
  breadcrumbs = false,
  canCreate,
  folder = null,
  onToggleEditFolderDialog,
  onToggleUploadAssetDialog,
}) => {
  const { formatMessage } = useIntl();
  const { pathname } = useLocation();
  const [{ query }] = useQueryParams();
  const backQuery = {
    ...query,
    folder: folder?.parent?.id ?? undefined,
    folderPath: folder?.parent?.path ?? undefined,
  };

  return (
    <Layouts.Header
      title={formatMessage({
        id: getTrad('plugin.name'),
        defaultMessage: `Media Library`,
      })}
      subtitle={
        breadcrumbs &&
        folder && (
          <Breadcrumbs
            tag="nav"
            label={formatMessage({
              id: getTrad('header.breadcrumbs.nav.label'),
              defaultMessage: 'Folders navigation',
            })}
            breadcrumbs={breadcrumbs}
            currentFolderId={folder?.id}
          />
        )
      }
      navigationAction={
        folder && (
          <Link
            tag={NavLink}
            startIcon={<ArrowLeft />}
            to={`${pathname}?${stringify(backQuery, { encode: false })}`}
          >
            {formatMessage({
              id: getTrad('header.actions.folder-level-up'),
              defaultMessage: 'Back',
            })}
          </Link>
        )
      }
      primaryAction={
        canCreate && (
          <Flex gap={2}>
            <Button startIcon={<Plus />} variant="secondary" onClick={onToggleEditFolderDialog}>
              {formatMessage({
                id: getTrad('header.actions.add-folder'),
                defaultMessage: 'Add new folder',
              })}
            </Button>

            <Button startIcon={<Plus />} onClick={onToggleUploadAssetDialog}>
              {formatMessage({
                id: getTrad('header.actions.add-assets'),
                defaultMessage: 'Add new assets',
              })}
            </Button>
          </Flex>
        )
      }
    />
  );
};

Header.propTypes = {
  breadcrumbs: PropTypes.oneOfType([BreadcrumbsDefinition, PropTypes.bool]),
  canCreate: PropTypes.bool.isRequired,
  folder: FolderDefinition,
  onToggleEditFolderDialog: PropTypes.func.isRequired,
  onToggleUploadAssetDialog: PropTypes.func.isRequired,
};
