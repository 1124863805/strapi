import type { Context } from '../../types';

const registerInternals = ({ registry, leao }: Context) => {
  const { buildInternalTypes } = leao.plugin('graphql').service('internals');

  const internalTypes = buildInternalTypes({ leao });

  for (const [kind, definitions] of Object.entries(internalTypes)) {
    registry.registerMany(Object.entries(definitions as any), { kind });
  }
};

export { registerInternals };
