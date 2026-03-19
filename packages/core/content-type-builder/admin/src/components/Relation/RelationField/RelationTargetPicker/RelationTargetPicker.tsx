import { useDispatch } from 'react-redux';

import { useDataManager } from '../../../../hooks/useDataManager';
import { isAllowedContentTypesForRelations } from '../../../../utils';
import { ON_CHANGE_RELATION_TARGET } from '../../../FormModal/constants';

interface RelationTargetPickerProps {
  oneThatIsCreatingARelationWithAnother: string;
  target: string;
}

export const RelationTargetPicker = ({
  oneThatIsCreatingARelationWithAnother,
  target,
}: RelationTargetPickerProps) => {
  const { contentTypes, sortedContentTypesList } = useDataManager();
  const dispatch = useDispatch();
  const allowedContentTypesForRelation = sortedContentTypesList.filter(
    isAllowedContentTypesForRelations
  );

  const { plugin = null, schema: { displayName } = { displayName: 'error' } } =
    contentTypes?.[target] ?? {};

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const uid = e.target.value;
    const selected = allowedContentTypesForRelation.find((ct) => ct.uid === uid);
    if (selected) {
      const selectedContentTypeFriendlyName = selected.plugin
        ? `${selected.plugin}_${selected.title}`
        : selected.title;
      dispatch({
        type: ON_CHANGE_RELATION_TARGET,
        target: {
          value: uid,
          oneThatIsCreatingARelationWithAnother,
          selectedContentTypeFriendlyName,
          targetContentTypeAllowedRelations: selected.restrictRelationsTo,
        },
      });
    }
  };

  return (
    <select
      value={target}
      onChange={handleChange}
      style={{
        maxWidth: '16.8rem',
        padding: 'var(--ctb-space-2) var(--ctb-space-3)',
        border: '1px solid var(--ctb-border)',
        borderRadius: 'var(--ctb-radius-sm)',
        fontSize: 14,
        backgroundColor: 'var(--ctb-bg)',
      }}
    >
      {allowedContentTypesForRelation.map(({ uid, title, plugin: p }) => (
        <option key={uid} value={uid}>
          {title}
          {p && ` (from: ${p})`}
        </option>
      ))}
    </select>
  );
};
