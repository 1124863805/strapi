import { Context } from 'koa';

import { leao as dataTransferLeao } from '@leao1/data-transfer';
import { errors } from '@leao1/utils';
import dataTransferAuthStrategy from '../../strategies/data-transfer';

const {
  remote: {
    handlers: { createPushController, createPullController },
  },
} = dataTransferLeao;

const { UnauthorizedError } = errors;

/**
 * @param ctx the koa context
 * @param scope the scope to verify
 */
const verify = async (ctx: Context, scope?: dataTransferLeao.remote.constants.TransferMethod) => {
  const { auth } = ctx.state;

  if (!auth) {
    throw new UnauthorizedError();
  }

  await dataTransferAuthStrategy.verify(auth, { scope });
};

export const push = createPushController({ verify });
export const pull = createPullController({ verify });

export default {
  push,
  pull,
};
