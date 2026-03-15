import type { Core, Struct } from '@leao1/types';
import type { TypeRegistry } from '../../type-registry';

const registerFiltersDefinition = (
  contentType: Struct.Schema,
  {
    registry,
    leao,
    builders,
  }: {
    registry: TypeRegistry;
    leao: Core.Leao;
    builders: any;
  }
) => {
  const { service: getService } = leao.plugin('graphql');

  const { getFiltersInputTypeName } = getService('utils').naming;
  const { KINDS } = getService('constants');

  const type = getFiltersInputTypeName(contentType);
  const definition = builders.buildContentTypeFilters(contentType);

  registry.register(type, definition, { kind: KINDS.filtersInput, contentType });
};

export { registerFiltersDefinition };
