import { serverRestartWatcher } from './serverRestartWatcher';
import { UPDATE_INITIAL_STATE } from '../constants';

export interface ExecuteWithServerRestartDeps {
  lockAppWithAutoreload?: () => void;
  unlockAppWithAutoreload?: () => void;
  getData: () => Promise<void>;
  dispatch: (action: { type: string }) => void;
  updatePermissions: () => Promise<void>;
  onError: (err: unknown) => void;
  onSuccess?: () => void;
}

/**
 * 执行会触发服务端 reload 的 schema 变更操作。
 * 流程：lock -> mutation -> serverRestartWatcher -> unlock -> getData -> dispatch -> updatePermissions -> onSuccess
 */
export async function executeWithServerRestart(
  mutation: () => Promise<void>,
  deps: ExecuteWithServerRestartDeps
): Promise<void> {
  const {
    lockAppWithAutoreload,
    unlockAppWithAutoreload,
    getData,
    dispatch,
    updatePermissions,
    onError,
    onSuccess,
  } = deps;

  try {
    lockAppWithAutoreload?.();
    await mutation();
    await serverRestartWatcher(true);
    unlockAppWithAutoreload?.();
    await getData();
    dispatch({ type: UPDATE_INITIAL_STATE });
    await updatePermissions();
    onSuccess?.();
  } catch (err) {
    onError(err);
  } finally {
    unlockAppWithAutoreload?.();
  }
}
