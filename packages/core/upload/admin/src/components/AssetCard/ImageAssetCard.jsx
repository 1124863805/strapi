import React from 'react';

import { CardAsset } from '@leao1/design-system';
import PropTypes from 'prop-types';

import { appendSearchParamsToUrl } from '../../utils';

import { AssetCardBase } from './AssetCardBase';

export const ImageAssetCard = ({
  height = undefined,
  width = undefined,
  thumbnail,
  size = 'M',
  alt,
  isUrlSigned,
  selected = false,
  onEdit = undefined,
  onSelect = undefined,
  onRemove = undefined,
  updatedAt = undefined,
  ...props
}) => {
  // appending the updatedAt param to the thumbnail URL prevents it from being cached by the browser (cache busting)
  // applied only if the url is not signed to prevent the signature from being invalidated
  const thumbnailUrl = isUrlSigned
    ? thumbnail
    : appendSearchParamsToUrl({
        url: thumbnail,
        params: { updatedAt },
      });

  return (
    <AssetCardBase
      {...props}
      selected={selected}
      onEdit={onEdit}
      onSelect={onSelect}
      onRemove={onRemove}
      subtitle={height && width && ` - ${width}✕${height}`}
      variant="Image"
    >
      <CardAsset src={thumbnailUrl} size={size} alt={alt} />
    </AssetCardBase>
  );
};

ImageAssetCard.propTypes = {
  alt: PropTypes.string.isRequired,
  extension: PropTypes.string.isRequired,
  height: PropTypes.number,
  name: PropTypes.string.isRequired,
  onEdit: PropTypes.func,
  onSelect: PropTypes.func,
  onRemove: PropTypes.func,
  width: PropTypes.number,
  thumbnail: PropTypes.string.isRequired,
  selected: PropTypes.bool,
  size: PropTypes.oneOf(['S', 'M']),
  updatedAt: PropTypes.string,
  isUrlSigned: PropTypes.bool.isRequired,
};
