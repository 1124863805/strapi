import type { Core } from '@leao1/types';

export const destroyOnSignal = (leao: Core.Leao) => {
  let signalReceived = false;

  // For unknown reasons, we receive signals 2 times.
  // As a temporary fix, we ignore the signals received after the first one.

  const terminateLeao = async () => {
    if (!signalReceived) {
      signalReceived = true;
      await leao.destroy();
      process.exit();
    }
  };

  ['SIGTERM', 'SIGINT'].forEach((signal) => {
    process.on(signal, terminateLeao);
  });
};
