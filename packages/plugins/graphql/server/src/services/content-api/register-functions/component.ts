import type { Core, Struct } from '@leao/types';
import type { TypeRegistry } from '../../type-registry';

const registerComponent = (
  contentType: Struct.ComponentSchema,
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

  const { getComponentName } = getService('utils').naming;
  const { KINDS } = getService('constants');

  const name = getComponentName(contentType);
  const definition = builders.buildTypeDefinition(contentType);

  registry.register(name, definition, { kind: KINDS.component, contentType });
};

export { registerComponent };
